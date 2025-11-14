import { boolean, integer, pgTable, varchar, json } from "drizzle-orm/pg-core";


export const HistoryTable=pgTable('historyTable',{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    recordId:varchar().notNull(),
    content:json(),
    userEmail:varchar(),
    createdAt:varchar(),
    aiAgentType:varchar(),
    metaData:varchar()

});
export const coursesTable=pgTable("courses",{
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        cid:varchar({length:255}).notNull().unique(),
        name:varchar({length:255}).notNull(),
        description:varchar({length:1024}),
        noOfChapters:integer().notNull(),
        includeVideo:boolean().default(false),
        level:varchar({length:50}).notNull(),
        category:varchar({length:100}),
        courseJson:json(),
        bannerImageUrl:varchar().default(''),
        courseContent:json().default({}),
        userEmail: varchar({ length: 255 }).notNull()
})
export const enrollCourseTable=pgTable('enrollCourse',{
            id: integer().primaryKey().generatedAlwaysAsIdentity(),
            cid:varchar('cid').references(()=>coursesTable.cid),
            userEmail:varchar({ length: 255 }).notNull(),
            completedChapters:json()
})