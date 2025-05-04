import React, { useState } from 'react';
import './Faq.css';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What currencies can I load on my ForexCard?",
      answer: "Our ForexCard supports up to 20 major currencies including USD, EUR, GBP, JPY, AUD, CAD, and more. You can easily load and manage multiple currencies through our user-friendly app or web portal."
    },
    {
      question: "How secure is the ForexCard?",
      answer: "Your ForexCard comes with bank-grade security features including chip & PIN protection, real-time transaction alerts, and 24/7 fraud monitoring. You can also instantly lock your card through our app if it's lost or stolen."
    },
    {
      question: "What are the fees and charges?",
      answer: "We offer competitive exchange rates with minimal conversion fees. There are no annual maintenance charges, and ATM withdrawals are free at partner banks worldwide. Check our pricing page for detailed fee structure."
    },
    {
      question: "How quickly can I get my ForexCard?",
      answer: "Once your application is approved, your ForexCard will be delivered within 3-5 business days. Express delivery options are available in select locations for urgent requirements."
    },
    {
      question: "Where can I use my ForexCard?",
      answer: "Your ForexCard is accepted at millions of merchants and ATMs worldwide wherever Visa/Mastercard is accepted. It can be used for in-store purchases, online shopping, and cash withdrawals across 180+ countries."
    },
    {
      question: "How do I reload my ForexCard?",
      answer: "You can instantly reload your ForexCard through our mobile app, web portal, or by visiting any of our partner banks. We support multiple payment methods including bank transfer, debit card, and digital wallets."
    }
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div 
              className={`faq-question ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFaq(index)}
            >
              {faq.question}
              <span className="faq-icon"></span>
            </div>
            <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
              <div className="faq-answer-content">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
