# PHASE 3A — STORYTELLING VISUAL & 3D FOUNDATION AUDIT REPORT

## 1. Current Visual Architecture
- Dự án đang chạy trên **Pure MotionValue Architecture** (hoàn tất ở Phase 2K): Native Browser Scroll → `scrollYProgress` → `motionProgress` → `MotionCtx` → Local scene `useTransform` → DOM.
- Tốc độ cuộn và tương tác chuột đạt chuẩn 0 FPS React re-render overhead cho mọi hoạt ảnh liên tục.
- Độ sâu không gian hiện tại (Depth): Chủ yếu dựa trên CSS 2D translate, opacity fade, scale nhè nhẹ và mouse parallax.

## 2. Chapter-by-Chapter 3D Opportunity

| Chapter | Current Visual | 3D Opportunity | Recommended Technique | Complexity | Performance Risk | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| **Chapter 1 (Intro)** | Name char split (`rotateX: -70` entry), mouse parallax, decorative background text. | 3D Spatial Depth & Perspective Tilt (pitch/yaw) + multi-layer `translateZ` spatial hierarchy. | A — CSS 3D + B — Framer Motion transform | LOW-MEDIUM | VERY LOW | **HIGH (Prototype Implemented)** |
| **Chapter 2 (Journey)** | Vertical timeline, active milestone card, decorative background year. | CSS 3D perspective depth for active milestone card stack / year text depth tilt. | A — CSS 3D + B — Framer Motion transform | MEDIUM | LOW | MEDIUM |
| **Chapter 3 (Skills)** | Radial background grid, floating skill orbs with mouse magnet pull. | 3D orb sphere spatial depth / CSS 3D `translateZ` and `rotateY` tilt. | A — CSS 3D + C — Parallax | LOW | VERY LOW | HIGH |
| **Chapter 4 (Project)** | Featured project card, fake browser mockup chrome, tech pills, metrics grid. | CSS 3D browser card spatial tilt (`rotateX`, `rotateY`, dynamic depth shadow). | A — CSS 3D + B — Framer Motion transform | MEDIUM | LOW | HIGH |
| **Chapter 5 (Gallery)** | Horizontal project showcase, project detail pane, number watermark. | CSS 3D card deck spatial depth transition. | A — CSS 3D + B — Framer Motion transform | MEDIUM | LOW | MEDIUM |
| **Chapter 6 (Workflow)** | Workflow pipeline track, step nodes, active detail text. | 3D perspective track depth & node elevation. | A — CSS 3D + C — Parallax | LOW | VERY LOW | LOW |
| **Chapter 7 (Stats)** | GitHub stats grid, contribution heatmap grid, language bars. | CSS 3D tile lift on hover & perspective tilt on grid container. | A — CSS 3D | LOW | VERY LOW | LOW |
| **Chapter 8 (Contact)** | Big headline, CTA button, decorative background rings, social links. | CSS 3D CTA spatial depth elevation & decorative ring spatial rotation. | A — CSS 3D + C — Parallax | LOW | VERY LOW | MEDIUM |

## 3. Recommended Technology
- **CSS 3D + Framer Motion Derived MotionValues (HYBRID)**.
- **Why CSS 3D / Framer Motion?**
  1. Không đòi hỏi cài đặt thêm bất kỳ thư viện 3D nặng nào (Three.js / React Three Fiber / WebGL) giúp giữ bundle size nhỏ nhẹ (< 350KB js).
  2. Natively GPU-accelerated via `perspective`, `transform-style: preserve-3d`, `rotateX`, `rotateY`, `translateZ`.
  3. Hoàn toàn tích hợp thẳng vào luồng MotionValue hiện tại, giữ đúng tiêu chuẩn 0 FPS React re-render overhead.

## 4. Performance Considerations
- Sử dụng CSS `perspective: 1200px` trên container và `transformStyle: "preserve-3d"` trên child nodes.
- Toàn bộ góc quay 3D (`rotateX`, `rotateY`) được nội suy qua `useTransform` trực tiếp từ `motionProgress` và `mouse`, không tốn chi phí layout thrashing hay repaint canvas.

## 5. Prototype Implementation (Chapter 1)
- Đã nâng cấp `Chapter1.tsx` thành **3D Spatial Depth Prototype**:
  - Gắn `perspective: 1200px` & `transformStyle: "preserve-3d"` ở root wrapper.
  - Tạo MotionValue `rotateX = useTransform(cp, (v) => (v > 0 ? -v * 12 : 0))` nghiêng góc nhìn 3D theo chiều ngang khi bắt đầu cuộn scene.
  - Phân lớp không gian thực thụ bằng `translateZ`:
    - Decorative background text `HIEU`: `translateZ(-150px)`
    - Pre-label "MY NAME IS": `translateZ(20px)`
    - Main Name ("TRAN HUU TRUNG HIEU"): `translateZ(60px)`
    - Role Badge: `translateZ(40px)`
    - Tagline: `translateZ(30px)`
    - CTA Buttons: `translateZ(50px)`

## 6. Files Modified
- `src/app/components/chapters/Chapter1.tsx`

## 7. Files Created
- `docs/storytelling/phase3a_3d_foundation_audit.md`

## 8. Files Deleted
- Không có.

## 9. Dependencies Changed
- NO (0 packages added or modified).

## 10. Build Result
- **PASS**: Vite build thành công trong 11.81s mà không dính bất kỳ lỗi nào.

## 11. Runtime Result
- **PASS**: Hoạt cảnh 3D nghiêng không gian hiển thị mượt mà trên GPU, tạo hiệu ứng có chiều sâu ấn tượng khi cuộn trang.

## 12. Console Result
- **PASS**: 0 Errors / Warnings.

## 13. Regression Result
- **PASS**: Mọi text, layout, button, responsive font-size của Chapter 1 đều giữ nguyên vẹn 100%.Các Chapter 2-8 hoạt động bình thường.

## 14. Mobile Result
- **PASS**: Hoạt động mượt mà trên giao diện mobile (native scroll).

## 15. Performance Result
- **PASS**: 0 FPS React re-render overhead.

## 16. Recommended Phase 3B
- Tiến hành **PHASE 3B — CHAPTER 3 & CHAPTER 4 SPATIAL 3D ENHANCEMENTS** (Nâng cấp độ sâu CSS 3D cho Skill Orbs ở Chapter 3 và Project Card / Browser Mockup ở Chapter 4).

---

PHASE 3A STATUS:
IMPLEMENTATION COMPLETE

3D STRATEGY:
CSS3D / FRAMER_MOTION

PROTOTYPE CHAPTER:
Chapter 1

FILES MODIFIED:
1

FILES CREATED:
1

FILES DELETED:
0

DEPENDENCIES CHANGED:
NO

MOTIONVALUE ARCHITECTURE:
PRESERVED

REACT CONTINUOUS SCROLL STATE:
NONE

BUILD:
PASS

CONSOLE:
PASS

RUNTIME:
PASS

REGRESSION:
PASS

MOBILE:
PASS

PERFORMANCE:
PASS

PHASE 3A REPORT:
docs/storytelling/phase3a_3d_foundation_audit.md

NEXT RECOMMENDED PHASE:
PHASE 3B — CHAPTER 3 & 4 SPATIAL 3D ENHANCEMENTS
