# Data Fetching

## Server Components Only

All data fetching must be done via **React Server Components**. Do not fetch data in:

- Route handlers (`app/api/`)
- Client components (`"use client"`)
- `useEffect` hooks

If a client component needs data, fetch it in a parent server component and pass it down as props.

## Database Queries via `/data` Helpers

All database queries must go through helper functions in the `/data` directory. Do not write inline queries in components or server actions.

```
data/
  workouts.ts
  exercises.ts
  ...
```

**Rules for `/data` helpers:**

- Use **Drizzle ORM** for all queries — no raw SQL
- Every helper that returns user data must scope the query to the authenticated user (e.g. `where(eq(table.userId, userId))`)
- Accept `userId` as an explicit parameter — never derive it inside the helper
- Return `null` or an empty array when no data is found; never throw for missing records

## Data Isolation

Logged-in users must only be able to access their own data. This is enforced by:

1. Resolving the authenticated user's ID in the server component (e.g. via `auth()`)
2. Passing that ID to the `/data` helper
3. The helper filtering all queries by that `userId`

Never expose a route or helper that returns data for an arbitrary user ID supplied by the client.

## Example

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

```tsx
// app/dashboard/page.tsx (Server Component)
import { auth } from "@/auth";
import { getWorkoutsForUser } from "@/data/workouts";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);

  return <WorkoutList workouts={workouts} />;
}
```
