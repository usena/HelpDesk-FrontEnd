// src/components/FAQ/faqpage.jsx
import React from "react";
import { FaqProvider } from "./faqcontext";
import FaqAccordionContent from "./faqcontent";


const FaqAccordion = () => (
  <FaqProvider>
    
    <FaqAccordionContent />
  </FaqProvider>
);

export default FaqAccordion;
