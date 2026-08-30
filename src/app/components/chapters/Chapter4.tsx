import { memo } from "react";
import { Chapter4Fallback } from "./Chapter4Fallback";
import { Chapter4V2 } from "./Chapter4V2";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

// =========================================================================
// CHAPTER 4 SWITCHABLE IMPLEMENTATION FLAG
// true  -> render Chapter4V2 (Upcoming Cinematic Video Integration shell)
// false -> render Chapter4Fallback (Preserved immutable fallback)
// =========================================================================
export const USE_CHAPTER4_V2 = true;

export const Chapter4 = memo(function Chapter4(props: Props) {
  if (USE_CHAPTER4_V2) {
    return <Chapter4V2 {...props} />;
  }
  return <Chapter4Fallback {...props} />;
});

