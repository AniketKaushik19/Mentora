import { HistoryTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { useUser } from "@clerk/nextjs";
export async function POST(req) {
  const { content, recordId,aiAgentType } = await req.json();
const user=useUser();

  try {
    //insert record
    const result = await db
      .insert(
        HistoryTable.values({
          recordId: recordId,
          content: content,
          userEmail: user.primaryEmailAddress?.emailAddress,
          createdAt: new Date().toString(),
          aiAgentType:aiAgentType
        })
      )
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
      .update(
        HistoryTable.set({
          content: content,
        })
      )
      .where(eq(HistoryTable.recordId, recordId));
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
export async function GET(req) {
  const {searchParams } = new URL(req.url);
  const recordId=searchParams.get('recordId');
  try {
    if(recordId){
        const result=await db.select().from(HistoryTable).where(eq(HistoryTable.recordId,recordId))
return NextResponse.json(result[0])
    }
    return NextResponse.json({})
    } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
