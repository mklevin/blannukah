import { faqs } from "./faqs";

export default function Page() {
  return (
    <>
      <h1>Frequently Asked Questions</h1>

      {faqs.map((faq) => (
        <div className="faq" key={faq.question}>
          <h2 dangerouslySetInnerHTML={{ __html: faq.question }} />

          {faq.answer.map((paragraph, index) => (
            <p
              key={index}
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
        </div>
      ))}
    </>
  );
}