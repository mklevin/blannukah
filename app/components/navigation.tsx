"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import type { UrlObject } from 'url';

type NavLinkProps = {
    href: string | UrlObject,
    text: string
}

function NavLink({href, text}: NavLinkProps) {
    const pathname = usePathname();

    return (<Link 
        href={href} 
        className={`${pathname === href.toString() ? 'active' : ''}`}>
        {text}
    </Link>);
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="navigation flex sticky">
        <span className="logo hidden sm:block">
            <Link href="/">B</Link>
        </span>
        <div className="nav-items flex">
            <NavLink href="/" text="Live Results" />
            <NavLink href="/faq" text="FAQ" />
            <NavLink href="/credits" text="Credits" />
            <div className="vote-link">
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdTYuZDZD1OQGTsVPNsysmJGthhOOYsFiBNwrFhquDGxOeIkg/viewform" target="_blank">
                    VOTE NOW
                </a>
            </div>
        </div>
      </div>
    );
}