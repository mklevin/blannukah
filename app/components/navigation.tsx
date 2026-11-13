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
      <div className="logo hidden sm:block">
        <Link href="/" prefetch={false} aria-label="Home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 24"
            width="80"
            height="24"
            role="img"
            aria-label="Hanukkah 2026"
          >

            {/* 2026 tiles */}
            <g>
              <rect x="0" y="2" width="20" height="20" fill="#f28e2b" />
              <rect x="20" y="2" width="20" height="20" fill="#4e79a7" />
              <rect x="40" y="2" width="20" height="20" fill="#f28e2b" />
              <rect x="60" y="2" width="20" height="20" fill="#4e79a7" />
            </g>

            {/* Numerals */}
            <g
              fill="#fff"
              fontFamily="Libre Franklin, Arial, Helvetica, sans-serif"
              fontSize="13"
              fontWeight="600"
              textAnchor="middle"
            >
              <text x="10" y="16">2</text>
              <text x="30" y="16">0</text>
              <text x="50" y="16">2</text>
              <text x="70" y="16">6</text>
            </g>
          </svg>
        </Link>
      </div>

      <div className="divider" />

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