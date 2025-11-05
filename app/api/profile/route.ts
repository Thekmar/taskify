import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    
    const session = await getServerSession();
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: { name: body.name },
      create: { email: session.user.email, name: body.name },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("POST /api/profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
