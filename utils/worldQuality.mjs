export const qualityLevels = {
  low: { pixelRatio: 1, particles: 18, fragments: 3, segments: 40, fps: 30 },
  medium: { pixelRatio: 1.25, particles: 38, fragments: 6, segments: 56, fps: 40 },
  high: { pixelRatio: 1.6, particles: 64, fragments: 10, segments: 80, fps: 60 }
};

export function chooseQuality({ width, cores = 4, memory = 4, saveData = false }) {
  if (saveData || cores <= 2 || memory <= 2) return "low";
  if (width < 700 && (cores < 8 || memory < 8)) return "low";
  if (width < 1200 || cores < 8 || memory < 8) return "medium";
  return "high";
}
