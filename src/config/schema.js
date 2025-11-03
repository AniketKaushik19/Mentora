import {integer,pgTable,varchar,json} from "drizzle-orm/pg-core";

export const HistoryTable=pgTable('historyTable',{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    recordId:varchar().notNull(),
    content:json(),
    userEmail:varchar(),
    createdAt:varchar(),
    aiAgentType:varchar(),
    metaData:varchar()

})