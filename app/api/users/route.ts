import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/users
// Body: { id: string }
// Tự động tạo user ẩn danh nếu chưa tồn tại
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body as { id: string };

    if (!id) {
      return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { id },
      update: {},
      create: {
        id,
        email: `anonymous_${id}@calomate.local`,
        name: "Anonymous",
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}