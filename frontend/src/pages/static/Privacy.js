import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          This demo version of BookHub 2.0 is designed for learning and demonstration purposes. It does
          not process real payments or store sensitive payment information.
        </p>
        <p className="text-gray-700 mb-4">
          The application may store basic profile data such as your name, email address, and preferences
          in a MongoDB database, only to support app features like authentication and recommendations.
        </p>
        <p className="text-gray-700 mb-4">
          You should not use real production user data or actual customer information in this demo
          environment. For any production deployment, please consult a legal professional and implement
          a full privacy policy that complies with your local regulations (such as GDPR or PDPA).
        </p>
      </div>
    </div>
  );
};

export default Privacy;


