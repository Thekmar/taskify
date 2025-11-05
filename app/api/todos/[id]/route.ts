import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const { id } = await params;

    const body = await req.json();

    const todo = await prisma.todo.update({
      where: { id },
      data: { completed: body.completed },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error("PUT /api/todos/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  
    const { id } = await params;

    console.log("Attempting to delete todo:", id); 

    // Checking todo
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      console.log("Todo not found:", id); 
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Deleting todo
    const deleted = await prisma.todo.delete({
      where: { id },
    });

    console.log("Successfully deleted todo:", deleted.id); 

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("DELETE /api/todos/[id] error:", error);

    // Returning error
    return NextResponse.json(
      {
        error: "Failed to delete todo",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
