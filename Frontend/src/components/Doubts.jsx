import React, { useState } from 'react';
import doubtsData from '../data/doubts';

const Doubts = () => {
  const [doubts, setDoubts] = useState(doubtsData);

  const handleAnswerChange = (id, answer) => {
    setDoubts(prevDoubts =>
      prevDoubts.map(doubt =>
        doubt.id === id ? { ...doubt, answer: answer } : doubt
      )
    );
  };

  const handleSubmit = (id) => {
    // Handle submitting the answer (e.g., save to a database)
    console.log(`Answer submitted for doubt ID ${id}`);
  };

  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Student Doubts</h2>
      {doubts.map(doubt => (
        <div key={doubt.id} className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-300">
          <h3 className="text-xl font-semibold text-gray-800">{doubt.studentName}</h3>
          <p className="text-gray-600">{doubt.question}</p>
          <input
            type="text"
            placeholder="Your answer"
            value={doubt.answer || ''}
            onChange={e => handleAnswerChange(doubt.id, e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => handleSubmit(doubt.id)}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700 transition duration-200"
          >
            Submit Answer
          </button>
        </div>
      ))}
    </div>
  );
};

export default Doubts;
