"use client";

import { useEffect, useState } from "react";
import { countReports } from "../client";

// The popularity signal for the demo: how many reports people have submitted.
export function ReportCounter({ refreshKey }: { refreshKey: number }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    countReports().then((loaded) => {
      if (!cancelled) setCount(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <p className="text-lg font-medium">
      <span data-testid="report-count">{count ?? "..."}</span> reports submitted
    </p>
  );
}
