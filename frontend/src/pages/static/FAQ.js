import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      q: 'How do I create an account?',
      a: 'Click on the Register button in the top-right corner, fill in your details, and submit the form. You can register as a regular user or a student.',
    },
    {
      q: 'How does the student profile work?',
      a: 'If you register as a student, you can select your class and access the Student Library and Pre-KG Zone. Your reading activity can power personalized recommendations.',
    },
    {
      q: 'How do I place an order?',
      a: 'Add books to your cart, go to the Cart page, and click on Proceed to Checkout. Fill in your shipping details and confirm the order.',
    },
    {
      q: 'Is the payment gateway live?',
      a: 'In this version, Razorpay is integrated in test/sandbox mode. You can simulate successful payments for testing purposes.',
    },
    {
      q: 'How are recommendations generated?',
      a: 'Recommendations are based on your order history, wishlist, student class, and overall popular trends across the store.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-2">{item.q}</h3>
              <p className="text-gray-700">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;


