"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/app/db";
import { workouts, workoutExercises, sets } from "@/app/db/schema";

export type SetInput = {
  reps: number;
  weightLbs?: number;
};

export type ExerciseInput = {
  exerciseId: string;
  sets: SetInput[];
};

export type CreateWorkoutInput = {
  name?: string;
  startedAt: Date;
  exercises: ExerciseInput[];
};

export async function createWorkout(input: CreateWorkoutInput) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [workout] = await db
    .insert(workouts)
    .values({
      userId,
      name: input.name || null,
      startedAt: input.startedAt,
    })
    .returning();

  for (let i = 0; i < input.exercises.length; i++) {
    const exerciseInput = input.exercises[i];

    const [workoutExercise] = await db
      .insert(workoutExercises)
      .values({
        workoutId: workout.id,
        exerciseId: exerciseInput.exerciseId,
        order: i,
      })
      .returning();

    for (let j = 0; j < exerciseInput.sets.length; j++) {
      const setInput = exerciseInput.sets[j];
      await db.insert(sets).values({
        workoutExerciseId: workoutExercise.id,
        setNumber: j + 1,
        reps: setInput.reps,
        weightLbs: setInput.weightLbs ? String(setInput.weightLbs) : null,
      });
    }
  }

  redirect("/dashboard");
}
