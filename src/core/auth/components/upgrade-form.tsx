"use client";

import { useState } from "react";
import { Button } from "@/core/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/ui/card";
import { Input } from "@/core/ui/input";
import { Label } from "@/core/ui/label";
import { upgradeAnonymousUser } from "../client";

export function UpgradeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    try {
      await upgradeAnonymousUser(email);
      setStatus("sent");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
      setStatus("failed");
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Keep your data</CardTitle>
        <CardDescription>
          Add an email to turn this visit into an account. Everything you created stays yours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "sent" ? (
          <p className="text-sm">Check your inbox and confirm the email to finish.</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="upgrade-email">Email</Label>
              <Input
                id="upgrade-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {status === "failed" && <p className="text-sm text-destructive">{message}</p>}
            <Button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Save my data"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
