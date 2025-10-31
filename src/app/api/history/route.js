import { HistoryTable } from "@/config/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
export async function POST(req) {
  const { content, recordId, aiAgentType } = await req.json();
  const user = await currentUser();

  try {
    //insert record
    const result = await db
      .insert(HistoryTable)
      .values({
        recordId: recordId,
        content: content,
        userEmail: user.primaryEmailAddress?.emailAddress,
        createdAt: new Date().toISOString(),
        aiAgentType: aiAgentType,
      })
      .returning(HistoryTable);
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
export async function PUT(req) {
  const { content, recordId } = await req.json();
  try {
    //insert record
    const result = await db
      .update(HistoryTable)
      .set({
        content,
      })
      .where(eq(HistoryTable.recordId, recordId));
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const recordId = searchParams.get("recordId");
  const user = await currentUser();
  try {
    if (recordId) {
      const result = await db
        .select()
        .from(HistoryTable)
        .where(eq(HistoryTable.recordId, recordId));
      return NextResponse.json(result[0]);
    } else {
      const result = await db
        .select()
        .from(HistoryTable)
        .where(
          eq(HistoryTable.userEmail, user?.primaryEmailAddress?.emailAddress)
        ).orderBy(desc(HistoryTable.id));
        return NextResponse.json(result);
      }
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
