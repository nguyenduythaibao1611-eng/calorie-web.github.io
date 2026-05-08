# 🍽️ Calorie Web

Ứng dụng web giúp theo dõi và quản lý lượng calo hằng ngày, được xây dựng bằng Next.js.  
Dự án hướng đến sự đơn giản, dễ sử dụng và phù hợp với sinh viên hoặc người mới bắt đầu.

---

##  Giới thiệu

Calorie Web là một ứng dụng hỗ trợ người dùng:
- Ghi lại lượng calo tiêu thụ mỗi ngày
- Theo dõi dinh dưỡng cơ bản (protein, carbs, fat)
- Trực quan hóa dữ liệu bằng biểu đồ
- Thiết lập mục tiêu calo cá nhân

Dự án hiện đang trong giai đoạn phát triển ban đầu.

---

##  Mục tiêu

- Xây dựng ứng dụng nhẹ, nhanh, dễ dùng
- Giúp người dùng hiểu thói quen ăn uống
- Hỗ trợ duy trì lối sống lành mạnh
- Tối ưu trải nghiệm cho người mới bắt đầu

---

## 👥 Đối tượng sử dụng

- Sinh viên muốn quản lý chế độ ăn
- Người tập gym theo dõi dinh dưỡng
- Người muốn kiểm soát cân nặng
- Người không thích ứng dụng phức tạp

---

## ✨ Tính năng (Planned)

-  Ghi lại lượng calo hằng ngày
-  Theo dõi macros (protein, carbs, fat)
-  Biểu đồ thống kê trực quan
-  Đặt mục tiêu calo cá nhân

---

##  Công nghệ sử dụng

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (state management)
- **Recharts** (chart visualization)
- **Lucide React** (icons)

---

##  Cấu trúc thư mục (Project Structure)

```bash
app/          # Routing và layout chính (Next.js App Router)
components/   # UI components (Button, Card, Chart,...)
lib/          # Xử lý logic, helper functions
store/        # Quản lý state (Zustand)
types/        # Định nghĩa TypeScript types
```

---

## 📝 Type Definitions

### Tổng Quan

Dự án sử dụng TypeScript với các interface được định nghĩa trong `types/index.ts`. Các interface này mô tả cấu trúc dữ liệu chính của ứng dụng.

### Cấu Trúc Dữ Liệu

| Interface | Mô tả | Quan hệ |
|-----------|-------|---------|
| **MacroTarget** | Mục tiêu dinh dưỡng hàng ngày (calo, protein, carbs, fat) | Được sử dụng trong `UserProfile` |
| **UserProfile** | Thông tin cá nhân người dùng và mục tiêu dinh dưỡng | Chứa `MacroTarget` |
| **Ingredient** | Nguyên liệu cơ bản (tên, calo, macros, số lượng) | Được sử dụng trong `MealEntry` |
| **MealEntry** | Một bữa ăn cụ thể (loại, nguyên liệu, thời gian) | Chứa `Ingredient[]`, được sử dụng trong `DailyLog` |
| **DailyLog** | Nhật ký calo toàn bộ một ngày | Chứa `MealEntry[]` |

### Ví dụ sử dụng

```typescript
import { UserProfile, DailyLog, MealEntry, Ingredient } from '@/types'

// Tạo UserProfile
const userProfile: UserProfile = {
  name: 'Nguyễn Văn A',
  age: 25,
  weight: 70,
  height: 175,
  goal: 'lose',
  macroTarget: {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  },
}

// Tạo một bữa ăn với nguyên liệu
const breakfast: MealEntry = {
  id: 'meal-1',
  mealType: 'breakfast',
  time: '08:00',
  ingredients: [
    {
      name: 'Gạo trắng',
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      amount: 100,
    },
  ],
  totalCalories: 130,
}

// Tạo DailyLog
const dailyLog: DailyLog = {
  date: '2024-05-08',
  meals: [breakfast],
  totalCalories: 130,
}
```

### Quy tắc đặt tên & format

- **ID**: Sử dụng string (UUID hoặc custom string)
- **Ngày**: Format `YYYY-MM-DD` (ví dụ: `2024-05-08`)
- **Thời gian**: Format `HH:mm` (ví dụ: `08:00` hoặc `14:30`)
- **Giá trị số**: Calo và macros lưu dưới dạng số (`number`)
- **Goal**: Chỉ chấp nhận 3 giá trị: `lose`, `maintain`, `gain`
- **MealType**: Chỉ chấp nhận 4 loại: `breakfast`, `lunch`, `dinner`, `snack`

---

## 💾 Storage Layer

### Tổng Quan

Storage Layer (`lib/storage.ts`) cung cấp các hàm an toàn để quản lý localStorage. Tất cả dữ liệu người dùng và nhật ký calo được lưu trữ thông qua các hàm này.

### Quy tắc bắt buộc

- ❌ **KHÔNG** truy cập `localStorage` trực tiếp từ component
- ✅ **LUÔN** import và sử dụng các hàm từ `@/lib/storage`
- ✅ Tất cả lỗi được xử lý tự động (try-catch)

### Các Hàm Chính

| Hàm | Tham số | Trả về | Mô tả |
|-----|---------|--------|-------|
| `getProfile()` | - | `UserProfile \| null` | Đọc thông tin hồ sơ người dùng |
| `saveProfile(profile)` | `profile: UserProfile` | `void` | Lưu thông tin hồ sơ người dùng |
| `getLog(date)` | `date: string (YYYY-MM-DD)` | `DailyLog \| null` | Đọc nhật ký calo theo ngày |
| `saveLog(date, log)` | `date: string, log: DailyLog` | `void` | Lưu nhật ký calo theo ngày |
| `getLogs(startDate, endDate)` | `startDate, endDate: string (YYYY-MM-DD)` | `DailyLog[]` | Lấy logs trong khoảng thời gian |

### Ví dụ Sử Dụng

```typescript
import { 
  getProfile, 
  saveProfile, 
  getLog, 
  saveLog, 
  getLogs 
} from '@/lib/storage'

// Lấy profile hiện tại
const profile = getProfile()
if (!profile) {
  console.log('Chưa có profile, tạo mới')
}

// Lưu profile
saveProfile({
  name: 'Nguyễn Văn A',
  age: 25,
  weight: 70,
  height: 175,
  goal: 'lose',
  macroTarget: {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  },
})

// Lấy log của một ngày
const todayLog = getLog('2024-05-08')

// Lưu log
saveLog('2024-05-08', {
  date: '2024-05-08',
  meals: [],
  totalCalories: 0,
})

// Lấy logs từ 7 ngày trước
const weekLogs = getLogs('2024-05-01', '2024-05-08')
console.log(`Tổng logs: ${weekLogs.length}`)
```

### Lưu Ý Quan Trọng

- **Format ngày**: Luôn sử dụng `YYYY-MM-DD` (ví dụ: `2024-05-08`)
- **Xử lý lỗi**: Tất cả các hàm đều có try-catch, trả về `null` hoặc `[]` nếu lỗi
- **Client-only**: Storage chỉ hoạt động ở browser, server sẽ bỏ qua
- **LocalStorage limits**: Mỗi trình duyệt có giới hạn ~5-10MB, cần quản lý dữ liệu cũ

##  Công nghệ sử dụng

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (state management)
- **Recharts** (chart visualization)
- **Lucide React** (icons)

---

##  Cấu trúc thư mục (Project Structure)

```bash
app/          # Routing và layout chính (Next.js App Router)
components/   # UI components (Button, Card, Chart,...)
lib/          # Xử lý logic, helper functions
store/        # Quản lý state (Zustand)
types/        # Định nghĩa TypeScript types