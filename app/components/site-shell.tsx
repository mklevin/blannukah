import type { ReactNode } from "react";
import Link from "next/link";
import Navigation from "@/app/components/navigation";

export default function SiteShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="page-container">
      <header>
        <div className="title">
          <Link href="/" prefetch={false}>The Blue York Rhymes</Link>
        </div>
      </header>
      <Navigation />

      <div className="main-content">
        {children}
      </div>

      <footer>
        <span>
          <a href="https://mattlevin.io">
            © 2026 The Blue York Rhymes Company
          </a>
        </span>
      </footer>
    </div>
  );
}
