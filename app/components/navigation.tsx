"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import type { UrlObject } from 'url';

type NavLinkProps = {
    href: string | UrlObject,
    text: string,
    prefetch?: boolean
}

function NavLink({ href, text, prefetch=true }: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={`${pathname === href.toString() ? "active" : ""}`}
    >
      {text}
    </Link>
  );
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="navigation flex sticky">
        <span className="logo hidden sm:block">
            <Link href="/" prefetch={false}>B</Link>
        </span>
        <div className="nav-items flex">
            <NavLink href="/" text="Live Results" prefetch={false} />
            <NavLink href="/faq/" text="FAQ" />
            <NavLink href="/credits/" text="Credits" />
            <div className="vote-link">
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdTYuZDZD1OQGTsVPNsysmJGthhOOYsFiBNwrFhquDGxOeIkg/viewform" target="_blank">
                    VOTE NOW
                </a>
            </div>
        </div>
      </div>
    );
}