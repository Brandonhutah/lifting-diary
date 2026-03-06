# UI Guidelines

## Components

All UI components must use [shadcn/ui](https://ui.shadcn.com/). There are to be no custom UI components of any kind. If a UI element is needed, use or compose from shadcn/ui primitives.

## Dates

All date handling must use the [date-fns](https://date-fns.org/) library. Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2026
4th Jan 2024
```

This corresponds to the `date-fns` format string: `do MMM yyyy`

Example usage:

```ts
import { format } from "date-fns";

format(new Date("2025-09-01"), "do MMM yyyy"); // "1st Sep 2025"
```
