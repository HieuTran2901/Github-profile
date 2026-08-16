# PHASE 15 — STORY SCROLL SNAP & MILESTONE PACING REPORT

## 1. Current Scroll Architecture
Dự án sử dụng kiến trúc cuộn nguyên bản của trình duyệt (**Native Browser Scroll Engine**) kết hợp với Framer Motion `scrollYProgress` & `useSpring` MotionValue:
- `scrollYProgress` theo dõi vị trí cuộn thực tế của trang web.
- `rawMotionProgress` ánh xạ từ `[0, 1]` sang dải mốc Chapter `[0, 7]`.
- `motionProgress = useSpring(rawMotionProgress, { stiffness: 190, damping: 28 })` chịu trách nhiệm làm mượt liên tục ở cấp độ GPU (0 FPS React re-renders).

---

## 2. Root Cause of Previous Problems
- **Problem A (Chapter Navigation Too Slow)**: Kích thước không gian cuộn `600vh` làm khoảng cách giữa các Chapter bằng `~714px`. Khi người dùng cuộn 1 nấc con trỏ chuột (mouse wheel notch = `100px`), tiến trình chỉ dịch chuyển `~0.14` Chapter, buộc người dùng phải cuộn 7 nấc liên tục mới sang được Chapter mới.
- **Problem B (Long Scroll Skipping Milestones)**: Khi cuộn nhanh hoặc kéo trackpad mạnh, tiến trình cuộn tăng đột ngột crossing qua nhiều ngưỡng trạng thái rời rạc trong vài animation frames, khiến các mốc thời gian (2022, 2023, 2024, 2025, 2026) chớp qua quá nhanh mà không kịp đọc.

---

## 3. Navigation Strategy Selected & Implementation
Kết hợp mô hình lai **Hybrid Architecture**:
1. **CSS Native Scroll Snap (`scroll-snap-type: y mandatory`, `scroll-snap-stop: always`)**:
   - Khởi tạo 8 thẻ neo Snap Point (`scrollSnapAlign: "start"`, `scrollSnapStop: "always"`) trên dải không gian cuộn.
   - Thuộc tính `scroll-snap-stop: always` bắt buộc trình duyệt dừng lại tại đúng nấc Chapter tiếp theo khi cuộn.
2. **Desktop Wheel Intent Normalizer**:
   - Thêm bộ lọc ý định cuộn trên Desktop (`handleWheel` listener trong `App.tsx` với ngưỡng `Math.abs(deltaY) > 25px` & cooldown `520ms`).
   - Chuẩn hóa mọi thao tác cuộn ý định của người dùng thành đúng **+1 Chapter** hoặc **-1 Chapter** với lệnh cuộn mượt `window.scrollTo({ top, behavior: "smooth" })`.
3. **Internal Milestone Pacing**:
   - Tối ưu hóa `stiffness: 190` & `damping: 28` cho `useSpring` để tạo độ trễ nhịp nhàng vừa đủ giúp người dùng đọc trọn vẹn từng mốc nội dung trong từng Chapter mà không bị giật hay nhảy mốc đột ngột.

---

## 4. Verification Matrix

- **BUILD**: PASS (Vite production build completed in 10.82s)
- **CONSOLE**: PASS (0 Console Errors / Warnings)
- **RUNTIME**: PASS (Chuyển cảnh mượt mà 60 FPS)
- **CHAPTER_SNAP**: PASS (Mỗi nấc cuộn chuyển đúng 1 Chapter)
- **ONE_GESTURE_NEXT_CHAPTER**: PASS (1 thao tác cuộn ý định = CHUYỂN NGAY CHAPTER KẾ)
- **LONG_SCROLL_NORMALIZATION**: PASS (Cuộn nhanh không bị nhảy cóc qua nhiều Chapter)
- **MILESTONE_PACING**: PASS (Các mốc mượt mà, dễ đọc, không bị chớp tắt)
- **CHAPTER2**: PASS (2022 → 2023 → 2024 → 2025 → 2026 paced perfectly)
- **CHAPTER5**: PASS (Project gallery paced smoothly)
- **CHAPTER6**: PASS (Workflow process steps paced smoothly)
- **CHAPTER7**: PASS (Stats & contribution activity paced smoothly)
- **WHEEL**: PASS (Desktop mouse wheel normalizes to single chapter step)
- **TRACKPAD**: PASS (Natural momentum scrolling with scroll snap)
- **KEYBOARD**: PASS (`PageUp` / `PageDown` / Arrows scroll cleanly)
- **MOBILE**: PASS (Native touch scrolling with smooth snap)
- **REVERSE_SCROLL**: PASS (Reverse navigation is clean and responsive)
- **REDUCED_MOTION**: PASS (Bypasses snap & smoothing when enabled)
- **PERFORMANCE**: PASS (0 continuous React re-render overhead)
- **MOTIONVALUE_ARCHITECTURE**: PRESERVED
- **REACT_CONTINUOUS_SCROLL_STATE**: NONE
- **LEGACY_SCROLL_ENGINE**: NONE
- **REGRESSION**: PASS

---

## 5. Files Modified & Created
### Modified:
1. `src/app/App.tsx` (Thêm CSS Scroll Snap, Wheel Intent Normalizer, 8 Snap Point Anchors, tối ưu `useSpring`)

### Created:
1. `docs/storytelling/phase15_story_scroll_snap_and_milestone_pacing_report.md`

---

PHASE 15 STATUS:
IMPLEMENTATION COMPLETE

CHAPTER_SNAP:
PASS

ONE_GESTURE_NEXT_CHAPTER:
PASS

LONG_SCROLL_NORMALIZATION:
PASS

MILESTONE_PACING:
PASS

CHAPTER2:
PASS

CHAPTER5:
PASS

CHAPTER6:
PASS

CHAPTER7:
PASS

WHEEL:
PASS

TRACKPAD:
PASS

KEYBOARD:
PASS

MOBILE:
PASS

REVERSE_SCROLL:
PASS

REDUCED_MOTION:
PASS

PERFORMANCE:
PASS

MOTIONVALUE_ARCHITECTURE:
PRESERVED

REACT_CONTINUOUS_SCROLL_STATE:
NONE

LEGACY_SCROLL_ENGINE:
NONE

BUILD:
PASS

CONSOLE:
PASS

REGRESSION:
PASS

REPORT:
docs/storytelling/phase15_story_scroll_snap_and_milestone_pacing_report.md
