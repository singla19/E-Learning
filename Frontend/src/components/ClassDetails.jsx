import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ClassDetails() {
  const { id } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [assignments, setAssignments] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [formData, setFormData] = useState({
    newAssignment: '',
    newDeadline: '',
    newMaterial: '',
    newAnnouncement: '',
    newComment: '',
  });

  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/classes/${id}`);
        setClassDetails(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClassDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = "border px-3 py-2 rounded w-full";

  const addAssignment = () => {
    const { newAssignment, newDeadline } = formData;
    if (newAssignment && newDeadline) {
      const newAssign = {
        id: Date.now(),
        title: newAssignment,
        deadline: newDeadline,
        pdf: null,
        comments: []
      };
      setAssignments([...assignments, newAssign]);
      setFormData({ ...formData, newAssignment: '', newDeadline: '' });
    }
  };

  const addStudyMaterial = () => {
    if (formData.newMaterial) {
      setStudyMaterials([...studyMaterials, formData.newMaterial]);
      setFormData({ ...formData, newMaterial: '' });
    }
  };

  const addAnnouncement = () => {
    if (formData.newAnnouncement) {
      setAnnouncements([
        ...announcements,
        {
          id: Date.now(),
          text: formData.newAnnouncement,
          date: new Date().toLocaleString()
        }
      ]);
      setFormData({ ...formData, newAnnouncement: '' });
    }
  };

  const handlePDFUpload = (e, assignmentId) => {
    const file = e.target.files[0];
    if (file?.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAssignments(prev =>
          prev.map(assign =>
            assign.id === assignmentId ? { ...assign, pdf: reader.result } : assign
          )
        );
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const addComment = (assignmentId) => {
    const { newComment } = formData;
    if (newComment.trim() !== '') {
      setAssignments(prev =>
        prev.map(assign =>
          assign.id === assignmentId
            ? { ...assign, comments: [...assign.comments, newComment] }
            : assign
        )
      );
      setFormData({ ...formData, newComment: '' });
      setSelectedAssignmentId(null);
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (!classDetails) return <div className="text-center mt-10 text-red-500">Class not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 bg-white rounded-lg shadow">
      <h2 className="text-4xl font-bold text-center text-indigo-600">{classDetails.name}</h2>

      {/* Assignments */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-700">Assignments</h3>
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
        <button onClick={addAssignment} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Assignment
        </button>

        <ul className="space-y-4">
          {assignments.map(assign => (
            <li key={assign.id} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{assign.title}</h4>
                <span className="text-sm text-gray-500">Deadline: {assign.deadline}</span>
              </div>

              <div className="mt-2">
                <input type="file" accept="application/pdf" onChange={(e) => handlePDFUpload(e, assign.id)} />
                {assign.pdf && (
                  <a href={assign.pdf} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline">
                    View PDF
                  </a>
                )}
              </div>

              <div className="mt-2 space-y-2">
                <button onClick={() => setSelectedAssignmentId(assign.id)} className="text-sm text-indigo-600 hover:underline">
                  Add Comment
                </button>

                {selectedAssignmentId === assign.id && (
                  <div className="flex flex-col gap-2 mt-2">
                    <input
                      name="newComment"
                      value={formData.newComment}
                      onChange={handleChange}
                      placeholder="Enter comment"
                      className={inputClass}
                    />
                    <button
                      onClick={() => addComment(assign.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Submit Comment
                    </button>
                  </div>
                )}

                {assign.comments.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {assign.comments.map((c, idx) => <li key={idx}>{c}</li>)}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Study Materials */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-700">Study Material</h3>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            name="newMaterial"
            value={formData.newMaterial}
            onChange={handleChange}
            placeholder="Enter YouTube link or material"
            className={inputClass}
          />
          <button onClick={addStudyMaterial} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Material
          </button>
        </div>
        <ul className="list-disc list-inside text-gray-700">
          {studyMaterials.map((material, index) => (
            <li key={index}>
              <a href={material} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
                {material}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Announcements */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-700">Announcements</h3>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            name="newAnnouncement"
            value={formData.newAnnouncement}
            onChange={handleChange}
            placeholder="Write announcement"
            className={inputClass}
          />
          <button onClick={addAnnouncement} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Post Announcement
          </button>
        </div>
        <ul className="list-disc list-inside text-gray-700">
          {announcements.map((announcement, index) => (
            <li key={index}>
              <span className="font-medium">{announcement.text}</span>{' '}
              <span className="text-sm text-gray-500">({announcement.date})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default ClassDetails;
