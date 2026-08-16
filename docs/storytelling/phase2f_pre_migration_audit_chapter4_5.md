# 1. Executive Summary
Bản báo cáo này thực hiện đánh giá toàn diện (Pre-Migration Audit) cho Chapter 4 và Chapter 5 để chuẩn bị cho việc chuyển đổi kiến trúc sang `MotionValue`. 
- **Chapter 4** sở hữu cấu trúc khá đơn giản tương tự Chapter 3, phần lớn xoay quanh hiệu ứng ra/vào cho container và một số animation trigger khi cuộn qua ngưỡng.
- **Chapter 5** phức tạp hơn do sở hữu cơ chế cập nhật trạng thái `activeProject` gián đoạn, dựa trên biến đổi cuộn để giả lập dạng "Horizontal Story" (carousel thay đổi nội dung qua mỗi mức progress). Cấu trúc này tương đồng với độ phức tạp của Chapter 2.
- **Đề xuất**: Tiến hành chuyển đổi **Chapter 4 trước**, nhằm hoàn thiện dễ dàng trước khi đi vào độ phức tạp của hybrid mapping ở Chapter 5.

---

# 2. Chapter 4 Architecture Audit
Chapter 4 xử lý một phần hiển thị tĩnh kèm hiệu ứng ra vào đơn giản. Cấu trúc bao gồm một root container có thuộc tính `opacity` và `translateY` được nội suy liên tục từ `chapterProgress`. Các thành phần bên trong (tiêu đề, thẻ công nghệ, mockup, counter) được kích hoạt bởi trạng thái `triggered` (một chiều). Hiệu ứng của component `Counter` chạy hoàn toàn độc lập thông qua `requestAnimationFrame`.

# 3. Chapter 4 Props
- `chapterProgress` (number): Dùng để thực hiện phép nội suy toán học thủ công tính `opacity`, `translateY`. Dùng làm tham số theo dõi trong `useEffect` để bật state `triggered` khi vượt ngưỡng 0.12.
- `visible` (boolean): Dùng để ngắt luồng render sớm (`if (!visible) return null;`) giúp tối ưu hiệu năng khi ngoài màn hình.
- `globalProgress` (number): Tồn tại trong Props interface nhưng không được sử dụng.

# 4. Chapter 4 State Dependencies
- `triggered` (useState, false): Khởi tạo `false`. Được bật thành `true` duy nhất một lần bởi `useEffect` khi `chapterProgress > 0.12`. Bắt buộc React render lại để kích hoạt các thẻ `<motion.div>` con và animation cho counter.
- `val` (useState, 0) bên trong `<Counter>`: Chứa giá trị đếm số, cập nhật liên tục thông qua `requestAnimationFrame`, không phụ thuộc vào tiến trình cuộn.
- `startedRef` (useRef, false): Ngăn chặn `requestAnimationFrame` chạy nhiều lần.
- `rafRef` (useRef, 0): Chứa ID của request để dọn dẹp (cleanup).

# 5. Chapter 4 Animation Inventory

| Animation | Current mechanism | Scroll dependent? | Continuous / Discrete | MotionValue strategy | Risk |
| --------- | ----------------- | ----------------: | --------------------- | -------------------- | ---- |
| Container Opacity | Thủ công `easeOut` → Inline Style | YES | Continuous | A — Direct MotionValue | LOW |
| Container translateY | Thủ công `easeOut` → Inline Style | YES | Continuous | A — Direct MotionValue | LOW |
| Content Entry (x, y, op) | `triggered` → `<motion.div>` | NO (Trigger 1 lần) | Discrete | C — Hybrid MotionValue + React State | LOW |
| Tech Stack Float | CSS `floatY` bật bởi `triggered` | NO | Discrete | E — Independent | LOW |
| Metric Counter | `requestAnimationFrame` | NO | Discrete | E — Independent | LOW |

# 6. Chapter 4 React Render Dependency
- **CÓ RE-RENDER.**
- **Nguyên nhân:** Prop `chapterProgress` được thay đổi và truyền xuống 60 lần/giây từ `App.tsx`. 
- **Phần thực sự cần re-render:** Chỉ duy nhất thời điểm `triggered` thay đổi (chuyển từ `false` → `true`). Component `<Counter>` tự trigger render cục bộ của nó, không cần prop từ ngoài.
- **Phần chỉ cần MotionValue:** Root `div` điều khiển `opacity` và `translateY`. 

# 7. Chapter 4 Migration Difficulty
**LOW**. 
Cấu trúc Chapter 4 hoàn toàn tương tự Chapter 3. Có thể dùng `useTransform` trực tiếp cho opacity/y và dùng `useMotionValueEvent` để bắt `triggered`.

---

# 8. Chapter 5 Architecture Audit
Chapter 5 là một dạng Horizontal Story (mặc dù không cuộn ngang CSS thực sự). Màn hình chia thành danh sách bên trái và nội dung hiển thị bên phải. Tiến trình `chapterProgress` được sử dụng để nội suy biến `inner` (0 → 0.99), từ đó nhân với tổng số lượng dự án để tìm ra `idx` (index của project). Chỉ số này quyết định React State `activeProject`. Khi `activeProject` thay đổi, thành phần `<AnimatePresence>` bên phải sẽ tự động animate nội dung ra/vào.

# 9. Chapter 5 Props
- `chapterProgress` (number): Dùng tính `opacity`, `translateY` vào/ra scene. Quan trọng nhất là dùng làm biến đầu vào `useEffect` để tính index cho `activeProject`. 
- `visible` (boolean): Dùng để tối ưu unmount (`if (!visible) return null;`).
- `globalProgress` (number): Khai báo nhưng không sử dụng.

# 10. Chapter 5 State Dependencies
- `triggered` (useState, false): Bật khi `chapterProgress > 0.08`. Dùng để theo dõi ban đầu.
- `activeProject` (useState, 0): State tối quan trọng chứa index của dự án đang hiển thị. Được update mỗi khi tính toán chỉ số index mới khác với chỉ số cũ dựa vào `chapterProgress`. Trigger React re-render trực tiếp để Render List và render AnimatePresence. Phụ thuộc lớn vào tiến trình cuộn.

# 11. Chapter 5 Animation Inventory

| Animation | Current mechanism | Scroll dependent? | Continuous / Discrete | MotionValue strategy | Risk |
| --------- | ----------------- | ----------------: | --------------------- | -------------------- | ---- |
| Container Opacity | Thủ công `easeOut` → Inline Style | YES | Continuous | A — Direct MotionValue | LOW |
| Container translateY | Thủ công `easeOut` → Inline Style | YES | Continuous | A — Direct MotionValue | LOW |
| Active Project Indicator | Dựa vào state `activeProject` | YES | Discrete | D — React State (via `useMotionValueEvent`) | LOW |
| Project Content Transition | `<AnimatePresence>` | NO (dựa theo state) | Discrete | D — React State | LOW |
| Ambient Bg Color | Nội suy màu qua React tree | YES | Discrete | D — React State | MEDIUM |
| Dots Progress Bar | Dựa vào state `activeProject` | YES | Discrete | D — React State | LOW |

# 12. Chapter 5 React Render Dependency
- **CÓ RE-RENDER.**
- **Nguyên nhân:** Prop `chapterProgress` được truyền xuống 60 FPS từ `App.tsx`.
- Cấu trúc cần hybrid: Layout chỉ thực sự cần render khi chuyển sang project mới (`activeProject` thay đổi). `opacity` và `translateY` của vỏ ngoài nên là MotionValue thuần.

# 13. Chapter 5 Migration Difficulty
**MEDIUM**. 
Cần bóc tách các biến `opacity`, `translateY` để chặn re-render 60 FPS, đồng thời giữ nguyên logic `activeProject` thông qua `useMotionValueEvent` tương tự những gì đã làm ở Chapter 2.

---

# 14. Temporary Bridge Impact
- Hiện tại, `App.tsx` truyền trực tiếp `chapterProgress` xuống cho cả Chapter 4 và 5 qua `.map`.
- Ta hoàn toàn có thể đóng băng props (truyền `0` nếu `i === 3` hoặc `i === 4`) trong vòng lặp `.map` ở `App.tsx`. Các chapter còn lại (6, 7, 8) vẫn sẽ nhận data từ Temporary Bridge, đảm bảo độ an toàn độc lập 100%.

# 15. Migration Boundary
Nếu thực hiện Migration, chỉ cần thiết phải sửa đổi các file sau:
1. `src/app/App.tsx` (Thêm điều kiện đóng băng prop cho `i === 3` và `i === 4`).
2. `src/app/components/chapters/Chapter4.tsx`
3. `src/app/components/chapters/Chapter5.tsx`

# 16. Recommended Migration Order
**Đề xuất Chapter 4 FIRST.**
Chapter 4 rất giống với cơ chế tĩnh của Chapter 3 (dễ, rủi ro thấp). Chapter 5 lại đòi hỏi quy trình hybrid phức tạp hơn (giống Chapter 2). Bắt đầu với Chapter 4 giúp củng cố tính trơn tru và tạo đà tâm lý an toàn trước khi vào phần nặng hơn ở Chapter 5.

# 17. Risk Assessment
- Rủi ro chung là khá thấp vì cấu trúc project tách bạch rõ ràng.
- Ở Chapter 5, rủi ro vừa (Medium) nằm ở việc giữ vững đồng bộ index của `activeProject` thông qua `useMotionValueEvent`. Tuy nhiên, kinh nghiệm ở Chapter 2 đảm bảo rủi ro này trong vòng kiểm soát.

# 18. Safety Assessment
- Can Chapter4 be migrated safely? **YES**.
- Can Chapter5 be migrated safely? **YES**.
- Can they be migrated together? **NO**. Nên thực hiện tuần tự để cô lập và xử lý sự cố dứt điểm (Regression tracking dễ dàng hơn).

# 19. Baseline Build Result
- **Baseline Build: PASS** (Vite compile mất ~9s).

# 20. Recommended Next Phase
Khuyến nghị bước kế tiếp:
**PHASE 2G — CHAPTER 4 MOTIONVALUE MIGRATION**

---

# FINAL STATUS
PHASE 2F STATUS: AUDIT COMPLETE

FILES MODIFIED: 0
FILES CREATED: 1
FILES DELETED: 0
DEPENDENCIES CHANGED: 0
CONFIGURATION CHANGED: 0
SOURCE CODE MIGRATED: NO

CHAPTER 4 MIGRATION: PENDING REVIEW
CHAPTER 5 MIGRATION: PENDING REVIEW
