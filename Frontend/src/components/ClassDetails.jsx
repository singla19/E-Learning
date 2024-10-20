import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import classesData from '../data/classes';

function ClassDetails() {
  const { id } = useParams();
  const classDetails = classesData.find(cls => cls.id === parseInt(id));

  const [assignments, setAssignments] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newAssignment, setNewAssignment] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  if (!classDetails) {
    return <div className="text-center mt-10 text-red-500">Class not found</div>;
  }

  const addAssignment = () => {
    if (newAssignment && newDeadline) {
      const newAssign = {
        id: Date.now(),
        title: newAssignment,
        deadline: newDeadline,
        pdf: null,
        comments: []
      };
      setAssignments([...assignments, newAssign]);
      setNewAssignment('');
      setNewDeadline('');
    }
  };

  const addStudyMaterial = () => {
    if (newMaterial) {
      setStudyMaterials([...studyMaterials, newMaterial]);
      setNewMaterial('');
    }
  };

  const addAnnouncement = () => {
    if (newAnnouncement) {
      const newAnnounce = {
        id: Date.now(),
        text: newAnnouncement,
        date: new Date().toLocaleString()
      };
      setAnnouncements([...announcements, newAnnounce]);
      setNewAnnouncement('');
    }
  };

  const handlePDFUpload = (e, assignmentId) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedAssignments = assignments.map(assign => {
          if (assign.id === assignmentId) {
            return { ...assign, pdf: reader.result };
          }
          return assign;
        });
        setAssignments(updatedAssignments);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const addComment = (assignmentId) => {
    if (newComment.trim() !== '') {
      const updatedAssignments = assignments.map(assign => {
        if (assign.id === assignmentId) {
          return { ...assign, comments: [...assign.comments, newComment] };
        }
        return assign;
      });
      setAssignments(updatedAssignments);
      setNewComment('');
      setSelectedAssignmentId(null);
    }
  };

  return (
    <div className="class-details max-w-5xl mx-auto p-6 space-y-8 bg-white rounded-lg shadow-md">
      <h2 className="text-4xl font-bold text-center text-indigo-600">{classDetails.name}</h2>

      {/* Announcements Section */}
      <div className="announcements-section bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-500">Announcements</h3>
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            placeholder="New Announcement"
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
          />
          <button 
            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
            onClick={addAnnouncement}
          >
            Post
          </button>
        </div>

        <ul className="space-y-4">
          {announcements.map((announce) => (
            <li key={announce.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              <p className="text-lg font-semibold text-gray-800">{announce.text}</p>
              <p className="text-gray-600 text-sm">Posted on: {announce.date}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Assignments Section */}
      <div className="assignments-section bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-500">Assignments</h3>
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            placeholder="New Assignment Title"
            value={newAssignment}
            onChange={(e) => setNewAssignment(e.target.value)}
          />
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-auto"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
          <button 
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition"
            onClick={addAssignment}
          >
            Assign
          </button>
        </div>

        <ul className="space-y-4">
          {assignments.map((assign) => (
            <li key={assign.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{assign.title}</h4>
                  <p className="text-gray-600">Deadline: {assign.deadline}</p>
                </div>
                <div>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={(e) => handlePDFUpload(e, assign.id)}
                    className="hidden" 
                    id={`upload-pdf-${assign.id}`}
                  />
                  <label htmlFor={`upload-pdf-${assign.id}`} className="bg-blue-500 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-blue-600 transition">
                    Upload PDF
                  </label>
                  {assign.pdf && (
                    <a 
                      href={assign.pdf} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ml-2 text-blue-500 hover:underline"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h5 className="text-lg font-semibold text-indigo-400">Comments</h5>
                <ul className="list-disc ml-5 mb-2">
                  {assign.comments.map((comment, idx) => (
                    <li key={idx} className="text-gray-700">{comment}</li>
                  ))}
                </ul>
                {selectedAssignmentId === assign.id ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                      placeholder="Add a comment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                      onClick={() => addComment(assign.id)}
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <button 
                    className="text-blue-500 hover:underline mt-2"
                    onClick={() => setSelectedAssignmentId(assign.id)}
                  >
                    Add Comment
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Study Material Section */}
      <div className="study-material-section bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-2xl font-semibold mb-4 text-indigo-500">Study Materials</h3>
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <input
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            placeholder="YouTube Link or Resource"
            value={newMaterial}
            onChange={(e) => setNewMaterial(e.target.value)}
          />
          <button 
            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
            onClick={addStudyMaterial}
          >
            Post
          </button>
        </div>

        <ul className="space-y-4">
          {studyMaterials.map((material, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              <a href={material} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{material}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ClassDetails;
