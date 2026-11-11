"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/core/ui/spinner";
import { listTemplateItems } from "../client";
import type { TemplateItem } from "../contract";

export function TemplatePanel() {
  const [items, setItems] = useState<TemplateItem[] | null>(null);

  useEffect(() => {
    listTemplateItems().then(setItems);
  }, []);

  if (!items) return <Spinner />;
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}
