'use server'; // Biến file này thành Server Action chạy ngầm

import prisma from "@/lib/prisma"; // Ống nước Database
import type { Ingredient } from "@/types";

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");
}

// Tính điểm khớp - điểm càng cao càng ưu tiên (Giữ nguyên của team ông)
function getMatchScore(
  normalizedName: string,
  normalizedQuery: string,
): number {
  if (normalizedName === normalizedQuery) return 4; 
  if (normalizedName.startsWith(normalizedQuery)) return 3; 
  if (normalizedName.includes(` ${normalizedQuery}`)) return 2; 
  if (normalizedName.includes(normalizedQuery)) return 1; 
  return 0;
}

// Thêm chữ 'async' vì giờ mình phải chờ lấy data từ mạng về
export async function searchIngredient(
  query: string,
  limit: number = 10,
): Promise<Ingredient[]> {
  if (!query || query.trim() === "") return [];

  const normalizedQuery = normalize(query.trim());

  // 1. Móc toàn bộ data từ Supabase về thay vì đọc file JSON
  const dbIngredients = await prisma.ingredient.findMany();

  // 2. Chuyển đổi format cho khớp 100% với kiểu dữ liệu cũ của team ông
  const normalizedIngredients: Ingredient[] = dbIngredients.map(
    (i: {
      id: string;
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }) => ({
      id: i.id,
      name: i.name,
      calories: i.calories,
      protein: i.protein,
      carbs: i.carbs,
      fat: i.fat,
      amount: 100, // Mặc định 100g như code cũ của ông
    })
  );

  // 3. Logic chấm điểm và lọc kết quả (Giữ nguyên)
  return normalizedIngredients
    .map((item) => ({
      item,
      score: getMatchScore(normalize(item.name), normalizedQuery),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}