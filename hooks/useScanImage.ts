import { useState, useEffect } from 'react';
import { scanImageExists } from '@/lib/scanImages';

export function useScanImage(imageUrl: string | undefined): boolean {
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setHasImage(false);
      return;
    }
    let cancelled = false;
    scanImageExists(imageUrl).then((exists) => {
      if (!cancelled) setHasImage(exists);
    });
    return () => { cancelled = true; };
  }, [imageUrl]);

  return hasImage;
}
