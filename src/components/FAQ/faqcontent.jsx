import React from "react";
import { useFaq } from "./faqcontext";

const FaqAccordionContent = () => {
  const { faqs } = useFaq();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map(({ id, question, answer }) => (
        <details
          key={id}
          className="collapse collapse-arrow border border-base-300 bg-base-200 rounded-box"
        >
          <summary className="collapse-title text-lg font-medium cursor-pointer">
            {question}
          </summary>
          <div className="collapse-content">
            <p>{answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
};

export default FaqAccordionContent;
