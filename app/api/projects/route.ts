import "server-only";

import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

import { auth } from "@/app/(auth)/auth";
import { project } from "@/db/schema";

let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

// GET /api/projects - Get all projects for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const projects = await db
      .select()
      .from(project)
      .where(eq(project.userId, session.user.id))
      .orderBy(project.updatedAt);

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, settings } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Project name must be less than 100 characters" },
        { status: 400 }
      );
    }

    const newProject = await db
      .insert(project)
      .values({
        name: name.trim(),
        description: description?.trim() || null,
        userId: session.user.id,
        settings: settings || {
          defaultModel: 'gemini-2.5-flash',
          safetyLevel: 'moderate'
        },
      })
      .returning();

    return NextResponse.json({ 
      project: newProject[0],
      message: "Project created successfully" 
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}