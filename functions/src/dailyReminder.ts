import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import { sendFcmToAll } from './fcmSend';
import { pickRandom } from './notificationCopy';

if (!admin.apps.length) {
  admin.initializeApp();
}

interface FcmTarget {
  uid: string;
  fcmToken: string;
}

async function runDailyReminder(): Promise<void> {
  const db = admin.firestore();
  const copy = pickRandom();

  console.log(`[dailyReminder] Sending: "${copy.title}" / "${copy.body}"`);

  const targets: FcmTarget[] = [];
  let lastDoc: admin.firestore.QueryDocumentSnapshot | null = null;
  const PAGE_SIZE = 500;

  while (true) {
    let query = db
      .collection('users')
      .where('fcmToken', '!=', null)
      .orderBy('fcmToken')
      .limit(PAGE_SIZE);

    if (lastDoc) query = query.startAfter(lastDoc);

    const snapshot = await query.get();
    if (snapshot.empty) break;

    snapshot.docs.forEach((doc) => {
      const token = doc.data().fcmToken as string | undefined;
      if (token) {
        targets.push({ uid: doc.id, fcmToken: token });
      }
    });

    if (snapshot.size < PAGE_SIZE) break;
    lastDoc = snapshot.docs[snapshot.docs.length - 1];
  }

  console.log(`[dailyReminder] Found ${targets.length} users with FCM tokens`);

  if (targets.length === 0) {
    console.log('[dailyReminder] No targets, skipping');
    return;
  }

  const result = await sendFcmToAll(
    targets,
    copy.title,
    copy.body,
    { type: 'daily_reminder', route: '/(tabs)' },
  );

  console.log(`[dailyReminder] Done — sent: ${result.sent}, failed: ${result.failed}, stale removed: ${result.staleRemoved}`);
}

// Cron: 9:00 AM IST = 03:30 UTC
export const dailyReminderScheduled = onSchedule(
  {
    schedule: '30 3 * * *',
    timeZone: 'UTC',
    region: 'asia-south1',
    memory: '256MiB',
    timeoutSeconds: 540,
  },
  async () => {
    await runDailyReminder();
  },
);

// HTTP trigger for manual test fires
export const sendDailyReminderNow = onRequest(
  { region: 'asia-south1', memory: '256MiB', timeoutSeconds: 540 },
  async (_req, res) => {
    await runDailyReminder();
    res.json({ ok: true, message: 'Daily reminder sent' });
  },
);
