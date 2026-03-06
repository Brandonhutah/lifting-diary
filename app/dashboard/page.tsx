"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Set = {
  reps: number;
  weight: number;
};

type Exercise = {
  name: string;
  sets: Set[];
};

type Workout = {
  id: number;
  date: string;
  name: string;
  exercises: Exercise[];
};

const MOCK_WORKOUTS: Workout[] = [
  {
    id: 1,
    date: "2026-03-06",
    name: "Push Day",
    exercises: [
      { name: "Bench Press", sets: [{ reps: 5, weight: 185 }, { reps: 5, weight: 185 }, { reps: 4, weight: 185 }] },
      { name: "Overhead Press", sets: [{ reps: 8, weight: 115 }, { reps: 8, weight: 115 }, { reps: 7, weight: 115 }] },
      { name: "Tricep Pushdown", sets: [{ reps: 12, weight: 60 }, { reps: 12, weight: 60 }, { reps: 10, weight: 60 }] },
    ],
  },
  {
    id: 2,
    date: "2026-03-06",
    name: "Cardio",
    exercises: [
      { name: "Treadmill Run", sets: [{ reps: 1, weight: 0 }] },
    ],
  },
  {
    id: 3,
    date: "2026-03-04",
    name: "Pull Day",
    exercises: [
      { name: "Deadlift", sets: [{ reps: 5, weight: 275 }, { reps: 5, weight: 275 }, { reps: 5, weight: 275 }] },
      { name: "Barbell Row", sets: [{ reps: 8, weight: 155 }, { reps: 8, weight: 155 }, { reps: 8, weight: 155 }] },
      { name: "Pull-ups", sets: [{ reps: 8, weight: 0 }, { reps: 7, weight: 0 }, { reps: 6, weight: 0 }] },
    ],
  },
  {
    id: 4,
    date: "2026-03-02",
    name: "Leg Day",
    exercises: [
      { name: "Squat", sets: [{ reps: 5, weight: 225 }, { reps: 5, weight: 225 }, { reps: 5, weight: 225 }] },
      { name: "Leg Press", sets: [{ reps: 10, weight: 360 }, { reps: 10, weight: 360 }] },
      { name: "Romanian Deadlift", sets: [{ reps: 10, weight: 135 }, { reps: 10, weight: 135 }, { reps: 10, weight: 135 }] },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date("2026-03-06"));
  const [open, setOpen] = useState(false);

  const dateKey = format(date, "yyyy-MM-dd");
  const workouts = MOCK_WORKOUTS.filter((w) => w.date === dateKey);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Workouts</h1>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-48 justify-start gap-2">
                <CalendarIcon className="h-4 w-4 shrink-0" />
                {format(date, "do MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  if (d) {
                    setDate(d);
                    setOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workout.exercises.map((exercise) => (
                      <div key={exercise.name}>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                          {exercise.name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {exercise.sets.map((set, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-600 dark:text-zinc-400"
                            >
                              {set.weight > 0
                                ? `${set.reps} × ${set.weight} lbs`
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
