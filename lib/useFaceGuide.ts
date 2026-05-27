import { useRef, useCallback } from 'react';
import type { Face } from 'react-native-vision-camera-face-detector';

export interface FaceGuideResult {
  nudgeKey: string | null;
  isReady: boolean;
}

interface OvalBounds {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

const MIN_RATIO = 0.45;
const MAX_RATIO = 0.80;
const CENTER_THRESHOLD = 0.18;
const STABILITY_THRESHOLD = 12;
const STABLE_FRAMES_REQUIRED = 3;

export function useFaceGuide(ovalBounds: OvalBounds) {
  const centroidHistory = useRef<{ x: number; y: number }[]>([]);
  const lastUpdateTime = useRef(0);

  const evaluate = useCallback(
    (faces: Face[]): FaceGuideResult | null => {
      const now = Date.now();
      if (now - lastUpdateTime.current < 100) {
        return null;
      }
      lastUpdateTime.current = now;

      if (faces.length === 0) {
        centroidHistory.current = [];
        return { nudgeKey: 'nudge_no_face', isReady: false };
      }

      const face =
        faces.length === 1
          ? faces[0]
          : faces.reduce((a, b) =>
              a.bounds.width * a.bounds.height >
              b.bounds.width * b.bounds.height
                ? a
                : b
            );

      const { bounds } = face;
      const faceCenterX = bounds.x + bounds.width / 2;
      const faceCenterY = bounds.y + bounds.height / 2;

      centroidHistory.current.push({ x: faceCenterX, y: faceCenterY });
      if (centroidHistory.current.length > STABLE_FRAMES_REQUIRED + 1) {
        centroidHistory.current.shift();
      }

      const widthRatio = bounds.width / ovalBounds.width;

      if (widthRatio < MIN_RATIO) {
        return { nudgeKey: 'nudge_closer', isReady: false };
      }
      if (widthRatio > MAX_RATIO) {
        return { nudgeKey: 'nudge_back', isReady: false };
      }

      const offsetX =
        Math.abs(faceCenterX - ovalBounds.centerX) / ovalBounds.width;
      const offsetY =
        Math.abs(faceCenterY - ovalBounds.centerY) / ovalBounds.height;

      if (offsetX > CENTER_THRESHOLD || offsetY > CENTER_THRESHOLD) {
        return { nudgeKey: 'nudge_center', isReady: false };
      }

      if (centroidHistory.current.length >= STABLE_FRAMES_REQUIRED) {
        const recent = centroidHistory.current;
        let maxDelta = 0;
        for (let i = 1; i < recent.length; i++) {
          const dx = recent[i].x - recent[i - 1].x;
          const dy = recent[i].y - recent[i - 1].y;
          maxDelta = Math.max(maxDelta, Math.sqrt(dx * dx + dy * dy));
        }
        if (maxDelta > STABILITY_THRESHOLD) {
          return { nudgeKey: 'nudge_steady', isReady: false };
        }
      }

      return { nudgeKey: 'nudge_ready', isReady: true };
    },
    [ovalBounds]
  );

  return evaluate;
}
