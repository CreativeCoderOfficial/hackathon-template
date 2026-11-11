"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";
import { Spinner } from "@/core/ui/spinner";
import { listPriorities } from "../client";
import type { PriorityItem } from "../contract";

export function PrioritiesPanel() {
  const [priorities, setPriorities] = useState<PriorityItem[] | null>(null);

  useEffect(() => {
    listPriorities().then(setPriorities);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">Priorities</h1>
      <p className="text-muted-foreground">What to fix first, with evidence. Stub with mock data.</p>
      {!priorities ? (
        <Spinner />
      ) : (
        <ol className="flex flex-col gap-4">
          {priorities.map((item) => (
            <li key={item.id}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    #{item.rank} {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <p>{item.reason}</p>
                  <p className="text-muted-foreground">
                    Evidence: {item.evidence.map((e) => `${e.title} (${e.reportCount})`).join(", ")}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
