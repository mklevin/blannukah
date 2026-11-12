import Link from "next/link";

export default function Page() {
    return (
        <header>
            <div className="title">
                <Link href="/" prefetch={false}>The Blue York Rhymes</Link>
            </div>
        </header>
    );
}