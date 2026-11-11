"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/core/ui/card";
import { Spinner } from "@/core/ui/spinner";
import { listReports } from "../client";
import type { Report } from "../contract";

export function ReportList({ refreshKey }: { refreshKey: number }) {
  const [reports, setReports] = useState<Report[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    listReports().then((loaded) => {
      if (!cancelled) setReports(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (!reports) return <Spinner />;
  if (reports.length === 0) return <p className="text-sm text-muted-foreground">No reports yet.</p>;

  return (
    <ul aria-label="Reports" className="flex flex-col gap-3">
      {reports.map((report) => (
        <li key={report.id}>
          <Card>
            <CardContent className="flex flex-col gap-1 p-4">
              <p>{report.body}</p>
              <p className="text-xs text-muted-foreground">
                {report.address ?? "No address"} · {new Date(report.createdAt).toLocaleString("en-GB")}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
