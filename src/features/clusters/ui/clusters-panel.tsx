"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";
import { Spinner } from "@/core/ui/spinner";
import { listClusters } from "../client";
import type { Cluster } from "../contract";

export function ClustersPanel() {
  const [clusters, setClusters] = useState<Cluster[] | null>(null);

  useEffect(() => {
    listClusters().then(setClusters);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">Clusters</h1>
      <p className="text-muted-foreground">Duplicate reports grouped by AI. Stub with mock data.</p>
      {!clusters ? (
        <Spinner />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {clusters.map((cluster) => (
            <li key={cluster.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{cluster.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <p>{cluster.summary}</p>
                  <p className="text-muted-foreground">{cluster.reportCount} reports</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
