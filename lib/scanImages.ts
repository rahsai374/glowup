import * as FileSystem from 'expo-file-system/legacy';

const SCAN_IMAGES_DIR = `${FileSystem.documentDirectory}scan-images/`;

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(SCAN_IMAGES_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(SCAN_IMAGES_DIR, { intermediates: true });
  }
}

export async function persistScanImage(scanId: string, sourceUri: string): Promise<string> {
  await ensureDir();
  const dest = `${SCAN_IMAGES_DIR}${scanId}.jpg`;
  await FileSystem.copyAsync({ from: sourceUri, to: dest });
  return dest;
}

export async function scanImageExists(uri: string): Promise<boolean> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    return info.exists;
  } catch {
    return false;
  }
}
