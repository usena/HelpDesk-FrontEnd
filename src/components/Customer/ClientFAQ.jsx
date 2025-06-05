import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClientFAQ = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/faqs').then(res => setFaqs(res.data));
  }, []);

  return (
    <div className="accordion">
      {faqs.map((faq) => (
        <div key={faq._id} className="collapse collapse-arrow bg-base-200 mb-2">
          <input type="checkbox" />
          <div className="collapse-title font-bold">
            {faq.question}
          </div>
          <div className="collapse-content">
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientFAQ;
