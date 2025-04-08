import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ClassDetails() {
  const { id } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);

  const [formData, setFormData] = useState({
    newAssignment: '',
    newDeadline: '',
  });

  const [newComment, setNewComment] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await axios.get(`http://localhost:5000/api/classes/${id}`);
        setClassDetails(classRes.data);

        const assignmentsRes = await axios.get(`http://localhost:5000/api/assignments?classId=${id}`);
        setAssignments(assignmentsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addAssignment = async () => {
    const { newAssignment, newDeadline } = formData;
    if (!newAssignment || !newDeadline) return;

    const form = new FormData();
    form.append('title', newAssignment);
    form.append('deadline', newDeadline);
    form.append('classId', id);
    if (pdfFile) form.append('pdf', pdfFile);

    try {
      const res = await axios.post('http://localhost:5000/api/assignments', form);
      setAssignments([...assignments, res.data]);
      setFormData({ newAssignment: '', newDeadline: '' });
      setPdfFile(null);
    } catch (err) {
      console.error('Error adding assignment:', err);
    }
  };

  const addComment = async (assignmentId) => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/assignments/${assignmentId}/comment`, {
        comment: newComment,
      });

      setAssignments((prev) =>
        prev.map((a) =>
          a._id === assignmentId ? { ...a, comments: res.data.comments } : a
        )
      );

      setNewComment('');
      setSelectedAssignmentId(null);
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (!classDetails) return <div className="text-center mt-10 text-red-500">Class not found</div>;

  const inputClass = "border px-3 py-2 rounded w-full";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 bg-white rounded-lg shadow">
      <h2 className="text-4xl font-bold text-center text-indigo-600">{classDetails.name}</h2>

      {/* Assignments Section */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-700">Post New Assignment</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            name="newAssignment"
            value={formData.newAssignment}
            onChange={handleChange}
            placeholder="Assignment Title"
            className={inputClass}
          />
          <input
            name="newDeadline"
            type="date"
            value={formData.newDeadline}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          className="mt-2"
        />
        <button
          onClick={addAssignment}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
        >
          Add Assignment
        </button>

        {/* Posted Assignments */}
        <ul className="space-y-4 mt-6">
          {assignments.map((assign) => (
            <li key={assign._id} className="border p-4 rounded-lg shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-lg">{assign.title || 'Untitled Assignment'}</h4>
                <span className="text-sm text-gray-500">
                  Deadline: {assign.deadline ? assign.deadline.split('T')[0] : 'Not set'}
                </span>
              </div>

              {assign.pdfUrl && (
                <a
                  href={`http://localhost:5000${assign.pdfUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View PDF
                </a>
              )}

              <div className="space-y-2 mt-2">
                <button
                  onClick={() => setSelectedAssignmentId(assign._id)}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  Add Comment
                </button>

                {selectedAssignmentId === assign._id && (
                  <div className="flex flex-col gap-2 mt-1">
                    <input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Enter comment"
                      className={inputClass}
                    />
                    <button
                      onClick={() => addComment(assign._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 w-fit"
                    >
                      Submit Comment
                    </button>
                  </div>
                )}

                {assign.comments?.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {assign.comments.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default ClassDetails;
