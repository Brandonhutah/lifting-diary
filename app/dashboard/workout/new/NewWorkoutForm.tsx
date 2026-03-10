"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createWorkout } from "./actions";

type Exercise = {
  id: string;
  name: string;
};

type SetRow = {
  reps: string;
  weightLbs: string;
};

type ExerciseRow = {
  exerciseId: string;
  sets: SetRow[];
};

export function NewWorkoutForm({ exercises }: { exercises: Exercise[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [exerciseRows, setExerciseRows] = useState<ExerciseRow[]>([
    { exerciseId: "", sets: [{ reps: "", weightLbs: "" }] },
  ]);
  const [isPending, setIsPending] = useState(false);

  function addExercise() {
    setExerciseRows((prev) => [
      ...prev,
      { exerciseId: "", sets: [{ reps: "", weightLbs: "" }] },
    ]);
  }

  function removeExercise(index: number) {
    setExerciseRows((prev) => prev.filter((_, i) => i !== index));
  }

  function updateExerciseId(index: number, exerciseId: string) {
    setExerciseRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, exerciseId } : row))
    );
  }

  function addSet(exerciseIndex: number) {
    setExerciseRows((prev) =>
      prev.map((row, i) =>
        i === exerciseIndex
          ? { ...row, sets: [...row.sets, { reps: "", weightLbs: "" }] }
          : row
      )
    );
  }

  function removeSet(exerciseIndex: number, setIndex: number) {
    setExerciseRows((prev) =>
      prev.map((row, i) =>
        i === exerciseIndex
          ? { ...row, sets: row.sets.filter((_, j) => j !== setIndex) }
          : row
      )
    );
  }

  function updateSet(
    exerciseIndex: number,
    setIndex: number,
    field: keyof SetRow,
    value: string
  ) {
    setExerciseRows((prev) =>
      prev.map((row, i) =>
        i === exerciseIndex
          ? {
              ...row,
              sets: row.sets.map((s, j) =>
                j === setIndex ? { ...s, [field]: value } : s
              ),
            }
          : row
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);

    const [year, month, day] = date.split("-").map(Number);

    await createWorkout({
      name: name.trim() || undefined,
      startedAt: new Date(year, month - 1, day),
      exercises: exerciseRows
        .filter((row) => row.exerciseId)
        .map((row) => ({
          exerciseId: row.exerciseId,
          sets: row.sets
            .filter((s) => s.reps !== "")
            .map((s) => ({
              reps: Number(s.reps),
              weightLbs: s.weightLbs ? Number(s.weightLbs) : undefined,
            })),
        })),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Workout name</Label>
          <Input
            id="name"
            placeholder="e.g. Push day"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold">Exercises</h2>

        {exerciseRows.map((exerciseRow, exIdx) => (
          <Card key={exIdx}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Select
                    value={exerciseRow.exerciseId}
                    onValueChange={(v) => updateExerciseId(exIdx, v)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {exercises.map((ex) => (
                        <SelectItem key={ex.id} value={ex.id}>
                          {ex.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {exerciseRows.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExercise(exIdx)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs text-zinc-500 dark:text-zinc-400 px-1">
                <span>Reps</span>
                <span>Weight (lbs)</span>
                <span />
              </div>
              {exerciseRow.sets.map((set, setIdx) => (
                <div key={setIdx} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                  <Input
                    type="number"
                    min={1}
                    placeholder="Reps"
                    value={set.reps}
                    onChange={(e) =>
                      updateSet(exIdx, setIdx, "reps", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    min={0}
                    step="0.5"
                    placeholder="Optional"
                    value={set.weightLbs}
                    onChange={(e) =>
                      updateSet(exIdx, setIdx, "weightLbs", e.target.value)
                    }
                  />
                  {exerciseRow.sets.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSet(exIdx, setIdx)}
                    >
                      ×
                    </Button>
                  ) : (
                    <div className="w-9" />
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => addSet(exIdx)}
              >
                + Add set
              </Button>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addExercise}
        >
          + Add exercise
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Saving..." : "Save workout"}
        </Button>
      </div>
    </form>
  );
}
