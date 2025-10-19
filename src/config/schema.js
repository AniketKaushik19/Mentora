import {integer,pgTable,varchar} from "drizzle-orm/pg-core";

export const users = pgTable("users",{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email:varchar({length:255}).notNull().unique(),
    name:varchar({length:255}).notNull(),
});
   