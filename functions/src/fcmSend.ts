import * as admin from 'firebase-admin';

const MULTICAST_LIMIT = 500;

interface FcmTarget {
  uid: string;
  fcmToken: string;
}

export async function sendFcmToAll(
  targets: FcmTarget[],
  title: string,
  body: string,
  data: Record<string, string>,
): Promise<{ sent: number; failed: number; staleRemoved: number }> {
  const db = admin.firestore();
  let sent = 0;
  let failed = 0;
  const staleUids: string[] = [];

  for (let i = 0; i < targets.length; i += MULTICAST_LIMIT) {
    const chunk = targets.slice(i, i + MULTICAST_LIMIT);
    const tokens = chunk.map((t) => t.fcmToken);

    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: { title, body },
      data,
      android: {
        priority: 'high',
        notification: { channelId: 'default', sound: 'default' },
      },
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      sent += response.successCount;
      failed += response.failureCount;

      response.responses.forEach((resp, idx) => {
        if (resp.error) {
          const code = resp.error.code;
          if (
            code === 'messaging/registration-token-not-registered' ||
            code === 'messaging/invalid-registration-token'
          ) {
            staleUids.push(chunk[idx].uid);
          }
        }
      });
    } catch (err) {
      console.error('[fcmSend] multicast failed:', err);
      failed += chunk.length;
    }
  }

  // Clean up stale tokens in Firestore
  if (staleUids.length > 0) {
    console.log(`[fcmSend] Removing ${staleUids.length} stale FCM tokens`);
    const BATCH_LIMIT = 500;
    for (let i = 0; i < staleUids.length; i += BATCH_LIMIT) {
      const batch = db.batch();
      staleUids.slice(i, i + BATCH_LIMIT).forEach((uid) => {
        batch.update(db.collection('users').doc(uid), {
          fcmToken: admin.firestore.FieldValue.delete(),
          fcmTokenUpdatedAt: admin.firestore.FieldValue.delete(),
        });
      });
      await batch.commit();
    }
  }

  return { sent, failed, staleRemoved: staleUids.length };
}
