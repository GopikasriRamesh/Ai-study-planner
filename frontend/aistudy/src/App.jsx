import React, { useState, useRef, useEffect } from 'react';
import PlannerForm from './PlannerForm';
import StudyChart from './components/StudyChart';
import ExportPDF from './components/ExportPDF';
import { 
  Clock, Zap, GraduationCap, Calendar, Target, 
  LayoutDashboard, CheckCircle2, Circle, LogOut, RefreshCw 
} from 'lucide-react';

// Firebase Imports
import { doc, setDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from './context/AuthContext';
import Login from './components/Login';

function App() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});
  const componentRef = useRef();
  
  const { user, logOut } = useAuth();
  const palette = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#10b981'];

  // --- 1. WELCOME BACK LOGIC: Auto-pull from Firebase ---
  useEffect(() => {
    if (!user) return;

    // This creates a real-time "pipe" to your Firestore data
    const unsub = onSnapshot(doc(db, "users", user.uid, "currentPlan", "active"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // If plan exists in cloud, it populates the UI automatically on refresh
        setPlan(data.plan);
        setCompletedTasks(data.progress || {});
      } else {
        // If no plan exists in cloud, ensure local state is clear
        setPlan(null);
      }
    });

    return () => unsub();
  }, [user]);

  // --- 2. SAVE LOGIC ---
  const handleSetPlan = async (newPlan) => {
    setPlan(newPlan);
    if (user) {
      await setDoc(doc(db, "users", user.uid, "currentPlan", "active"), {
        plan: newPlan,
        progress: {},
        createdAt: new Date()
      });
    }
  };

  // --- 3. RESET LOGIC: Delete current plan ---
  const handleResetPlan = async () => {
    if (window.confirm("Are you sure you want to clear your current goal and start fresh?")) {
      setPlan(null);
      setCompletedTasks({});
      if (user) {
        // Deletes the document from Firebase
        await deleteDoc(doc(db, "users", user.uid, "currentPlan", "active"));
      }
    }
  };

  const toggleTask = async (subject) => {
    const newStatus = !completedTasks[subject];
    const updatedProgress = { ...completedTasks, [subject]: newStatus };
    setCompletedTasks(updatedProgress);
    
    if (user) {
      const planRef = doc(db, "users", user.uid, "currentPlan", "active");
      await updateDoc(planRef, { progress: updatedProgress });
    }
  };

  const totalAllocated = plan ? plan.reduce((acc, curr) => acc + curr.total_hours_allocated, 0) : 0;
  const completionRate = plan && plan.length > 0
    ? Math.round((Object.values(completedTasks).filter(Boolean).length / plan.length) * 100) 
    : 0;

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
              <GraduationCap size={24} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">Study<span className="text-indigo-600">Flow</span></span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Member</p>
              <p className="text-sm font-bold text-slate-700">{user.displayName}</p>
            </div>
            <button onClick={logOut} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <LogOut size={16} /> Logout
            </button>
            {plan && <ExportPDF targetRef={componentRef} />}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-500"><Target size={20} /></div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Configure Goal</h2>
                </div>
                {/* --- RESET BUTTON UI --- */}
                {plan && (
                  <button 
                    onClick={handleResetPlan}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all tooltip"
                    title="Reset Plan"
                  >
                    <RefreshCw size={18} />
                  </button>
                )}
              </div>
              <PlannerForm setPlan={handleSetPlan} setLoading={setLoading} />
            </div>

            {plan && (
              <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10"><Zap size={120} /></div>
                <h3 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-6 relative z-10">Daily Performance</h3>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-indigo-800" />
                        <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                strokeDasharray={213.6} strokeDashoffset={213.6 - (213.6 * completionRate) / 100}
                                className="text-indigo-400 transition-all duration-1000 stroke-round" />
                     </svg>
                     <span className="absolute text-lg font-black">{completionRate}%</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold opacity-90">Today's Milestone</p>
                    <p className="text-2xl font-black">{Object.values(completedTasks).filter(Boolean).length} / {plan.length}</p>
                    <p className="text-[10px] uppercase font-bold text-indigo-300 mt-1">Tasks Completed</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            {!plan ? (
              <div className="h-[550px] flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center p-10">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                   <LayoutDashboard size={40} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-700 tracking-tight">No Active Strategy</h3>
                <p className="text-slate-400 mt-2 max-w-xs font-medium">Configure your subjects on the left to generate your AI-optimized study route.</p>
              </div>
            ) : (
              <div ref={componentRef} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <header className="mb-12 border-b border-slate-100 pb-10 flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Personal Roadmap
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight">Focus Strategy</h2>
                      <div className="flex items-center gap-5 mt-4 text-slate-500 font-bold text-sm">
                        <span className="flex items-center gap-1.5"><Calendar size={18} className="text-indigo-400"/> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                        <span className="flex items-center gap-1.5"><Clock size={18} className="text-indigo-400"/> {totalAllocated}h Cycle</span>
                      </div>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    <div className="bg-[#fcfdfe] p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center">
                      <h3 className="text-[10px] font-black text-slate-400 mb-8 uppercase tracking-[0.3em]">Load Distribution</h3>
                      <StudyChart plan={plan} />
                      <div className="mt-8 grid grid-cols-2 gap-3 w-full">
                        {plan.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-50 shadow-sm">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: palette[i % 5] }}></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase truncate">{item.subject}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Task Management</h3>
                      {plan.map((item, i) => (
                        <div 
                          key={i} 
                          onClick={() => toggleTask(item.subject)}
                          className={`group p-6 rounded-[2rem] border transition-all cursor-pointer ${
                            completedTasks[item.subject] 
                            ? 'bg-emerald-50/30 border-emerald-100 opacity-60' 
                            : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className={`transition-colors ${completedTasks[item.subject] ? 'text-emerald-500' : 'text-slate-200 group-hover:text-indigo-300'}`}>
                                {completedTasks[item.subject] ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                              </div>
                              <div>
                                <span className={`font-black text-lg block leading-none tracking-tight ${completedTasks[item.subject] ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                  {item.subject}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 block">Daily Quota: {item.daily_avg}h</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.from({ length: Math.ceil(item.daily_avg * 2) }).map((_, idx) => (
                              <div key={idx} className={`w-2.5 h-1 rounded-full transition-colors ${completedTasks[item.subject] ? 'bg-emerald-300' : 'bg-slate-100'}`}></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;