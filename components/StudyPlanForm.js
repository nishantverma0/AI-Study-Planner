'use client';
import { useState } from 'react';

export default function StudyPlanForm({ onGeneratePlan, isGenerating }) {
  const [subjects, setSubjects] = useState([{ name: '', topics: '', difficulty: 'medium' }]);
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: '', topics: '', difficulty: 'medium' }]);
  };

  const removeSubject = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    const validSubjects = subjects.filter(
      (s) => s.name.trim() !== '' && s.topics.trim() !== ''
    );

    if (validSubjects.length === 0 || !deadline) {
      setError('Please fill in at least one subject and set a deadline.');
      return;
    }
    
    onGeneratePlan(validSubjects, deadline);
  };

  // Get today's date in YYYY-MM-DD format to prevent past dates
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate Your Study Plan</h2>
      <form onSubmit={handleSubmit}>
        {subjects.map((subject, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Subject {index + 1}</h3>
              {subjects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubject(index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor={`subject-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name
              </label>
              <input
                type="text"
                id={`subject-name-${index}`}
                value={subject.name}
                onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Calculus I"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor={`subject-topics-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Key Topics (comma-separated)
              </label>
              <textarea
                id={`subject-topics-${index}`}
                value={subject.topics}
                onChange={(e) => handleSubjectChange(index, 'topics', e.target.value)}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Limits, Derivatives, Integrals"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor={`subject-difficulty-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id={`subject-difficulty-${index}`}
                value={subject.difficulty}
                onChange={(e) => handleSubjectChange(index, 'difficulty', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addSubject}
          className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-6 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus mr-2">
            <path d="M12 5v14"/><path d="M5 12h14"/>
          </svg>
          Add Another Subject
        </button>

        <div className="mb-6">
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
            Exam Deadline
          </label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            min={today}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isGenerating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          } transition-colors duration-200`}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Building your plan, please wait...
            </>
          ) : (
            'Generate Study Plan'
          )}
        </button>
      </form>
    </div>
  );
}
