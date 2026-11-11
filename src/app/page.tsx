import Link from "next/link";

// TODO: replace with the product landing page.
export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold">TODO: product name</h1>
      <p className="text-muted-foreground">TODO: one-line product pitch</p>
      <Link href="/example" className="underline">
        See the example feature
      </Link>
    </div>
  );
}
