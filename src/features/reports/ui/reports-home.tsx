"use client";

import { useState } from "react";
import { ReportCounter } from "./report-counter";
import { ReportForm } from "./report-form";
import { ReportList } from "./report-list";

export function ReportsHome() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">Helsinki place reports</h1>
        <ReportCounter refreshKey={refreshKey} />
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <ReportForm onSubmitted={() => setRefreshKey((key) => key + 1)} />
        <section aria-labelledby="reports-heading" className="flex flex-col gap-3">
          <h2 id="reports-heading" className="text-xl font-medium">Latest reports</h2>
          <ReportList refreshKey={refreshKey} />
        </section>
      </div>
    </div>
  );
}
