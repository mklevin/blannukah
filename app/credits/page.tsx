import Logo from "@/app/components/logo";
import Navigation from "@/app/components/navigation";

export default function Page() {
    return (
        <div>
            <Logo />
            <Navigation />
            <div className="mainContent">
                <h1>Credits</h1>

                 <div className="subtext">Something about this page.</div>
            </div>
        </div>
    );
}