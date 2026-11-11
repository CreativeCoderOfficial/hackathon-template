"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { track } from "@/core/analytics";
import { Button } from "@/core/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";
import { Input } from "@/core/ui/input";
import { Label } from "@/core/ui/label";
import { Spinner } from "@/core/ui/spinner";
import { Textarea } from "@/core/ui/textarea";
import { createReport } from "../client";
import { createReportInputSchema } from "../contract";

type Coordinates = { lat: number; lng: number };

export function ReportForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [body, setBody] = useState("");
  const [address, setAddress] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function useMyLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => setError("Could not read your location"),
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = createReportInputSchema.safeParse({
      body,
      address: address || undefined,
      photoUrl: photoUrl || undefined,
      ...coordinates,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }

    setSubmitting(true);
    try {
      await createReport(parsed.data);
      track("report_submitted", { hasPhoto: Boolean(photoUrl), hasLocation: Boolean(coordinates) });
      setBody("");
      setAddress("");
      setPhotoUrl("");
      setCoordinates(null);
      onSubmitted();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not submit the report");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report a problem</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="report-body">What is wrong?</Label>
            <Textarea id="report-body" value={body} onChange={(event) => setBody(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="report-address">Address (optional)</Label>
            <Input id="report-address" value={address} onChange={(event) => setAddress(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="report-photo">Photo link (optional)</Label>
            <Input
              id="report-photo"
              type="url"
              value={photoUrl}
              onChange={(event) => setPhotoUrl(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="sm" onClick={useMyLocation}>
              <MapPin /> Use my location
            </Button>
            {coordinates && (
              <span className="text-xs text-muted-foreground">
                {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </span>
            )}
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting} className="self-start">
            {submitting && <Spinner />} Submit report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
