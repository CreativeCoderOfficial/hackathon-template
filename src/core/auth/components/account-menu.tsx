import { Suspense } from "react";
import { getCurrentUser } from "../server";
import { AccountMenuView } from "./account-menu-view";

async function AccountMenuLoader() {
  const user = await getCurrentUser();
  return <AccountMenuView user={user} />;
}

export function AccountMenu() {
  return (
    <Suspense fallback={null}>
      <AccountMenuLoader />
    </Suspense>
  );
}
