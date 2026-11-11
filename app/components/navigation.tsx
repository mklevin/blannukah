import Link from "next/link";

export default function Navigation() {
    return (
        <div className="navigation flex sticky">
            <span className="logo">
                <Link href="/">B</Link>
            </span>
            <div className="nav-items flex">
                <Link href="/">Live Results</Link>
                <Link href="faq">FAQ</Link>
                <Link href="/">Credits</Link>
                <div className="vote-link">
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSdTYuZDZD1OQGTsVPNsysmJGthhOOYsFiBNwrFhquDGxOeIkg/viewform" target="_blank">
                        VOTE NOW
                    </a>
                </div>
            </div>
        </div>
    );
}