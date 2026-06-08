import * as FileSystem from 'expo-file-system/legacy';

const SCAN_IMAGES_DIR = `${FileSystem.documentDirectory}scan-images/`;

let dirReady = false;

async function ensureDir() {
  if (dirReady) return;
  const info = await FileSystem.getInfoAsync(SCAN_IMAGES_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(SCAN_IMAGES_DIR, { intermediates: true });
  }
  dirReady = true;
}

export function getScanImagePath(scanId: string): string {
  return `${SCAN_IMAGES_DIR}${scanId}.jpg`;
}

export async function persistScanImage(scanId: string, sourceUri: string): Promise<string> {
  await ensureDir();
  const dest = getScanImagePath(scanId);
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
