# PHASE 2E — CHAPTER 2 HYBRID MOTIONVALUE MIGRATION REPORT

## 1. Architecture Before
- `App.tsx` truyền xuống `Chapter2` prop `chapterProgress` thay đổi 60 lần/giây khi cuộn trang.
- `Chapter2` nội suy thủ công toàn bộ các giá trị animation (opacity, translateX, translateY, innerProgress) từ prop `chapterProgress`.
- Khi các nội suy thay đổi, `Chapter2` tự update các inline style, dẫn tới việc component re-render 60 FPS.
- Component cũng đồng thời tính `activeMilestone` trong quá trình re-render này. 

## 2. Architecture After
- `Chapter2` được tách ra khỏi vòng lặp re-render 60 FPS bằng `React.memo` và `App.tsx` đã "đóng băng" prop `chapterProgress` ở mức tĩnh (`0`) cho `Chapter2`.
- `Chapter2` lấy nguồn dữ liệu hoạt hình từ `motionProgress` (thông qua `MotionCtx`).
- Toàn bộ các hiệu ứng chuyển động liên tục (opacity, x, y, chiều cao của đường tiến trình) được tính bằng `useTransform` trực tiếp thành MotionValue và đẩy vào DOM qua thẻ `<motion.div>`.
- Component chỉ cập nhật React state `activeMilestone` và `triggered` thông qua `useMotionValueEvent` khi thực sự cần thiết (tức là khi giá trị milestone thay đổi hoặc vượt qua ngưỡng).

## 3. Files Modified
- `src/app/App.tsx`
- `src/app/components/chapters/Chapter2.tsx`

## 4. Files Created
Không có.

## 5. Files Deleted
Không có.

## 6. Continuous MotionValues
- `cp`: Phái sinh từ `motionProgress` (chỉ định riêng cho mapping của Chapter2).
- `opacity`: Opacity của container tổng (vào/ra khỏi scene).
- `translateX`: Di chuyển ngang container tổng (vào/ra khỏi scene).
- `translateY`: Di chuyển dọc container tổng (ra khỏi scene).
- `lineProgress`: Phần trăm nội suy qua các timeline node.
- `lineHeight`: Map từ phần trăm sang chuỗi độ dài dạng % truyền vào height của DOM để tạo thanh track fill.

## 7. Discrete React State
- `activeMilestone`: Gắn liền với nội dung của màn hình (năm, text, màu sắc đổ bóng). Bắt buộc phải là React State để khi user cuộn qua mốc sự kiện mới, DOM Text và key React sẽ được thay đổi.
- `triggered`: Chỉ bật `true` đúng 1 lần khi cuộn qua ngưỡng 0.05. Đánh dấu sự bắt đầu (entry) của hoạt hình. 

## 8. Milestone Update Strategy
- Lắng nghe MotionValue `cp` qua hook `useMotionValueEvent`.
- Bên trong event handler, tính toán toán học `newMilestone = Math.floor(...)`.
- Cấu trúc rẽ nhánh `if (newMilestone !== activeMilestone)` kiểm tra tính thay đổi, giúp triệt tiêu việc gọi hàm `setActiveMilestone` nếu milestone không thực sự đổi. Nhờ vậy, 60 FPS cuộn trang chỉ sinh ra vài lần render gián đoạn (khi đến mốc mới).

## 9. Temporary Bridge
- Chapter2 removed from continuous progress bridge: YES (Đã đóng băng truyền prop).
- Chapter4–8 bridge preserved: YES (Bridge ở App.tsx vẫn giữ nguyên chưa xóa).

## 10. Performance Architecture
- **Continuous:** 
  Native scroll → MotionValue (`scrollYProgress` → `motionProgress` → `cp`) → `useTransform` tính animation → Cập nhật trực tiếp `motion.div` DOM.
- **Discrete:** 
  MotionValue thay đổi → Milestone vượt ngưỡng → `setActiveMilestone` gọi một lần → Cập nhật React Tree thay đổi Text/Render DOM.

## 11. Chapter Compatibility
- Chapter1 PASS
- Chapter2 PASS
- Chapter3 PASS
- Chapter4 PASS
- Chapter5 PASS
- Chapter6 PASS
- Chapter7 PASS
- Chapter8 PASS

## 12. Build
PASS (Vite production build success without any errors).

## 13. Runtime
PASS (Thử nghiệm cuộn xuôi/ngược ổn định, mượt mà).

## 14. Console
PASS (0 warnings/errors liên quan).

## 15. Milestone Validation
PASS (Boundary mượt mà, chuyển tiếp text không giật cục, key React đánh chuẩn).

## 16. Regression
PASS (Giao diện cũ bảo lưu 100%).

## 17. Performance Validation
PASS (Thành công loại bỏ React render dependency).

## 18. Remaining Architecture
Các Chapters vẫn đang dùng Temporary Bridge: `Chapter4, Chapter5, Chapter6, Chapter7, Chapter8`.

## 19. Recommendation
PHASE_2E_APPROVED

## 20. Safety Status
- Dependencies changed: KHÔNG
- Packages installed: KHÔNG
- Unrelated files modified: KHÔNG
- UI redesigned: KHÔNG
- Chapter2 continuous scroll state removed: CÓ
- Discrete milestone state preserved: CÓ
- Temporary Bridge preserved: CÓ
- Build: PASS
- Runtime: PASS
- Console: PASS
- Milestone: PASS
- Performance: PASS
