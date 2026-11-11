"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { createClient } from "@/core/db/client";
import { Button } from "@/core/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/ui/dropdown-menu";
import type { CurrentUser } from "../types";

export function AccountMenuView({ user }: { user: CurrentUser | null }) {
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isGuest = !user || user.isAnonymous;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Account menu">
          <UserRound />
          {user?.email ?? "Account"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{isGuest ? "Visiting as guest" : user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user?.isAnonymous && (
          <DropdownMenuItem asChild>
            <Link href="/auth/upgrade">Keep my data</Link>
          </DropdownMenuItem>
        )}
        {isGuest && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/auth/login">Sign in</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/sign-up">Sign up</Link>
            </DropdownMenuItem>
          </>
        )}
        {user && !user.isAnonymous && (
          <DropdownMenuItem onSelect={signOut}>Log out</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
