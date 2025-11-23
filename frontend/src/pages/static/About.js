import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">About BookHub 2.0</h1>
        <p className="text-gray-700 mb-4">
          BookHub 2.0 is an advanced online bookstore and student learning platform designed to bring
          together leisure reading, academics, and community discussions in one modern experience.
        </p>
        <p className="text-gray-700 mb-4">
          From best-selling novels to NCERT-aligned textbooks, BookHub 2.0 helps learners of all ages—
          from Pre-KG to Class 12—discover books tailored to their interests and curriculum. Students
          can track their reading progress, explore class-wise libraries, and get personalized
          recommendations based on their activity.
        </p>
        <p className="text-gray-700">
          Our mission is simple: <span className="font-semibold">make reading and learning delightful</span>.
          Whether you're a parent, student, teacher, or book lover, BookHub 2.0 gives you a clean,
          responsive, and engaging interface to explore the world of books.
        </p>
      </div>
    </div>
  );
};

export default About;


