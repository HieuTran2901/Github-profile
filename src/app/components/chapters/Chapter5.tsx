import { memo } from "react";
import { Chapter5Fallback } from "./Chapter5Fallback";
import { Chapter5V2 } from "./Chapter5V2";

interface Props {
  chapterProgress: number;
  visible: boolean;
  globalProgress: number;
}

// =========================================================================
// CHAPTER 5 SWITCHABLE IMPLEMENTATION FLAG
// true  -> render Chapter5V2 (High-Fidelity 2:1 Media Layout & Sharp 2D Surface)
// false -> render Chapter5Fallback (Preserved immutable fallback)
// =========================================================================
export const USE_CHAPTER5_V2 = true;

export const Chapter5 = memo(function Chapter5(props: Props) {
  if (USE_CHAPTER5_V2) {
    return <Chapter5V2 {...props} />;
  }
  return <Chapter5Fallback {...props} />;
});


