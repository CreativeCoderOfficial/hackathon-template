import Link from "next/link";
import { AccountMenu } from "@/core/auth/components/account-menu";
import { ThemeSwitcher } from "@/core/ui/theme-switcher";

// One line per feature. Adding a link here is the only shared edit a new feature needs.
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/example", label: "Example" },
];

export function SiteNav() {
  return (
    <nav className="flex h-16 w-full justify-center border-b border-border">
      <div className="flex w-full max-w-5xl items-center justify-between px-5 text-sm">
        <ul className="flex items-center gap-5 font-medium">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <AccountMenu />
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
