import { db } from "@/config/db";
import { coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// ✅ Enroll in a course
export async function POST(req) {
  try {
    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ success: false, message: "Missing courseId" }, { status: 400 });
    }

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const existingEnroll = await db
      .select()
      .from(enrollCourseTable)
      .where(and(eq(enrollCourseTable.userEmail, userEmail), eq(enrollCourseTable.cid, courseId)));

    if (existingEnroll.length === 0) {
      const result = await db
        .insert(enrollCourseTable)
        .values({ cid: courseId, userEmail })
        .returning();

      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: false, message: "Already Enrolled" });
  } catch (error) {
    console.error("POST /enroll error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ Fetch enrolled courses
export async function GET(req) {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    let result;
    if (courseId) {
      result = await db
        .select()
        .from(coursesTable)
        .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(and(eq(enrollCourseTable.userEmail, userEmail), eq(enrollCourseTable.cid, courseId)))
        .orderBy(desc(enrollCourseTable.id));

      return NextResponse.json({ success: true, data: result[0] || null });
    } else {
      result = await db
        .select()
        .from(coursesTable)
        .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(eq(enrollCourseTable.userEmail, userEmail))
        .orderBy(desc(enrollCourseTable.id));

      return NextResponse.json({ success: true, data: result });
    }
  } catch (error) {
    console.error("GET /enroll error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ Update completed chapters
export async function PUT(req) {
  try {
    const { completedChapter, courseId } = await req.json();
    if (!completedChapter || !courseId) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .update(enrollCourseTable)
      .set({ completedChapters: completedChapter })
      .where(and(eq(enrollCourseTable.cid, courseId), eq(enrollCourseTable.userEmail, userEmail)))
      .returning();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("PUT /enroll error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}