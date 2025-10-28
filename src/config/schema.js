import {integer,pgTable,varchar,json} from "drizzle-orm/pg-core";

export const users = pgTable("users",{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email:varchar({length:255}).notNull().unique(),
    name:varchar({length:255}).notNull(),
});
   
export const HistoryTable=pgTable('historyTable',{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    recordId:varchar().notNull(),
    content:json(),
    userEmail:varchar('userEmail').references(()=> users.email),
    createdAt:varchar(),
    aiAgentType:varchar(),
    metaData:varchar()

})