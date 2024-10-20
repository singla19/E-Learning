import React, { useState } from 'react';
import assignmentsData from '../data/assignments';

const Assignments = () => {
  const [assignments, setAssignments] = useState(assignmentsData);

  const handleMarksChange = (assignmentId, studentId, marks) => {
    setAssignments(prevAssignments =>
      prevAssignments.map(assignment => {
        if (assignment.id === assignmentId) {
          return {
            ...assignment,
            submissions: assignment.submissions.map(submission =>
              submission.studentId === studentId
                ? { ...submission, marks: marks }
                : submission
            ),
          };
        }
        return assignment;
      })
    );
  };

  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Assignments</h2>
      {assignments.map(assignment => (
        <div key={assignment.id} className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-300">
          <h3 className="text-xl font-semibold text-gray-800">{assignment.title}</h3>
          <p className="text-gray-600">Due Date: {assignment.dueDate}</p>
          <h4 className="text-lg font-medium mt-2">Submissions:</h4>
          <ul className="list-none p-0">
            {assignment.submissions.map(submission => (
              <li key={submission.studentId} className="flex justify-between items-center py-2">
                <span className="text-gray-800">{submission.name}</span>
                <input
                  type="number"
                  placeholder="Enter marks"
                  value={submission.marks || ''}
                  onChange={e => handleMarksChange(assignment.id, submission.studentId, e.target.value)}
                  className="border border-gray-300 rounded-md p-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Assignments;
