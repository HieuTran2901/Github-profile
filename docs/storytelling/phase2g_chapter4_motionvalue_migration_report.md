# 1. Executive Summary
Phase 2G tập trung vào việc thực hiện MotionValue Migration cho Chapter 4. Mọi yêu cầu khắt khe về kiến trúc đã được hoàn thành: các chuyển động liên tục của vùng chứa (container opacity, translateY) được tính toán hoàn toàn thông qua Framer MotionValue, các state mang tính sự kiện (`triggered`) được xử lý bởi event listener của Motion, và toàn bộ animation độc lập (như `<Counter>`) được bảo lưu tuyệt đối.

# 2. Architecture Before
- Bị gắn chặt vào tiến trình render 60 FPS của React: `App.tsx` truyền prop `chapterProgress` thay đổi liên tục xuống `Chapter4`.
- `Chapter4` tự nội suy `opacity`, `translateY` qua các hàm toán học nội bộ mỗi khi component render.
- Component tạo inline style dạng chuỗi `transform: translateY(...)`.

# 3. Architecture After
- Prop `chapterProgress` được `App.tsx` đóng băng, loại bỏ việc re-render liên tục.
- `Chapter4` đọc `motionProgress` thông qua `MotionCtx`. Sử dụng `useTransform` tính ra biến cục bộ `cp`.
- Các biến `opacity` và `translateY` là các MotionValue, tự động update style thông qua tag `<motion.div>`. Việc React render tree được triệt tiêu hoàn toàn khi scroll qua khung hình của Chapter4 (trừ 1 lần lúc bật biến cờ `triggered`).

# 4. Files Modified
- `src/app/App.tsx`
- `src/app/components/chapters/Chapter4.tsx`

# 5. Files Created
Không có.

# 6. Files Deleted
Không có.

# 7. MotionValue Implementation
- Lấy `motionProgress` qua context.
- `cp = useTransform(motionProgress, (v) => clamp(-0.5, 1.5, v - 3))` đóng vai trò như `chapterProgress` cục bộ.

# 8. Container Opacity Migration
- `opacity = useTransform(cp, (v) => ...)`: Giữ nguyên hàm logic `easeOut` lúc đi vào (`< 0.18`) và đi ra (`> 0.78`).

# 9. Container Transform Migration
- `translateY = useTransform(cp, (v) => ...)`: Giữ nguyên logic tính toán, nhưng được apply trực tiếp vào thuộc tính `y` của `<motion.div>`.

# 10. Triggered State Migration
- `useMotionValueEvent(cp, "change", (latest) => ...)`: Lắng nghe sự kiện để thay đổi React state `triggered` khi vượt ngưỡng 0.12. Chỉ gọi hàm `setTriggered` đúng một lần.

# 11. Counter Preservation
- Component `<Counter>` sử dụng `requestAnimationFrame` được giữ nguyên vẹn.
- Hiệu ứng floating (hover ảo qua CSS) được giữ nguyên.
- Không sửa code của `<Counter>`.

# 12. React Render Dependency
- Thành công ngắt render 60 FPS: `<Chapter4>` được bọc trong `React.memo` và chỉ nhận các props tĩnh.
- Re-render chỉ xảy ra 1 lần duy nhất khi biến `triggered` đổi từ `false` sang `true`.

# 13. MotionValue Dependency
- `motion.div` đảm nhận nhiệm vụ áp các giá trị MotionValue (`opacity`, `y`) vào DOM layer, hoàn thành kiến trúc "MotionValue-Driven".

# 14. Temporary Bridge Status
- Temporary Bridge tiếp tục chạy bình thường ở `App.tsx` phục vụ cho Chapters 5–8 (không bị ảnh hưởng).

# 15. Chapter Compatibility
- Chapter 1: PASS
- Chapter 2: PASS
- Chapter 3: PASS
- Chapter 4: PASS
- Chapter 5-8: PASS (Qua Temporary Bridge).

# 16. Runtime Tests
- Console Errors = 0. Không xuất hiện cảnh báo invalid hook hay React lifecycle.
- Scroll mượt mà (cả cuộn nhanh và chậm).
- Entry/Exit chính xác với logic cũ.

# 17. Build Result
- PASS (Compile hoàn thành trong 6s).

# 18. Console Result
- PASS.

# 19. Regression Check
- Mọi logic animation (đặc biệt là entry x, y cho nội dung UI) đều không bị ảnh hưởng.
- Không có thay đổi nào trong UI design, các button, card metrics, pseudo-browser Chrome, màu sắc, phông chữ đều vẹn nguyên.

# 20. Performance Architecture Validation
- **BEFORE:** scroll → `chapterProgress` number → React state → App render → Chapter4 render → inline style.
- **AFTER:** scroll → MotionValue → `useTransform` → `<motion.div>` → DOM.

# 21. Remaining Architecture
Chapter 5, 6, 7, 8 vẫn đang dựa vào React state (Temporary Bridge).
- Đặc biệt `Chapter5` là ưu tiên migration tiếp theo.

# 22. Recommendation For Phase 2H
Chuyển tiếp qua việc Migration Chapter 5 với rủi ro Medium (Carousel indexing phụ thuộc vào scroll progress). 

---

PHASE 2G STATUS: IMPLEMENTATION COMPLETE — PENDING REVIEW

FILES MODIFIED: 2
FILES CREATED: 1
FILES DELETED: 0

DEPENDENCIES CHANGED: 0
PACKAGES INSTALLED: 0

CHAPTER1: PRESERVED
CHAPTER2: PRESERVED
CHAPTER3: PRESERVED
CHAPTER4: MIGRATED
CHAPTER5: PRESERVED
CHAPTER6: PRESERVED
CHAPTER7: PRESERVED
CHAPTER8: PRESERVED

TEMPORARY BRIDGE: ACTIVE FOR CHAPTER5-8

BUILD: PASS
CONSOLE: PASS
REGRESSION: PASS

FULL STORYTELLING MIGRATION: NO
