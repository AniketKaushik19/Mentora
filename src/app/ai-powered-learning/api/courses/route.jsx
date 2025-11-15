import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get("courseId");
    const user = (await currentUser()) || null;
   
    if (!user) {
      return NextResponse.json([], { status: 200 });
    }
 if(courseId=="0"){
  const result = await db
      .select()
      .from(coursesTable)
      .where(sql`${coursesTable.courseContent}::jsonb!= '{}'::jsonb`);
      console.log(result);
      return NextResponse.json(result);
 }
    if (courseId) {
      const single = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.cid, courseId));
      return NextResponse.json(single[0] ?? {}, { status: 200 });
    }

    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.userEmail, user.primaryEmailAddress?.emailAddress))
      .orderBy(desc(coursesTable.id));

    return NextResponse.json(Array.isArray(result) ? result : [], { status: 200 });
  } catch (err) {
    console.error("GET /api/courses error:", err);
    return NextResponse.json({ error: "Failed to fetch courses", details: err.message }, { status: 500 });
  }
}
