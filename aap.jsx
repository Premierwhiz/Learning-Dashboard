import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Layers, BarChart, FileText, Download, Share2, 
  Undo, Redo, ZoomIn, ZoomOut, MoveUp, MoveDown, Plus, 
  Trash2, Wand2, Type, Layout, AlignLeft, CheckCircle2,
  Moon, Sun, Monitor, Briefcase, GraduationCap, Code,
  Trophy, Globe, BookOpen, HeartHandshake, Zap, Eye,
  Lock, Unlock, Sparkles, MoveRight, ChevronRight, Activity
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const initialResume = {
  basics: {
    name: 'Alex Developer',
    label: 'Senior Software Engineer (Full-Stack)',
    email: 'alex.dev@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Architecting robust, scalable, and highly intelligent web ecosystems. Passionate about beautiful UIs, seamless UX, and high-performance microservices. FAANG experienced.'
  },
  experience: [
    { id: '1', role: 'Senior Software Engineer', company: 'Google (Alphabet Inc.)', date: '2023 — Present', desc: 'Led a team of 5 engineers to architect a high-traffic microservices cluster using Go, improving API response times by 40%.\nSpearheaded legacy React migration to Next.js 14, achieving a perfect 100 Lighthouse score.' },
    { id: '2', role: 'Full-Stack Engineer II', company: 'Amazon Web Services', date: '2020 — 2023', desc: 'Developed core features for cloud infrastructure dashboard utilized by over 2M monthly active users.\nOptimized frontend bundle size by 45% utilizing Webpack code-splitting.' }
  ],
  education: [
    { id: '1', degree: 'B.S. in Computer Science', school: 'Stanford University', date: '2014 — 2018', desc: 'Graduated with Honors (GPA: 3.9/4.0). Specialization in AI and Distributed Systems.' }
  ],
  skills: [
    { id: '1', name: 'React / Next.js', level: 95 },
    { id: '2', name: 'TypeScript / Node.js', level: 90 },
    { id: '3', name: 'Python / Django', level: 85 },
    { id: '4', name: 'AWS / Docker / K8s', level: 88 }
  ],
  projects: [
    { id: '1', title: 'AI Code Assistant', tech: 'TypeScript, OpenAI, Express', desc: 'A VS Code extension powered by LLMs that analyzes context and writes boilerplate tests automatically. Acquired 10k+ users.' }
  ],
  certifications: []
};

// --- MAIN APPLICATION COMPONENT ---
export default function ResumeForge() {
  // Application State
  const [activeTab, setActivePanel] = useState('editor'); // editor, theme, ats, ai, analytics
  const [zoom, setZoom] = useState(0.85);
  const [history, setHistory] = useState([initialResume]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Premium SaaS State
  const [variant, setVariant] = useState('v1-faang');
  const [isPublic, setIsPublic] = useState(false);
  const [activeSection, setActiveSection] = useState('basics');

  // Advanced Customization State
  const [theme, setTheme] = useState({
    font: 'font-sans',
    primary: '#38bdf8',
    mode: 'dark', // dark, light
    fontSize: 'text-sm',
    spacing: 'gap-6',
    lineHeight: 'leading-relaxed'
  });

  const currentResume = history[historyIndex];

  // --- KEYBOARD SHORTCUTS & HISTORY ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo(); }
        if (e.key === 'y') { e.preventDefault(); redo(); }
        if (e.key === '=') { e.preventDefault(); setZoom(z => Math.min(2, z + 0.1)); }
        if (e.key === '-') { e.preventDefault(); setZoom(z => Math.max(0.3, z - 0.1)); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const updateResume = (newResume) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newResume);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => { if (historyIndex > 0) setHistoryIndex(historyIndex - 1); };
  const redo = () => { if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1); };

  // --- DATA HANDLERS ---
  const handleBasicChange = (field, value) => {
    updateResume({ ...currentResume, basics: { ...currentResume.basics, [field]: value } });
  };

  const moveItem = (listName, index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === currentResume[listName].length - 1)) return;
    const newList = [...currentResume[listName]];
    const temp = newList[index];
    newList[index] = newList[index + direction];
    newList[index + direction] = temp;
    updateResume({ ...currentResume, [listName]: newList });
  };

  const addSectionItem = (listName, defaultObj) => {
    const newList = [...currentResume[listName], { id: Date.now().toString(), ...defaultObj }];
    updateResume({ ...currentResume, [listName]: newList });
  };

  const deleteItem = (listName, index) => {
    const newList = currentResume[listName].filter((_, i) => i !== index);
    updateResume({ ...currentResume, [listName]: newList });
  };

  const scrollToSection = (id) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  // --- UI COMPONENTS ---
  const TopBar = () => (
    <div className="h-16 bg-[#0B0F19] border-b border-gray-800 flex items-center justify-between px-6 text-sm text-gray-300 z-50">
      <div className="flex items-center gap-6">
        <div className="font-bold text-white text-xl flex items-center gap-2 tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <Sparkles size={18} />
          </div>
          ResumeForge <span className="text-xs font-medium bg-gradient-to-r from-amber-200 to-yellow-400 text-black px-2 py-0.5 rounded ml-2">PRO</span>
        </div>
        
        <div className="h-6 w-px bg-gray-800"></div>
        
        <div className="flex items-center gap-2 bg-gray-900/50 p-1 rounded-lg border border-gray-800">
          <Layers size={14} className="text-gray-400 ml-2" />
          <select 
            className="bg-transparent border-none text-white focus:outline-none py-1 pr-4 cursor-pointer"
            value={variant} onChange={(e) => setVariant(e.target.value)}
          >
            <option value="v1-faang">v1: FAANG Target</option>
            <option value="v2-startup">v2: Startup / Unicorn</option>
            <option value="v3-exec">v3: Executive Level</option>
          </select>
        </div>

        <button 
          onClick={() => setIsPublic(!isPublic)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isPublic ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
        >
          {isPublic ? <Unlock size={12}/> : <Lock size={12}/>}
          {isPublic ? 'Public Link Active' : 'Private Mode'}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1 mr-2">
          <button onClick={undo} disabled={historyIndex === 0} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white disabled:opacity-30"><Undo size={16} /></button>
          <button onClick={redo} disabled={historyIndex === history.length - 1} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white disabled:opacity-30"><Redo size={16} /></button>
        </div>
        
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 mr-2">
          <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"><ZoomOut size={16} /></button>
          <span className="w-12 text-center text-xs font-medium text-white">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"><ZoomIn size={16} /></button>
        </div>

        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-gray-700">
          <Globe size={16} /> Publish as Website
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg font-semibold transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <Download size={16} /> Export PDF
        </button>
      </div>
    </div>
  );

  const SideNav = () => (
    <div className="w-20 bg-[#0B0F19] border-r border-gray-800 flex flex-col items-center py-6 gap-6 z-10">
      {[
        { id: 'editor', icon: Layout, label: 'Content Builder' },
        { id: 'theme', icon: Settings, label: 'Theme Studio' },
        { id: 'ats', icon: BarChart, label: 'ATS Analytics' },
        { id: 'ai', icon: Wand2, label: 'AI Assistants' },
        { id: 'analytics', icon: Activity, label: 'Resume Insights' }
      ].map(tab => (
        <button 
          key={tab.id}
          onClick={() => setActivePanel(tab.id)}
          className={`p-3.5 rounded-2xl transition-all relative group flex justify-center items-center ${activeTab === tab.id ? 'bg-sky-500/10 text-sky-400 shadow-[inset_0_0_20px_rgba(56,189,248,0.1)]' : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'}`}
        >
          <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span className="absolute left-20 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-gray-700">
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );

  const EditorPanel = () => (
    <div className="w-[380px] bg-[#0F1423] border-r border-gray-800 flex flex-col h-full overflow-y-auto custom-scrollbar p-6 z-10">
      <h2 className="text-white font-bold text-xl mb-6 tracking-tight">Content Editor</h2>
      
      {/* Basics Section */}
      <div className="mb-8">
        <h3 className="text-gray-400 font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Eye size={16}/> Personal Identity</h3>
        <div className="space-y-4">
          <input type="text" value={currentResume.basics.name} onChange={e => handleBasicChange('name', e.target.value)} className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-sky-500 focus:bg-gray-900 outline-none transition-all" placeholder="Full Name" />
          <input type="text" value={currentResume.basics.label} onChange={e => handleBasicChange('label', e.target.value)} className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-sky-500 focus:bg-gray-900 outline-none transition-all" placeholder="Target Job Title" />
          <div className="relative group">
            <textarea value={currentResume.basics.summary} onChange={e => handleBasicChange('summary', e.target.value)} className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-sky-500 focus:bg-gray-900 outline-none h-32 resize-none transition-all" placeholder="Executive Summary" />
            <button className="absolute bottom-3 right-3 p-1.5 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/40 transition-colors" title="AI Improve Summary"><Wand2 size={14}/></button>
          </div>
        </div>
      </div>

      {/* Dynamic Sections Renderer */}
      {[
        { key: 'experience', label: 'Work Experience', icon: Briefcase, defaultItem: { role: 'New Role', company: 'Company', date: 'Date', desc: 'Description' } },
        { key: 'education', label: 'Education', icon: GraduationCap, defaultItem: { degree: 'Degree', school: 'Institution', date: 'Date', desc: '' } },
        { key: 'projects', label: 'Featured Projects', icon: Code, defaultItem: { title: 'Project Name', tech: 'Tech Stack', desc: 'Description' } }
      ].map(section => (
        <div key={section.key} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider"><section.icon size={16}/> {section.label}</h3>
            <button onClick={() => addSectionItem(section.key, section.defaultItem)} className="text-sky-400 hover:text-sky-300 bg-sky-400/10 p-1.5 rounded-md transition-colors"><Plus size={16}/></button>
          </div>
          
          <div className="space-y-4">
            {currentResume[section.key]?.map((item, idx) => (
              <div key={item.id} className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 group relative hover:border-gray-700 transition-colors">
                {/* Drag Controls */}
                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                  <button onClick={() => moveItem(section.key, idx, -1)} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400"><MoveUp size={14}/></button>
                  <button onClick={() => moveItem(section.key, idx, 1)} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400"><MoveDown size={14}/></button>
                  <button onClick={() => deleteItem(section.key, idx)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded text-red-400 ml-1"><Trash2 size={14}/></button>
                </div>
                
                {Object.keys(section.defaultItem).map(field => (
                  field === 'desc' ? (
                    <div className="relative mt-2" key={field}>
                      <textarea 
                        value={item[field]} 
                        onChange={(e) => {
                          const newList = [...currentResume[section.key]];
                          newList[idx][field] = e.target.value;
                          updateResume({ ...currentResume, [section.key]: newList });
                        }}
                        className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-gray-300 text-sm h-20 resize-none outline-none focus:border-sky-500" 
                      />
                      <button className="absolute bottom-2 right-2 flex items-center gap-1 bg-indigo-500 text-white text-xs px-2 py-1 rounded shadow-lg hover:bg-indigo-600 transition-colors">
                        <Sparkles size={10} /> Smart Bullets
                      </button>
                    </div>
                  ) : (
                    <input 
                      key={field}
                      type="text" 
                      value={item[field]} 
                      onChange={(e) => {
                        const newList = [...currentResume[section.key]];
                        newList[idx][field] = e.target.value;
                        updateResume({ ...currentResume, [section.key]: newList });
                      }}
                      className={`w-[80%] bg-transparent outline-none mb-1 ${field === 'role' || field === 'title' || field === 'degree' ? 'text-white font-bold' : 'text-sky-400 text-sm font-medium'}`} 
                    />
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Sections Library */}
      <div className="mt-4 pt-6 border-t border-gray-800">
        <h3 className="text-gray-400 font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Layers size={16}/> Section Library</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Certifications', 'Awards', 'Publications', 'Volunteering', 'Languages'].map(sec => (
            <button key={sec} className="bg-gray-900 border border-gray-800 hover:border-sky-500/50 hover:bg-sky-500/5 text-gray-300 py-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all text-xs font-medium group">
              <Plus size={18} className="text-gray-500 group-hover:text-sky-400" /> {sec}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const ThemePanel = () => (
    <div className="w-[380px] bg-[#0F1423] border-r border-gray-800 flex flex-col h-full overflow-y-auto custom-scrollbar p-6 z-10">
      <h2 className="text-white font-bold text-xl mb-6 tracking-tight">Advanced Theme Customizer</h2>
      
      <div className="space-y-8">
        {/* Color System */}
        <div>
          <label className="text-gray-400 font-semibold mb-4 block text-sm uppercase tracking-wider">Brand Color</label>
          <div className="flex flex-wrap gap-4">
            {['#38bdf8', '#f472b6', '#a78bfa', '#34d399', '#fbbf24', '#f87171'].map(color => (
              <button 
                key={color} 
                onClick={() => setTheme({...theme, primary: color})}
                className={`w-10 h-10 rounded-full border-2 transition-all ${theme.primary === color ? 'border-white scale-110 shadow-[0_0_15px_var(--tw-shadow-color)]' : 'border-transparent hover:scale-110'}`}
                style={{ backgroundColor: color, '--tw-shadow-color': color }}
              />
            ))}
          </div>
        </div>

        {/* Global Typography */}
        <div>
          <label className="text-gray-400 font-semibold mb-4 block text-sm uppercase tracking-wider">Typography System</label>
          <div className="space-y-3">
            <select 
              value={theme.font} 
              onChange={(e) => setTheme({...theme, font: e.target.value})}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white outline-none focus:border-sky-500"
            >
              <option value="font-sans">Inter (Modern Sans)</option>
              <option value="font-serif">Merriweather (Classic Serif)</option>
              <option value="font-mono">Fira Code (Tech Mono)</option>
            </select>
            
            <div className="grid grid-cols-2 gap-3">
              <select 
                value={theme.fontSize} 
                onChange={(e) => setTheme({...theme, fontSize: e.target.value})}
                className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white outline-none text-sm"
              >
                <option value="text-sm">Compact Text</option>
                <option value="text-base">Normal Text</option>
                <option value="text-lg">Large Text</option>
              </select>
              <select 
                value={theme.lineHeight} 
                onChange={(e) => setTheme({...theme, lineHeight: e.target.value})}
                className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white outline-none text-sm"
              >
                <option value="leading-tight">Tight Lines</option>
                <option value="leading-relaxed">Relaxed Lines</option>
                <option value="leading-loose">Loose Lines</option>
              </select>
            </div>
          </div>
        </div>

        {/* Spatial Engine */}
        <div>
          <label className="text-gray-400 font-semibold mb-4 block text-sm uppercase tracking-wider">Spatial Layout</label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-900 rounded-lg border border-gray-800">
            {['gap-4', 'gap-6', 'gap-10'].map((sp, i) => (
              <button 
                key={sp}
                onClick={() => setTheme({...theme, spacing: sp})}
                className={`py-2 rounded-md text-xs font-medium transition-all ${theme.spacing === sp ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {['Compact', 'Standard', 'Spacious'][i]}
              </button>
            ))}
          </div>
        </div>

        {/* Output Mode */}
        <div>
          <label className="text-gray-400 font-semibold mb-4 block text-sm uppercase tracking-wider">Document Mode</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setTheme({...theme, mode: 'dark'})} 
              className={`py-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${theme.mode === 'dark' ? 'bg-gray-900 border-sky-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.1)]' : 'border-gray-800 text-gray-500 bg-gray-900/50 hover:bg-gray-900'}`}
            >
              <Moon size={24}/> <span className="font-semibold text-sm">Dark SaaS</span>
            </button>
            <button 
              onClick={() => setTheme({...theme, mode: 'light'})} 
              className={`py-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${theme.mode === 'light' ? 'bg-gray-100 border-sky-500 text-gray-900 shadow-[0_0_20px_rgba(56,189,248,0.1)]' : 'border-gray-800 text-gray-500 bg-gray-900/50 hover:bg-gray-900'}`}
            >
              <Sun size={24}/> <span className="font-semibold text-sm">Light Print</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  const ATSPanel = () => {
    const score = 92; // Mock dynamic score
    return (
      <div className="w-[380px] bg-[#0F1423] border-r border-gray-800 flex flex-col h-full p-6 z-10 overflow-y-auto custom-scrollbar">
        <h2 className="text-white font-bold text-xl mb-6 tracking-tight">Live ATS Engine</h2>
        
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center mb-8 border border-gray-700 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_70%)]"></div>
          
          {/* Circular Progress SVG */}
          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="72" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
              <circle 
                cx="80" cy="80" r="72" 
                stroke={theme.primary} strokeWidth="12" fill="none" 
                strokeDasharray="452" strokeDashoffset={452 - (452 * score) / 100} 
                strokeLinecap="round"
                className="transition-all duration-1500 ease-out" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black text-white tracking-tighter">{score}</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Score</span>
            </div>
          </div>
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-4 py-1.5 rounded-full flex items-center gap-2 border border-emerald-500/20"><CheckCircle2 size={16}/> Top 5% Candidate</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-white mb-1">340</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Word Count</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-white mb-1">1.2s</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Read Time</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-gray-400 font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2"><Zap size={16}/> Keyword Match</h3>
          <div className="flex flex-wrap gap-2">
            {['Microservices', 'Next.js', 'React', 'Go', 'AWS', 'Docker', 'Scalable', 'Kubernetes'].map(kw => (
              <span key={kw} className="bg-sky-500/10 border border-sky-500/20 text-sky-400 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide">{kw}</span>
            ))}
            <span className="bg-gray-800 border border-gray-700 text-gray-400 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide">+ Add Keyword</span>
          </div>
        </div>
      </div>
    );
  };

  const AIPanel = () => (
    <div className="w-[380px] bg-[#0F1423] border-r border-gray-800 flex flex-col h-full p-6 z-10">
      <h2 className="text-white font-bold text-xl mb-6 tracking-tight">AI Co-Pilot</h2>
      
      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-5 mb-6 shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -top-4 text-indigo-500/20"><Sparkles size={100}/></div>
        <h3 className="text-indigo-300 font-bold mb-2 flex items-center gap-2 text-lg relative z-10"><Monitor size={18}/> Job Tailoring</h3>
        <p className="text-gray-300 text-sm mb-4 relative z-10 leading-relaxed">Paste the job description. Our AI will automatically rewrite your bullet points to match the required qualifications.</p>
        <textarea className="w-full bg-gray-950/50 border border-indigo-500/20 rounded-xl p-3 text-white text-sm h-32 mb-4 outline-none focus:border-indigo-400 relative z-10 resize-none placeholder-gray-600" placeholder="Paste JD here..." />
        <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] relative z-10 flex items-center justify-center gap-2">
          <Wand2 size={18}/> Auto-Tailor Resume
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-lg"><FileText size={18}/> Cover Letter Gen</h3>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">Generate a highly personalized cover letter based exactly on your resume structure and tone.</p>
        <button className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
          Generate Document <MoveRight size={16}/>
        </button>
      </div>
    </div>
  );


  // --- THE CANVAS (ULTRA-PREMIUM RENDERING ENGINE) ---
  const ResumeCanvas = () => {
    const isDark = theme.mode === 'dark';
    
    // Resume Styles strictly driven by state for real-time engine
    const canvasTheme = {
      bg: isDark ? '#050505' : '#ffffff',
      surface: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
      border: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
      textMain: isDark ? '#f8fafc' : '#0f172a',
      textMuted: isDark ? '#94a3b8' : '#64748b',
    };

    return (
      <div className="flex-1 bg-[#050505] overflow-y-auto custom-scrollbar flex flex-col items-center py-12 relative print:p-0 print:bg-white" id="canvas-container">
        
        {/* Real-time Mini Navigation */}
        <div className="fixed right-8 top-24 bg-[#0B0F19]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-2 flex flex-col gap-2 shadow-2xl print:hidden z-20">
          {[
            { id: 'basics', icon: Eye },
            { id: 'experience', icon: Briefcase },
            { id: 'skills', icon: Code },
            { id: 'education', icon: GraduationCap }
          ].map((sec) => (
            <button 
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${activeSection === sec.id ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
            >
              <sec.icon size={18} />
              <span className="absolute right-14 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity border border-gray-700 shadow-xl capitalize">
                {sec.id}
              </span>
            </button>
          ))}
        </div>

        {/* Scaling Wrapper */}
        <div 
          className="print:shadow-none print:transform-none transform-gpu origin-top transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* ==========================================================
              PAGE 1 (A4 Aspect Ratio Approximation for Screen + Print)
              ========================================================== */}
          <div 
            className={`w-[210mm] min-h-[297mm] shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-md mb-12 relative overflow-hidden ${theme.font} print:m-0 print:w-full print:min-h-0 print:h-auto print:rounded-none print:shadow-none print:break-inside-avoid`}
            style={{ backgroundColor: canvasTheme.bg, color: canvasTheme.textMain }}
          >
            {/* Premium Background Textures (Builder only) */}
            {isDark && (
              <div className="print:hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.15]" style={{background: theme.primary}}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.1]" style={{background: '#818cf8'}}></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
              </div>
            )}

            {/* Content Container */}
            <div className={`p-14 h-full flex flex-col ${theme.spacing}`}>
              
              {/* Top Hero Header Block */}
              <div id="section-basics" className="flex items-center gap-8 pb-8 border-b" style={{borderColor: canvasTheme.border}}>
                <div className="w-36 h-36 rounded-[2rem] p-1 shadow-2xl shrink-0" style={{background: `linear-gradient(135deg, ${theme.primary}, transparent)`}}>
                  <div className="w-full h-full rounded-[1.8rem] overflow-hidden" style={{backgroundColor: canvasTheme.bg}}>
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Profile" className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-5xl font-extrabold tracking-tight mb-2 uppercase">{currentResume.basics.name}</h1>
                  <h2 className="text-xl font-bold tracking-wide mb-4" style={{color: theme.primary}}>{currentResume.basics.label}</h2>
                  <div className="flex gap-5 font-semibold tracking-wide" style={{color: canvasTheme.textMuted}}>
                    <span className="flex items-center gap-2"><Monitor size={16}/> {currentResume.basics.email}</span>
                    <span className="flex items-center gap-2"><Globe size={16}/> {currentResume.basics.location}</span>
                  </div>
                </div>
              </div>

              {/* Summary Block */}
              <div className="p-6 rounded-2xl border backdrop-blur-md" style={{backgroundColor: canvasTheme.surface, borderColor: canvasTheme.border}}>
                <p className={`${theme.fontSize} ${theme.lineHeight} font-medium`} style={{color: canvasTheme.textMuted}}>
                  {currentResume.basics.summary}
                </p>
              </div>

              {/* Main Grid: Left (Experience/Projects) - Right (Skills/Ed) */}
              <div className="grid grid-cols-12 gap-12 mt-4 flex-1">
                
                {/* --- LEFT COLUMN --- */}
                <div className="col-span-7 flex flex-col gap-10">
                  
                  {/* Experience Timeline */}
                  <div id="section-experience">
                    <h3 className="text-2xl font-extrabold mb-8 flex items-center gap-3 tracking-tight uppercase">
                      <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner" style={{background: `${theme.primary}20`, color: theme.primary, border: `1px solid ${theme.primary}40`}}><Briefcase size={20}/></span>
                      Experience
                    </h3>
                    
                    <div className="space-y-10 relative pl-8 border-l-2" style={{borderColor: canvasTheme.border}}>
                      {currentResume.experience.map(exp => (
                        <div key={exp.id} className="relative group">
                          {/* Timeline Dot */}
                          <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-[3px] shadow-[0_0_10px_var(--tw-shadow-color)] transition-transform group-hover:scale-125 bg-white print:bg-black print:border-black" style={{borderColor: theme.primary, backgroundColor: canvasTheme.bg, '--tw-shadow-color': theme.primary}}></div>
                          
                          <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase mb-3 border backdrop-blur-sm" style={{color: canvasTheme.textMuted, backgroundColor: canvasTheme.surface, borderColor: canvasTheme.border}}>{exp.date}</div>
                          <h4 className="text-xl font-bold mb-1 tracking-tight">{exp.role}</h4>
                          <div className="text-sm font-bold uppercase tracking-wider mb-4" style={{color: theme.primary}}>{exp.company}</div>
                          <div className={`${theme.fontSize} ${theme.lineHeight} font-medium space-y-2`} style={{color: canvasTheme.textMuted}}>
                            {exp.desc.split('\n').map((line, i) => (
                              <div key={i} className="flex gap-3 items-start">
                                <span className="mt-1" style={{color: theme.primary}}><ChevronRight size={14}/></span>
                                <span>{line}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects Card Blocks */}
                  {currentResume.projects && currentResume.projects.length > 0 && (
                    <div id="section-projects">
                      <h3 className="text-2xl font-extrabold mb-8 flex items-center gap-3 tracking-tight uppercase">
                        <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner" style={{background: `${theme.primary}20`, color: theme.primary, border: `1px solid ${theme.primary}40`}}><Code size={20}/></span>
                        Featured Projects
                      </h3>
                      <div className="space-y-6">
                        {currentResume.projects.map(proj => (
                          <div key={proj.id} className="p-6 rounded-2xl border backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-2xl print:shadow-none print:transform-none" style={{backgroundColor: canvasTheme.surface, borderColor: canvasTheme.border}}>
                            <h4 className="text-lg font-bold mb-2 tracking-tight">{proj.title}</h4>
                            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{color: theme.primary}}>{proj.tech}</div>
                            <p className={`${theme.fontSize} ${theme.lineHeight} font-medium`} style={{color: canvasTheme.textMuted}}>{proj.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* --- RIGHT COLUMN --- */}
                <div className="col-span-5 flex flex-col gap-10">
                  
                  {/* Skill Progress Bars */}
                  <div id="section-skills">
                    <h3 className="text-2xl font-extrabold mb-8 flex items-center gap-3 tracking-tight uppercase">
                      <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner" style={{background: `${theme.primary}20`, color: theme.primary, border: `1px solid ${theme.primary}40`}}><Zap size={20}/></span>
                      Core Skills
                    </h3>
                    
                    <div className="space-y-6">
                      {currentResume.skills.map(skill => (
                        <div key={skill.id} className="group">
                          <div className="flex justify-between text-sm font-bold tracking-wide mb-2 uppercase">
                            <span>{skill.name}</span>
                            <span style={{color: theme.primary}}>{skill.level}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full overflow-hidden relative" style={{backgroundColor: canvasTheme.border}}>
                            <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out" style={{width: `${skill.level}%`, backgroundColor: theme.primary}}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education Cards */}
                  <div id="section-education">
                    <h3 className="text-2xl font-extrabold mb-8 flex items-center gap-3 tracking-tight uppercase">
                      <span className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner" style={{background: `${theme.primary}20`, color: theme.primary, border: `1px solid ${theme.primary}40`}}><GraduationCap size={20}/></span>
                      Education
                    </h3>
                    
                    <div className="space-y-6">
                      {currentResume.education.map(ed => (
                        <div key={ed.id} className="p-6 rounded-2xl border backdrop-blur-md relative overflow-hidden group" style={{backgroundColor: canvasTheme.surface, borderColor: canvasTheme.border}}>
                          <div className="absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity" style={{color: theme.primary}}><Trophy size={80}/></div>
                          <div className="inline-block px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase mb-3 border backdrop-blur-sm relative z-10" style={{color: canvasTheme.textMuted, backgroundColor: canvasTheme.bg, borderColor: canvasTheme.border}}>{ed.date}</div>
                          <h4 className="text-lg font-bold mb-1 tracking-tight relative z-10">{ed.degree}</h4>
                          <div className="text-sm font-bold uppercase tracking-wider mb-3 relative z-10" style={{color: theme.primary}}>{ed.school}</div>
                          <p className={`text-xs ${theme.lineHeight} font-medium relative z-10`} style={{color: canvasTheme.textMuted}}>{ed.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          {/* ==========================================================
              END PAGE 1
              ========================================================== */}

          {/* Multiple Page Indicator (Builder Mode Only) */}
          <div className="w-[210mm] flex items-center justify-center gap-4 mb-12 opacity-50 print:hidden relative">
            <div className="h-px bg-gray-600 flex-1"></div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] bg-[#050505] px-4 py-1 rounded-full border border-gray-700">Auto Page Break (A4)</span>
            <div className="h-px bg-gray-600 flex-1"></div>
          </div>

          {/* PAGE 2 Placeholder (To demonstrate auto-layout capability for users adding huge content) */}
          <div className="w-[210mm] min-h-[297mm] shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-md mb-12 p-14 flex items-center justify-center print:m-0 print:w-full print:h-auto print:rounded-none print:shadow-none print:break-inside-avoid print:hidden" style={{ backgroundColor: canvasTheme.bg, color: canvasTheme.textMuted }}>
             <div className="text-center flex flex-col items-center gap-4">
                <Layers size={40} style={{color: theme.primary}} className="opacity-50" />
                <h3 className="text-xl font-bold uppercase tracking-widest">Page 2 Extension</h3>
                <p className="max-w-md text-sm leading-relaxed">Our Fully Automatic Layout Engine dynamically calculates DOM heights and spills overflowing content seamlessly into this page while adhering to your chosen spacing parameters.</p>
             </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-950 text-white font-sans overflow-hidden select-none">
      
      {/* Global Scrollbar Customization for SaaS feel */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        ::selection { background: ${theme.primary}40; color: white; }
      `}} />

      <TopBar />
      
      <div className="flex flex-1 overflow-hidden relative">
        <SideNav />
        
        {/* Dynamic Left Panels */}
        {activeTab === 'editor' && <EditorPanel />}
        {activeTab === 'theme' && <ThemePanel />}
        {activeTab === 'ats' && <ATSPanel />}
        {activeTab === 'ai' && <AIPanel />}
        {activeTab === 'analytics' && (
          <div className="w-[380px] bg-[#0F1423] border-r border-gray-800 flex flex-col h-full p-6 z-10">
            <h2 className="text-white font-bold text-xl mb-6 tracking-tight flex items-center gap-2"><Activity size={20}/> Resume Analytics</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <span className="block text-4xl font-black text-white mb-2 tracking-tighter">1,248</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Profile Views</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <span className="block text-2xl font-bold text-sky-400 mb-1">84</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Downloads</span>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <span className="block text-2xl font-bold text-emerald-400 mb-1">12</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Interviews</span>
              </div>
            </div>
          </div>
        )}

        <ResumeCanvas />
      </div>
    </div>
  );
}