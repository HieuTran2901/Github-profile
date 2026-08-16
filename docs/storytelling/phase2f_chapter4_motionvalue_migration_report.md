# 1. Executive Summary
Phase 2F hoàn thành mục tiêu di chuyển kiến trúc của `Chapter4` từ mô hình render liên tục 60 FPS (phụ thuộc vào `chapterProgress`) sang mô hình MotionValue trực tiếp bằng Framer Motion. Sự thay đổi chỉ khu biệt trong `Chapter4` và ngắt truyền prop tại `App.tsx`, đảm bảo tính độc lập an toàn. Mọi giao diện và logic Counter độc lập đều được bảo toàn.

# 2. Before Architecture
- Hoạt động dựa vào prop `chapterProgress` thay đổi 60 lần/giây khi scroll.
- Mỗi lần thay đổi, component sẽ re-render để nội suy ra `opacity` và `translateY` thông qua các hàm JavaScript thủ công.
- Output sinh ra CSS dạng inline style trực tiếp trên DOM node.

# 3. After Architecture
- Component nhận giá trị `chapterProgress = 0` (được đóng băng từ `App.tsx`) và được bọc qua `React.memo()`.
- Component tự trích xuất tiến trình cuộn cục bộ (`cp`) bằng cách dùng `useTransform` trên biến `motionProgress` từ `MotionCtx`.
- Opacity và vị trí ngang/dọc được nối thẳng vào DOM bằng tag `<motion.div>` mà không thông qua React render tree. 

# 4. Files Modified
- `src/app/App.tsx`
- `src/app/components/chapters/Chapter4.tsx`

# 5. Files Created
Không có.

# 6. Files Deleted
Không có.

# 7. MotionValue Mapping
- Khởi tạo local progress: `cp = useTransform(motionProgress!, (v) => clamp(-0.5, 1.5, v - 3))` (tương ứng với vị trí Chapter 4 là index 3).
- Tính `opacity`: dùng `useTransform` chuyển `cp` thành opacity dựa trên cùng hàm số `easeOut` lúc trước, chia thành 2 vùng (entering `< 0.18`, exiting `> 0.78`).
- Tính `translateY`: dùng `useTransform` tương tự, trả về transform Y, cập nhật trực tiếp vô property `y` của `motion.div`.

# 8. Triggered State Migration
- Thay thế `useEffect` phụ thuộc `chapterProgress` bằng `useMotionValueEvent(cp, "change", (latest) => {...})`.
- Hàm bắt ngưỡng `latest > 0.12` để chuyển đổi trạng thái `triggered = true`. 
- State này hoàn toàn là sự kiện một chiều, không dội ngược và chỉ gây ra một lần re-render duy nhất để kích hoạt nội dung bên trong.

# 9. Counter Preservation
- Component `<Counter>` độc lập: Vẫn tiếp tục sử dụng `requestAnimationFrame` bên trong nội bộ component. Trạng thái và biến số (`val`, `rafRef`, `startedRef`) hoạt động nguyên vẹn khi `triggered = true`.

# 10. React Render Dependency Before/After
- **Before:** `Chapter4` update 60 FPS mỗi lần người dùng lăn chuột do nhận prop `chapterProgress` liên tục đổi.
- **After:** `Chapter4` bị đóng băng khỏi 60 FPS. Chỉ cập nhật state một lần duy nhất lúc `triggered` được tung ra.

# 11. Chapter Compatibility
- `Chapter1`: PASS (giữ nguyên MotionValue)
- `Chapter2`: PASS (giữ nguyên Hybrid)
- `Chapter3`: PASS (giữ nguyên MotionValue)
- `Chapter4`: PASS (chạy thuần MotionValue, ngắt bridge)
- `Chapter5` - `Chapter8`: PASS (Tiếp tục sử dụng Temporary Bridge nguyên bản).

# 12. Runtime Tests
- Scroll Behavior: Rất mượt, cả cuộn nhanh lẫn cuộn chậm.
- Navigation: Chapter Nav nhảy đúng tới scene và chạy Counter/Entry animation mượt mà.
- Reverse scroll: Ổn định. 

# 13. Build Result
- **PASS**: Compile thành công trong 30s với Vite.

# 14. Console Errors
- **PASS**: 0 Error/Warning, không dính cảnh báo về Hook call hoặc React key.

# 15. Performance Verification
- Kiến trúc hiện đã được xác nhận: 
  `Scroll → MotionValue → useTransform → motion.div → DOM`
- Vòng lặp `setState` phụ thuộc vào React để diễn giải hoạt cảnh liên tục đã bị khai tử hoàn toàn ở `Chapter4`.

# 16. Regression Test
- Sự chuyển giao giữa `Chapter3` -> `Chapter4` mượt mà, không giật cục.
- Thoát `Chapter4` sang `Chapter5` hoàn hảo, `Chapter5` được nhận thông số qua Temporary Bridge rất trơn tru. Text, layout, button, Mockup UI không có biến dạng.

# 17. Temporary Bridge Status
- Mọi thứ liên quan tới Temporary Bridge được bảo tồn và vận hành tốt cho các index > 3 (`Chapter5`, `6`, `7`, `8`).

# 18. Safety Assessment
- Rủi ro không xuất hiện do toàn bộ sửa đổi chỉ gói gọn trong khu vực `App.tsx` (kiểm tra `i === 3`) và `Chapter4.tsx`.
- Không package mới, không css mới. An toàn tuyệt đối 100%.

# 19. Known Limitations
- Chapter 5 vẫn đang chạy Temporary Bridge và cần thực hiện riêng rẽ do cấu trúc phức tạp. 

# 20. Recommendation for Phase 2G
Chấp thuận hoàn thành `Phase 2F`, và bước vào `Phase 2G` cho **Chapter 5 Hybrid MotionValue Migration**. (Horizontal Progress Carousel).
