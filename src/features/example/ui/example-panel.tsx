"use client";

import { useEffect, useState } from "react";
import { Button } from "@/core/ui/button";
import { Card, CardContent } from "@/core/ui/card";
import { Input } from "@/core/ui/input";
import { Label } from "@/core/ui/label";
import { Spinner } from "@/core/ui/spinner";
import { createItem, listItems } from "../client";
import { createItemInputSchema, type Item } from "../contract";

export function ExamplePanel() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listItems().then(setItems);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = createItemInputSchema.safeParse({ title });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }

    setSubmitting(true);
    try {
      await createItem(parsed.data);
      setTitle("");
      setItems(await listItems());
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not add the item");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">Example</h1>
      <form onSubmit={submit} className="flex max-w-md flex-col gap-3">
        <Label htmlFor="item-title">Title</Label>
        <Input id="item-title" value={title} onChange={(event) => setTitle(event.target.value)} />
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting} className="self-start">
          {submitting && <Spinner />} Add item
        </Button>
      </form>
      {!items ? (
        <Spinner />
      ) : (
        <ul aria-label="Items" className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <Card>
                <CardContent className="p-4">{item.title}</CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
