import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getExercisesForUser } from "@/data/exercises";
import { NewWorkoutForm } from "./NewWorkoutForm";

export default async function NewWorkoutPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const exercises = await getExercisesForUser(userId);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">New workout</h1>
        <NewWorkoutForm exercises={exercises} />
      </div>
    </div>
  );
}
