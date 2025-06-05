import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StaffFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const url = `${import.meta.env.VITE_API_URL}/service/faq`

  // Fetch FAQs from backend
  const fetchFAQs = async () => {
    try {
      const res = await axios.get(`${url}/getFaq`);
      setFaqs(res.data);
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Add new FAQ
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    try {
      const response = await axios.post(`${url}/createFaq`, { 
        question: question, 
        answer: answer });
      
      setQuestion('');
      setAnswer('');
      fetchFAQs(); // refresh list after adding
    } catch (err) {
      console.error('Failed to add FAQ:', err);
    }
  };

  // Delete FAQ by id
  const deleteFAQ = async (id) => {
    try {
      await axios.delete(`${url}/deleteFaq/${id}`);
      fetchFAQs(); // refresh list after deleting
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Add FAQ Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter the question"
          className="input input-bordered w-full mb-3"
          required
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter the answer"
          className="textarea textarea-bordered w-full mb-3"
          rows={4}
          required
        />
        <button type="submit" className="btn btn-primary">
          Add FAQ
        </button>
      </form>

      {/* FAQ Accordion List */}
      <div className="accordion space-y-3">
        {faqs.length === 0 && (
          <p className="text-center text-gray-500">No FAQs found.</p>
        )}

        {faqs.map(({ _id, question, answer }) => (
          <div key={_id} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium flex justify-between items-center">
              {question}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFAQ(_id);
                }}
                className="btn btn-error btn-sm"
                title="Delete FAQ"
              >
                Delete
              </button>
            </div>
            <div className="collapse-content">
              <p>{answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffFAQ;
