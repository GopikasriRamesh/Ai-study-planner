import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const PlannerForm = ({ setPlan, setLoading }) => {
  const { user } = useAuth();
  const [hours, setHours] = useState(6);
  const [days, setDays] = useState(5);
  const [subjects, setSubjects] = useState([{ name: '', difficulty: 2 }]);

  const addSubject = () => setSubjects([...subjects, { name: '', difficulty: 2 }]);

  const removeSubject = (index) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Using axios.post as you requested
      const response = await axios.post('https://ai-study-planner-oqv7.onrender.com/api/generate-plan', { 
        hours: parseInt(hours), 
        days: parseInt(days), 
        subjects 
      });

      // Axios puts the response data in .data automatically
      const data = response.data;
      
      // This calls handleSetPlan in App.jsx which saves to Firebase
      setPlan(data); 

    } catch (err) {
      console.error(err);
      alert("Backend error. Is Flask running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hrs / Day</label>
          <input 
            type="number" 
            value={hours} 
            onChange={(e) => setHours(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Days</label>
          <input 
            type="number" 
            value={days} 
            onChange={(e) => setDays(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" 
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subjects & Difficulty</label>
        {subjects.map((sub, index) => (
          <div key={index} className="flex gap-2 group">
            <input 
              placeholder="e.g. Python" 
              value={sub.name} 
              onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-indigo-400 outline-none transition-all font-medium"
              required
            />
            <select 
              value={sub.difficulty} 
              onChange={(e) => handleSubjectChange(index, 'difficulty', e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2 focus:border-indigo-400 outline-none font-bold text-slate-600"
            >
              <option value="1">Low</option>
              <option value="2">Med</option>
              <option value="3">High</option>
            </select>
            {subjects.length > 1 && (
              <button type="button" onClick={() => removeSubject(index)} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <button 
        type="button" 
        onClick={addSubject} 
        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-indigo-200 hover:text-indigo-400 transition-all"
      >
        <Plus size={18} /> Add Subject
      </button>
      
      <button 
        type="submit" 
        className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-[0.98]"
      >
        {setLoading ? 'GENERATING...' : 'GENERATE PLAN'}
      </button>
    </form>
  );
};

export default PlannerForm;