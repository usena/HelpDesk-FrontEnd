import React, { createContext, useContext, useState } from "react";

const FaqContext = createContext();

export const FaqProvider = ({ children }) => {
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot password'.",
    },
    {
      id: 2,
      question: "Where can I view my billing info?",
      answer: "You can find it in your dashboard under 'Billing'.",
    },
    {
      id: 3,
      question: "How do I contact support?",
      answer: "Email support@example.com or use the contact form.",
    },
  ]);

  return (
    <FaqContext.Provider value={{ faqs, setFaqs }}>
      {children}
    </FaqContext.Provider>
  );
};

export const useFaq = () => useContext(FaqContext);
