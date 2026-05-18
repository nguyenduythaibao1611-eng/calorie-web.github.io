import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
// DELETE /api/meals/[id]
// Xóa bữa ăn (MealIngredient sẽ bị xóa theo do onDelete: Cascade)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.meal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Không tìm thấy hoặc không thể xóa bữa ăn" },
      { status: 404 }
    );
  }
}

// GET /api/meals/[id]
// Lấy chi tiết 1 bữa ăn kèm ingredients
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const meal = await prisma.meal.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
      },
    });

    if (!meal) {
      return NextResponse.json({ error: "Không tìm thấy bữa ăn" }, { status: 404 });
    }

    return NextResponse.json(meal);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}