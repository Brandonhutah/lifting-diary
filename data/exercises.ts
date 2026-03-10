import { db } from "@/app/db";
import { exercises } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function getExercisesForUser(userId: string) {
  return db.select().from(exercises).where(eq(exercises.userId, userId));
}
