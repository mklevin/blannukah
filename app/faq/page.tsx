import Link from "next/link";
import Logo from "@/app/components/logo";
import Navigation from "@/app/components/navigation";

import { faqs } from "./faqs";

export default function Page() {
    return (
        <div>
            <Logo />
            <Navigation />
            <div className="main-content">
                <h1>Frequently Asked Questions</h1>

                {faqs.map((faq) => (
                  <div className="faq" key={faq.question}>
                    <h2 dangerouslySetInnerHTML={{ __html: faq.question }} />
                      {faq.answer.map((paragraph, index) => (
                        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                      ))}
                  </div>
                ))}
            </div>
            <footer>
                <span><Link href="https://mattlevin.io">© 2026 The Blue York Rhymes Company</Link></span>
            </footer>
        </div>
    );
}