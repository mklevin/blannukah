import Logo from "@/app/components/logo";
import Navigation from "@/app/components/navigation";

export default function Page() {
    return (
        <div>
            <Logo />
            <Navigation />
            <div className="mainContent">
                <h1>Frequently Asked Questions</h1>

                <div className="faq">
                    <h2>What is this?</h2>
                    <p>This is an election! More words to come soon.</p>
                </div>

                <div className="faq">
                    <h2>Why is this?</h2>
                    <p>Because our world needs more whimsy?</p>
                </div>
            </div>
        </div>
    );
}