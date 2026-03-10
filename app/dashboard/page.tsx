import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DatePicker } from "./DatePicker";
import { getWorkoutsForUserOnDate } from "@/data/workouts";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { date: dateParam } = await searchParams;
  const date = dateParam
    ? (() => { const [y, m, d] = dateParam.split("-").map(Number); return new Date(y, m - 1, d); })()
    : new Date();

  const workouts = await getWorkoutsForUserOnDate(userId, date);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Workouts</h1>
          <div className="flex items-center gap-2">
            <DatePicker selectedDate={date} />
            <Button asChild>
              <Link href="/dashboard/workout/new">New workout</Link>
            </Button>
          </div>
        </div>

        {workouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 py-16 text-zinc-500 dark:text-zinc-400">
            <p className="text-sm">No workouts logged for {format(date, "do MMM yyyy")}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{workout.name ?? "Workout"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workout.workoutExercises.map((we) => (
                      <div key={we.id}>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                          {we.exercise.name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {we.sets.map((set) => (
                            <span
                              key={set.id}
                              className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-600 dark:text-zinc-400"
                            >
                              {set.weightLbs && Number(set.weightLbs) > 0
                                ? `${set.reps} × ${set.weightLbs} lbs`
                                : `${set.reps} rep${set.reps !== 1 ? "s" : ""}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
