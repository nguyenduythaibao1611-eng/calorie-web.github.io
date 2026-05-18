import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // ← thêm dòng này

// GET /api/ingredients
// Trả về toàn bộ danh sách nguyên liệu từ database
export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(ingredients);
  } catch {
    return NextResponse.json(
      { error: "Không thể lấy danh sách nguyên liệu" },
      { status: 500 }
    );
  }
}