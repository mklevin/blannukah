"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "./faqs";

export default function Page() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      <h1>Frequently Asked Questions</h1>

      {faqs.map((faq, index) => {
        const isOpen = openFaqs.includes(index);

        return (
          <div className="faq" key={faq.question}>
            <button
              className="faq__question"
              onClick={() => toggleFaq(index)}
              aria-expanded={isOpen}
            >
              <h2
                dangerouslySetInnerHTML={{ __html: faq.question }}
              />

              <ChevronDown
                className={`faq__chevron ${isOpen ? "faq__chevron--open" : ""}`}
                size={24}
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>

            <div className={`faq__answer ${isOpen ? "faq__answer--open" : ""}`}>
              <div className="faq__answer-inner">
                {faq.answer.map((paragraph, paragraphIndex) => (
                  <p
                    key={paragraphIndex}
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
