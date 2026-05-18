import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
// GET /api/meals?userId=xxx&date=2024-05-18
// Lấy tất cả bữa ăn của 1 user trong 1 ngày, kèm ingredients
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const date = request.nextUrl.searchParams.get("date");

  if (!userId) {
    return NextResponse.json({ error: "Thiếu userId" }, { status: 400 });
  }

  try {
    const where: { userId: string; date?: { gte: Date; lt: Date } } = { userId };

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      where.date = { gte: start, lt: end };
    }

    const meals = await prisma.meal.findMany({
      where,
      include: {
        ingredients: {
          include: { ingredient: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(meals);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST /api/meals
// Body: { userId, mealType, date, ingredients: [{ ingredientId, amountInGram }] }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      mealType,
      date,
      ingredients,
    } = body as {
      userId: string;
      mealType: string;
      date: string;
      ingredients: { ingredientId: string; amountInGram: number }[];
    };

    if (!userId || !mealType || !date) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    // Tính totalKcal từ từng ingredient
    let totalKcal = 0;
    if (ingredients?.length) {
      const ingredientIds = ingredients.map((i) => i.ingredientId);
      const dbIngredients = await prisma.ingredient.findMany({
        where: { id: { in: ingredientIds } },
      });

      totalKcal = ingredients.reduce((sum, item) => {
        const found = dbIngredients.find((d) => d.id === item.ingredientId);
        if (!found) return sum;
        return sum + Math.round((found.calories * item.amountInGram) / 100);
      }, 0);
    }

    const meal = await prisma.meal.create({
      data: {
        userId,
        mealType,
        date: new Date(date),
        totalKcal,
        ingredients: {
          create: ingredients?.map((i) => ({
            ingredientId: i.ingredientId,
            amountInGram: i.amountInGram,
          })) ?? [],
        },
      },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
      },
    });

    return NextResponse.json(meal, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}