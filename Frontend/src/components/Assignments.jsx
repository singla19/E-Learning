import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/assignments');
        setAssignments(res.data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Assignments</h2>
      {assignments.map((assignment) => (
        <div
          key={assignment._id}
          className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-300"
        >
          <h3 className="text-xl font-semibold text-gray-800">{assignment.title}</h3>
          <p className="text-gray-600 mt-1">
            <strong>Class:</strong> {assignment.classId?.name || 'N/A'}
          </p>
          <p className="text-gray-600 mt-1">
            <strong>Deadline:</strong> {assignment.deadline}
          </p>
          {assignment.comments && assignment.comments.length > 0 && (
            <div className="mt-2">
              <strong className="text-gray-700">Comments:</strong>
              <ul className="list-disc list-inside text-gray-700">
                {assignment.comments.map((comment, idx) => (
                  <li key={idx}>{comment}</li>
                ))}
              </ul>
            </div>
          )}
          {assignment.pdfUrl && (
            <a
              href={assignment.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline mt-2 block"
            >
              View PDF
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default Assignments;