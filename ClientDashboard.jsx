'use client'; // This directive makes it a Client Component

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line
} from 'recharts';
import * as Lucide from 'lucide-react';

const MockSupabase = {
  fetchRoadmap: async () => [
    { title: "Frontend Core", status: "completed", desc: "React, Hooks, State Mgmt" },
    { title: "Backend Architecture", status: "completed", desc: "Node.js, Postgres, Redis" },
    { title: "System Design", status: "current", desc: "Scaling, Microservices, CAP" },
    { title: "AI Fundamentals", status: "locked", desc: "PyTorch, Neural Nets, Math" },
    { title: "AI Agents", status: "locked", desc: "LLMs, LangChain, Autonomy" },
  ],
  fetchCourses: async () => [
    { id: '1', title: 'Advanced React Patterns', progress: 85, icon: 'Code2', source: 'Nexus Original', type: 'Course' },
    { id: '2', title: 'Deep Learning Fundamentals', progress: 32, icon: 'BrainCircuit', source: 'MIT OpenCourseWare', type: 'Open Source' },
    { id: '3', title: 'System Design Masterclass', progress: 10, icon: 'Network', source: 'AI Generated', type: 'Dynamic' },
    { id: '4', title: 'Stanford CS224N: NLP', progress: 0, icon: 'BookOpen', source: 'YouTube/Stanford', type: 'Open Source' },
    { id: '5', title: 'Building Autonomous Agents', progress: 60, icon: 'Bot', source: 'Nexus AI', type: 'AI Generated' },
  ]
};

const classNames = (...classes) => classes.filter(Boolean).join(' ');

const useKeyPress = (targetKey, ctrlOrCmd = false) => {
  const [keyPressed, setKeyPressed] = useState(false);
  useEffect(() => {
    const downHandler = (e) => { if (e.key === targetKey && (!ctrlOrCmd || (e.ctrlKey || e.metaKey))) { e.preventDefault(); setKeyPressed(true); } };
    const upHandler = (e) => { if (e.key === targetKey) setKeyPressed(false); };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', downHandler); window.addEventListener('keyup', upHandler);
      return () => { window.removeEventListener('keydown', downHandler); window.removeEventListener('keyup', upHandler); };
    }
  }, [targetKey, ctrlOrCmd]);
  return keyPressed;
};

const SafeIcon = ({ name, className }) => {
  const IconComponent = Lucide[name] || Lucide.Box;
  return <IconComponent className={className} />;
};

const SpotlightCard = ({ children, className = '', as: Component = 'article', onClick, glowing = false }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <Component
      ref={divRef} onMouseMove={handleMouseMove} onMouseEnter={() => setOpacity(1)} onMouseLeave={() => setOpacity(0)} onClick={onClick}
      className={classNames(
        "relative overflow-hidden rounded-2xl bg-[#09090b]/80 border backdrop-blur-xl transition-all duration-300 will-change-transform",
        glowing ? "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-white/[0.05]",
        onClick ? "cursor-pointer hover:bg-white/[0.02]" : "", className
      )}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-0" style={{ opacity, background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(139,92,246,0.08), transparent 40%)` }} />
      <div className="relative z-10 h-full">{children}</div>
    </Component>
  );
};

const AnimatedProgressRing = ({ progress, size = 120, strokeWidth = 8, color = "#3b82f6" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle className="text-white/10" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <motion.circle
          strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={circumference} strokeLinecap="round" stroke={color} fill="transparent" r={radius} cx={size / 2} cy={size / 2}
          initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center"><span className="text-2xl font-bold tracking-tighter text-white">{progress}%</span></div>
    </div>
  );
};

const GithubHeatmap = React.memo(() => {
  const weeks = 52; const days = 7;
  const grid = useMemo(() => Array.from({ length: weeks * days }, () => Math.floor(Math.random() * 5)), []);
  const getColor = (val) => {
    if (val === 0) return 'bg-[#161b22] border-[#1b2128]';
    if (val === 1) return 'bg-[#0e4429] border-[#0e4429]';
    if (val === 2) return 'bg-[#006d32] border-[#006d32]';
    if (val === 3) return 'bg-[#26a641] border-[#26a641]';
    return 'bg-[#39d353] border-[#39d353]';
  };
  return (
    <section className="flex flex-col gap-3 w-full overflow-hidden">
      <header className="flex justify-between items-end mb-1">
        <div><h3 className="text-lg font-semibold text-white flex items-center gap-2"><SafeIcon name="Github" className="w-5 h-5" /> Contribution Graph</h3><p className="text-xs text-white/50">2,410 contributions last year</p></div>
      </header>
      <div className="overflow-x-auto no-scrollbar pb-2">
        <div className="grid grid-flow-col gap-1 w-max" style={{ gridTemplateRows: `repeat(${days}, minmax(0, 1fr))` }}>
          {grid.map((val, i) => <div key={i} className={classNames("w-[10px] h-[10px] rounded-[2px] border", getColor(val))} />)}
        </div>
      </div>
    </section>
  );
});

const DetailModal = ({ isOpen, onClose, title, subtitle, icon, children, headerRight }) => {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[#0F0F12] border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-[#050505]/80">
              <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                {icon && <div className="hidden sm:flex w-10 h-10 rounded-xl bg-white/5 items-center justify-center border border-white/10 shrink-0"><SafeIcon name={icon} className="w-5 h-5 text-white/80" /></div>}
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">{title}</h2>
                  {subtitle && <p className="text-xs sm:text-sm text-white/50 truncate">{subtitle}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                {headerRight}
                <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                  <SafeIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto no-scrollbar bg-gradient-to-b from-[#09090b] to-[#050505] flex-1">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const OverviewPage = ({ user, isRecruiterMode }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 w-full pb-8">
      <div className="col-span-1 md:col-span-2 lg:col-span-8">
        <SpotlightCard className="p-6 md:p-8 h-full flex flex-col md:flex-row items-center justify-between gap-6" glowing={isRecruiterMode}>
          <div className="flex-1 space-y-4 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80">
              {isRecruiterMode ? <SafeIcon name="Briefcase" className="w-3.5 h-3.5 text-emerald-400" /> : <SafeIcon name="Zap" className="w-3.5 h-3.5 text-blue-400" />}
              {isRecruiterMode ? "Open to Work • Verified Candidate" : `${user.streak} Day Learning Streak`}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {isRecruiterMode ? "Candidate Profile:" : "Welcome back,"} <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{user.name}</span>
            </h1>
            <p className="text-white/60 max-w-lg text-sm">
              {isRecruiterMode ? "Full-stack AI Engineer. Specialized in LLMs, Distributed Systems, and Next.js." : "You are crushing your goals. Continue your AI Masterclass today."}
            </p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-3 shrink-0">
             <AnimatedProgressRing progress={isRecruiterMode ? 92 : 68} size={140} color={isRecruiterMode ? "#10b981" : "#3b82f6"} />
             <div className="text-center">
               <div className="text-sm font-bold text-white">{isRecruiterMode ? "Job Readiness" : user.level}</div>
               <div className="text-xs text-white/50">{isRecruiterMode ? "Top 1% Assessment" : `${user.xp.toLocaleString()} XP`}</div>
             </div>
          </div>
        </SpotlightCard>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-4">
        <SpotlightCard className="p-6 h-full flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              <SafeIcon name={isRecruiterMode ? "Target" : "Bot"} className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{isRecruiterMode ? "Google SWE Gap Analysis" : "Learning Assistant"}</h3>
              <p className="text-xs text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Ready</p>
            </div>
          </div>
          <div className="flex-1 bg-black/40 rounded-xl p-4 text-sm text-white/80 border border-white/5 mb-4">
            {isRecruiterMode ? "Candidate exceeds requirements for L4 AI Engineer. Strongest match: ML Infrastructure. Gap: Requires C++ tuning experience." : "I can explain complex concepts, generate quizzes, or review your recent code commits."}
          </div>
          {!isRecruiterMode && (
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <button className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white transition-colors">Generate Quiz</button>
              <button className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white transition-colors">Explain Concept</button>
            </div>
          )}
        </SpotlightCard>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-12">
        <SpotlightCard className="p-6 flex items-center justify-center w-full">
          <GithubHeatmap />
        </SpotlightCard>
      </div>
    </motion.div>
  );
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  useEffect(() => { MockSupabase.fetchCourses().then(setCourses); }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl mx-auto pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div><h1 className="text-3xl font-bold text-white">Course Library</h1><p className="text-white/50 mt-1">Aggregated learning from Open Source & AI Generation.</p></div>
        <div className="flex bg-[#09090b] border border-white/10 rounded-lg p-1">
          <button className="px-4 py-1.5 bg-white/10 text-white text-sm rounded-md font-medium">All</button>
          <button className="px-4 py-1.5 text-white/50 hover:text-white text-sm rounded-md font-medium">Open Source</button>
          <button className="px-4 py-1.5 text-white/50 hover:text-white text-sm rounded-md font-medium">AI Generated</button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <SpotlightCard key={course.id} onClick={() => setSelectedCourse(course)} className="p-5 flex flex-col gap-4 group">
            <div className="flex justify-between items-start">
               <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform"><SafeIcon name={course.icon} className="w-6 h-6 text-white/70" /></div>
               <span className={classNames("text-[10px] px-2 py-1 rounded font-bold border", course.type === 'Open Source' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : course.type === 'AI Generated' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-white/5 text-white/60 border-white/10")}>{course.source}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">{course.title}</h3>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 h-1.5 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }} /></div>
                <span className="text-xs text-white/50 font-mono">{course.progress}%</span>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      <DetailModal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={selectedCourse?.title} subtitle={`${selectedCourse?.source} • ${selectedCourse?.type}`} icon={selectedCourse?.icon} headerRight={<button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20">Resume Module</button>}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="w-full aspect-video bg-black rounded-xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
               <div className="absolute inset-0 bg-[url('[https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1000&auto=format&fit=crop](https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1000&auto=format&fit=crop)')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
               <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/20 z-10">
                 <SafeIcon name="Play" className="w-6 h-6 text-white ml-1" />
               </div>
               <span className="mt-4 text-white/70 font-medium z-10 tracking-wide">Watch Latest Lecture</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><SafeIcon name="List" className="w-5 h-5 text-blue-400" /> Syllabus Modules</h3>
              <div className="space-y-3">
                {['Introduction & Architecture', 'State Management deeply', 'Performance Optimization', 'Final Capstone Project'].map((mod, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className={classNames("w-6 h-6 rounded-full flex items-center justify-center text-xs", i === 0 ? "bg-blue-500 text-white" : "bg-white/10 text-white/50")}>{i === 0 ? <SafeIcon name="Check" className="w-3 h-3" /> : i + 1}</div>
                       <span className={classNames("text-sm font-medium", i === 0 ? "text-white/60 line-through" : "text-white")}>{mod}</span>
                    </div>
                    <span className="text-xs text-white/40">45m</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <SpotlightCard className="p-5 border-purple-500/20 bg-purple-500/5">
               <h3 className="text-sm font-bold text-purple-400 mb-2 flex items-center gap-2"><SafeIcon name="Sparkles" className="w-4 h-4" /> AI Synopsis</h3>
               <p className="text-xs text-white/70 leading-relaxed mb-4">You are currently at <strong>{selectedCourse?.progress}%</strong>. Based on your speed, you will finish this course in 2 days. The next module heavily utilizes Memoization, so I recommend a quick refresher.</p>
               <button className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs font-semibold transition-colors border border-purple-500/30">Generate Quiz</button>
            </SpotlightCard>
            <SpotlightCard className="p-5">
               <h3 className="text-sm font-bold text-white mb-3">Resources</h3>
               <div className="flex flex-col gap-2">
                 <button className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors text-xs text-white/70"><span className="flex items-center gap-2"><SafeIcon name="FileText" className="w-4 h-4 text-blue-400"/> Generated Notes</span><SafeIcon name="Download" className="w-3 h-3"/></button>
                 <button className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors text-xs text-white/70"><span className="flex items-center gap-2"><SafeIcon name="Github" className="w-4 h-4 text-white"/> Source Repository</span><SafeIcon name="ExternalLink" className="w-3 h-3"/></button>
               </div>
            </SpotlightCard>
          </div>
        </div>
      </DetailModal>
    </motion.div>
  );
};

const CodingHubPage = () => {
  const [selectedContest, setSelectedContest] = useState(null);
  const stats = [
    { platform: 'LeetCode', icon: 'Code2', stats: '1,204 Solved', rank: 'Top 3%', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { platform: 'Codeforces', icon: 'BarChart2', stats: 'Rating: 1845', rank: 'Expert', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { platform: 'AtCoder', icon: 'Activity', stats: 'Rating: 1620', rank: '2 Kyu', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
  ];
  const contests = [
    { id: 1, title: 'Weekly Contest 384', platform: 'LeetCode', time: 'Starts in 2h 15m', participants: '12,450', diff: 'Medium', aiPred: 'Rank Top 5%' },
    { id: 2, title: 'Codeforces Round 920 (Div. 2)', platform: 'Codeforces', time: 'Starts Tomorrow', participants: '8,100', diff: 'Hard', aiPred: 'Rating +40' },
    { id: 3, title: 'AtCoder Beginner Contest 340', platform: 'AtCoder', time: 'In 3 Days', participants: '5,000', diff: 'Easy', aiPred: 'Full Clear' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl mx-auto pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div><h1 className="text-3xl font-bold text-white">Competitive Coding</h1><p className="text-white/50 mt-1">Live integrations with global programming platforms.</p></div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm rounded-lg font-medium transition-colors flex items-center gap-2"><SafeIcon name="RefreshCw" className="w-4 h-4"/> Sync Profiles</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((p, i) => (
          <SpotlightCard key={i} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={classNames("w-12 h-12 rounded-xl flex items-center justify-center", p.bg)}><SafeIcon name={p.icon} className={classNames("w-6 h-6", p.color)} /></div>
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-white/80">{p.rank}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{p.platform}</h3>
            <p className="text-sm text-white/50 mt-1">{p.stats}</p>
          </SpotlightCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><SafeIcon name="CalendarDays" className="w-5 h-5 text-purple-400" /> Upcoming Contests</h2>
          <div className="space-y-3">
            {contests.map((contest) => (
              <SpotlightCard key={contest.id} onClick={() => setSelectedContest(contest)} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer hover:border-purple-500/30">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">{contest.platform}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-xs text-purple-400 font-medium flex items-center gap-1"><SafeIcon name="Sparkles" className="w-3 h-3"/> AI Predicts: {contest.aiPred}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{contest.title}</h4>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-right hidden sm:block"><div className="text-sm font-semibold text-white">{contest.time}</div><div className="text-xs text-white/40">{contest.participants} Registered</div></div>
                   <button className="px-4 py-2 bg-white/10 group-hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors shrink-0">Details</button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
           <h2 className="text-xl font-bold text-white flex items-center gap-2"><SafeIcon name="Cpu" className="w-5 h-5 text-blue-400" /> AI Code Review</h2>
           <SpotlightCard className="p-5 flex flex-col gap-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2"><SafeIcon name="AlertTriangle" className="w-4 h-4 text-red-400"/><span className="text-sm font-bold text-red-400">Inefficiency Detected</span></div>
                <p className="text-xs text-white/70">Your recent submission to "Two Sum" uses O(n²) time complexity. A Hash Map implementation can reduce this to O(n).</p>
              </div>
              <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10">View AI Optimized Solution</button>
           </SpotlightCard>
        </div>
      </div>

      <DetailModal isOpen={!!selectedContest} onClose={() => setSelectedContest(null)} title={selectedContest?.title} subtitle={`${selectedContest?.platform} • ${selectedContest?.time}`} icon="Trophy" headerRight={<button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-purple-500/20">Register Now</button>}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SpotlightCard className="p-6 border-purple-500/30 bg-purple-500/5">
              <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2"><SafeIcon name="Brain" className="w-5 h-5" /> AI Contest Strategy</h3>
              <p className="text-sm text-white/80 leading-relaxed mb-4">Based on your past performance on {selectedContest?.platform}, your weakest areas are <strong>Dynamic Programming</strong> and <strong>Graph Theory</strong>. This contest historically features 2 DP problems. Focus on the first 3 easy/medium questions to secure a positive rating change.</p>
              <div className="p-4 bg-black/40 rounded-xl border border-purple-500/20">
                <div className="text-xs text-purple-300 font-mono mb-2">Predicted Outcome:</div>
                <div className="text-2xl font-bold text-white">{selectedContest?.aiPred}</div>
              </div>
            </SpotlightCard>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Recommended Warm-up</h3>
              <div className="space-y-2">
                {[
                  { name: "Longest Increasing Subsequence", type: "DP", diff: "Medium" },
                  { name: "Course Schedule II", type: "Graphs", diff: "Medium" },
                  { name: "Minimum Window Substring", type: "Sliding Window", diff: "Hard" }
                ].map((prob, i) => (
                  <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                     <div><div className="text-sm font-semibold text-white">{prob.name}</div><div className="text-[10px] text-white/50">{prob.type}</div></div>
                     <span className={classNames("text-[10px] px-2 py-1 rounded font-bold", prob.diff === 'Hard' ? 'text-red-400 bg-red-400/10' : 'text-yellow-400 bg-yellow-400/10')}>{prob.diff}</span>
                  </div>
                ))}
              </div>
            </div>
         </div>
      </DetailModal>
    </motion.div>
  );
};

const RoadmapPage = () => {
  const [nodes, setNodes] = useState([]);
  useEffect(() => { MockSupabase.fetchRoadmap().then(setNodes); }, []);

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto w-full pb-10">
      <header className="mb-8"><h1 className="text-3xl font-bold text-white tracking-tight">AI Engineer Roadmap</h1><p className="text-white/50 mt-2">Your personalized path to becoming a top-tier AI Engineer.</p></header>
      <div className="relative pl-6 md:pl-10 space-y-8">
        <div className="absolute top-4 bottom-4 left-[27px] md:left-[43px] w-0.5 bg-white/10 rounded-full">
          <motion.div className="absolute top-0 w-full bg-blue-500 rounded-full origin-top" initial={{ scaleY: 0 }} animate={{ scaleY: 0.5 }} transition={{ duration: 1.5 }} style={{ height: '100%' }} />
        </div>
        {nodes.map((node, i) => (
          <motion.article key={i} className="relative flex items-center gap-6 group">
            <div className={classNames("w-8 h-8 rounded-full border-4 ring-8 ring-[#050505] flex items-center justify-center absolute -left-4 md:-left-[18px] z-10 transition-colors duration-500", node.status === 'completed' ? 'bg-blue-500 border-blue-400' : node.status === 'current' ? 'bg-purple-500 border-purple-400 animate-pulse' : 'bg-[#09090b] border-white/20')}>
              {node.status === 'completed' && <SafeIcon name="Check" className="w-4 h-4 text-white" />}
              {node.status === 'current' && <SafeIcon name="CircleDot" className="w-4 h-4 text-white" />}
              {node.status === 'locked' && <SafeIcon name="Lock" className="w-3 h-3 text-white/40" />}
            </div>
            <SpotlightCard className="p-5 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div><h3 className={classNames("font-semibold text-lg", node.status === 'locked' ? 'text-white/40' : 'text-white')}>{node.title}</h3><p className="text-sm text-white/50 mt-1">{node.desc}</p></div>
               {node.status === 'current' && <button className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-white text-sm font-medium transition-colors">Resume Module</button>}
            </SpotlightCard>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
};

const InterviewSimulatorPage = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: "Hello. Let's do a mock interview for the AI Engineer role at Meta. Ready?" }]);

  const toggleListen = () => {
    if (typeof window === 'undefined') return;
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'user', text: "Yes, I'm ready. Let's begin." }]);
        setIsListening(false);
        setTimeout(() => { setMessages(prev => [...prev, { role: 'ai', text: "Great. Explain the difference between sparse and dense vector embeddings in a RAG pipeline." }]); }, 1000);
      }, 1500);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto pb-4 gap-6">
      <header className="shrink-0"><h1 className="text-3xl font-bold text-white">AI Voice Interview Simulator</h1><p className="text-white/50 mt-1">Real-time analysis of technical accuracy and delivery.</p></header>
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className="flex-1 bg-[#09090b] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.05)]">
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={classNames("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                <div className={classNames("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === 'ai' ? "bg-purple-500/20 border border-purple-500/30" : "bg-white/10")}>
                  {msg.role === 'ai' ? <SafeIcon name="Bot" className="w-4 h-4 text-purple-400" /> : <SafeIcon name="User" className="w-4 h-4 text-white" />}
                </div>
                <div className={classNames("p-4 rounded-2xl text-sm max-w-[80%]", msg.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/5 text-white/90 rounded-tl-none")}>{msg.text}</div>
              </div>
            ))}
            {isListening && <div className="flex gap-4 flex-row-reverse pr-12"><div className="px-4 py-2 bg-blue-600/50 rounded-full animate-pulse text-xs text-white">Listening...</div></div>}
          </div>
          <div className="p-4 border-t border-white/10 bg-[#050505]/80 flex gap-2">
             <button onClick={toggleListen} className={classNames("p-3 rounded-xl transition-all flex items-center justify-center shrink-0", isListening ? "bg-red-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10")}>
               <SafeIcon name={isListening ? "MicOff" : "Mic"} className="w-5 h-5" />
             </button>
             <input disabled={isListening} placeholder="Voice mode active. Type fallback..." className="flex-1 bg-transparent border border-white/20 rounded-xl py-3 px-4 text-sm text-white focus:border-purple-500 outline-none disabled:opacity-50" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SettingsPage = ({ user }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto pb-10 space-y-6">
    <h1 className="text-3xl font-bold text-white mb-8">User Settings</h1>
    
    <SpotlightCard className="p-6 border-white/10">
      <h3 className="text-lg font-bold text-white mb-2">Profile Information</h3>
      <div className="flex items-center gap-4 mb-6 mt-4">
        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}&backgroundColor=transparent`} className="w-16 h-16 rounded-full bg-white/10 border border-white/20" alt="Avatar"/>
        <div><p className="text-white font-medium">{user?.name}</p><p className="text-white/50 text-sm">{user?.email}</p></div>
        <button className="ml-auto px-4 py-2 bg-white/10 rounded-lg text-sm text-white hover:bg-white/20 transition-colors">Edit Profile</button>
      </div>
    </SpotlightCard>

    <SpotlightCard className="p-6">
      <h3 className="text-lg font-bold text-white mb-4">Authentication & Logins</h3>
      <div className="space-y-3">
        {[
          { provider: 'Google', icon: 'Chrome', connected: true, val: user?.email },
          { provider: 'Phone Number', icon: 'Smartphone', connected: true, val: user?.phone },
          { provider: 'GitHub', icon: 'Github', connected: false, val: 'Link account for repo sync' },
          { provider: 'Apple', icon: 'Apple', connected: false, val: 'Sign in with Apple' }
        ].map(auth => (
          <div key={auth.provider} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <SafeIcon name={auth.icon} className="w-5 h-5 text-white/70" />
              <div><p className="text-white text-sm font-medium">{auth.provider}</p><p className="text-white/40 text-xs">{auth.val}</p></div>
            </div>
            {auth.connected ? 
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Disconnect</button> :
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">Connect</button>
            }
          </div>
        ))}
      </div>
    </SpotlightCard>

    <SpotlightCard className="p-6 border-red-500/20 bg-red-500/5">
      <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
      <p className="text-sm text-white/50 mb-4">Permanently delete your account, or export all your platform data.</p>
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-sm font-medium transition-colors">Delete Account</button>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-sm font-medium transition-colors">Export All Data</button>
      </div>
    </SpotlightCard>
  </motion.div>
);

const InternshipsPage = () => {
  const jobs = [
    { title: "AI Engineer Intern", company: "OpenAI", match: 98, type: "Remote", status: "Apply Now" },
    { title: "Software Engineer Intern", company: "Google", match: 92, type: "On-site", status: "Applied" },
    { title: "Machine Learning Intern", company: "Anthropic", match: 88, type: "Remote", status: "Apply Now" }
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto pb-10">
      <header className="mb-6"><h1 className="text-3xl font-bold text-white">Live Internship Finder</h1><p className="text-white/50 mt-1">AI-matched roles based on your verified skills.</p></header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.map((job, i) => (
          <SpotlightCard key={i} className="p-5 flex flex-col justify-between gap-6">
             <div>
               <div className="flex justify-between items-start mb-2">
                 <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"><SafeIcon name="Briefcase" className="w-5 h-5 text-emerald-400" /></div>
                 <div className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">{job.match}% Match</div>
               </div>
               <h3 className="text-lg font-bold text-white mt-3">{job.title}</h3><p className="text-white/60 text-sm">{job.company} • {job.type}</p>
             </div>
             <button className={classNames("w-full py-2.5 rounded-lg text-sm font-semibold transition-all", job.status === 'Apply Now' ? "bg-white text-black hover:bg-gray-200" : "bg-white/5 text-white/50 border border-white/10")}>
               {job.status === 'Apply Now' ? "Apply with AI Agent" : job.status}
             </button>
          </SpotlightCard>
        ))}
      </div>
    </motion.div>
  )
}

const MainLayout = ({ activeTab, setActiveTab, isRecruiterMode, setIsRecruiterMode, user }) => {
  const cmdK = useKeyPress('k', true);
  const [isCmdMenuOpen, setIsCmdMenuOpen] = useState(false);
  useEffect(() => { if (cmdK) setIsCmdMenuOpen(true); }, [cmdK]);

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Overview', icon: 'LayoutGrid' },
    { id: 'courses', label: 'Course Library', icon: 'BookOpen' },
    { id: 'roadmap', label: 'AI Roadmap', icon: 'Map' },
    { id: 'simulator', label: 'Interview Sim', icon: 'Mic' },
    { id: 'internships', label: 'Internships', icon: 'Briefcase' },
    { id: 'coding', label: 'Coding Hub', icon: 'Code2' },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return <OverviewPage user={user} isRecruiterMode={isRecruiterMode} />;
      case 'courses': return <CoursesPage />;
      case 'roadmap': return <RoadmapPage />;
      case 'simulator': return <InterviewSimulatorPage />;
      case 'internships': return <InternshipsPage />;
      case 'coding': return <CodingHubPage />;
      case 'settings': return <SettingsPage user={user} />;
      default: return <div className="p-8 text-center text-white/50"><SafeIcon name="Hammer" className="w-12 h-12 mx-auto mb-4 opacity-50"/>Module under construction.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-purple-500/30 flex overflow-hidden">
      <AnimatePresence>
        {isCmdMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm px-4" onClick={() => setIsCmdMenuOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: -20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: -20 }} onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-[#0F0F12] border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(139,92,246,0.15)] overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <SafeIcon name="Search" className="w-5 h-5 text-white/40 mr-3 shrink-0" />
                <input autoFocus placeholder="Jump to..." className="flex-1 bg-transparent outline-none text-white placeholder-white/40 text-lg w-full" />
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                <div className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">Navigation</div>
                {[...NAV_ITEMS, { id: 'settings', label: 'Settings', icon: 'Settings' }].map((item, i) => (
                  <div key={i} onClick={() => { setActiveTab(item.id); setIsCmdMenuOpen(false); }} className="flex items-center px-3 py-3 rounded-lg hover:bg-white/5 cursor-pointer text-white/80 transition-colors">
                    <SafeIcon name={item.icon} className="w-4 h-4 mr-3 opacity-50" /> {item.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="hidden md:flex flex-col md:w-20 lg:w-64 border-r border-white/5 bg-[#050505]/80 backdrop-blur-xl shrink-0 relative z-20">
        <div className="flex items-center md:justify-center lg:justify-start gap-3 p-4 mb-6 mt-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] shrink-0"><SafeIcon name="Sparkles" className="w-5 h-5 text-white" /></div>
          <span className="font-bold text-lg text-white tracking-tight hidden lg:block">Nexus OS</span>
        </div>
        <nav className="flex flex-col gap-2 flex-1 px-3 overflow-y-auto no-scrollbar pb-4">
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 px-2 hidden lg:block">System Modules</div>
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={classNames("relative flex items-center md:justify-center lg:justify-start gap-3 p-3 rounded-xl transition-colors text-sm font-medium w-full text-left group", activeTab === item.id ? "text-white bg-white/5" : "text-white/50 hover:text-white/80 hover:bg-white/5")} title={item.label}>
              <SafeIcon name={item.icon} className={classNames("w-5 h-5 shrink-0", activeTab === item.id ? "text-blue-400" : "group-hover:text-white/80")} />
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t border-white/5 flex flex-col gap-4">
          <button onClick={() => setIsCmdMenuOpen(true)} className="w-full flex items-center justify-center lg:justify-between px-3 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white/50 hover:bg-white/5 transition-colors">
             <SafeIcon name="Search" className="w-4 h-4 hidden md:block lg:hidden" />
             <span className="hidden lg:flex items-center gap-2 text-sm"><SafeIcon name="Search" className="w-4 h-4" /> Search</span>
             <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-xs hidden lg:block">⌘K</span>
          </button>
          <div onClick={() => setActiveTab('settings')} className="flex items-center md:justify-center lg:justify-start gap-3 hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-colors group">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}&backgroundColor=transparent`} alt="User" className="w-8 h-8 rounded-full bg-white/10 shrink-0 border border-white/10" />
            <div className="flex flex-col text-left hidden lg:block overflow-hidden"><span className="text-sm font-medium text-white truncate">{user?.name}</span><span className="text-xs text-emerald-400">Settings</span></div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        <header className="h-14 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl z-30 flex items-center justify-between px-4 md:px-8 shrink-0">
           <div className="lg:hidden flex items-center gap-2"><div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><SafeIcon name="Sparkles" className="w-3 h-3 text-white" /></div></div>
           <div className="hidden lg:block text-xs font-mono text-white/30">nexus/v3.0.0 • {isRecruiterMode ? 'recruiter_export_ready' : 'learning_mode'}</div>
           <div className="flex items-center gap-4 ml-auto">
             <button onClick={() => setIsRecruiterMode(!isRecruiterMode)} className={classNames("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border", isRecruiterMode ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10")}>
                <SafeIcon name="Eye" className="w-3.5 h-3.5" /> {isRecruiterMode ? "Exit Recruiter Mode" : "Recruiter Export"}
             </button>
           </div>
        </header>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative z-10 pb-24 md:pb-8">
          <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}>{renderActiveTab()}</motion.div></AnimatePresence>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#09090b]/95 backdrop-blur-xl border-t border-white/10 p-2 z-50 pb-safe">
        <ul className="flex justify-around items-center overflow-x-auto gap-1 px-1 no-scrollbar">
          {NAV_ITEMS.map(item => (
             <li key={item.id}><button onClick={() => setActiveTab(item.id)} className="flex flex-col items-center gap-1 min-w-[64px] p-2 rounded-xl transition-colors active:bg-white/5"><SafeIcon name={item.icon} className={classNames("w-5 h-5", activeTab === item.id ? "text-blue-400" : "text-white/40")} /><span className={classNames("text-[10px] whitespace-nowrap", activeTab === item.id ? "text-blue-400 font-bold" : "text-white/40")}>{item.label}</span></button></li>
          ))}
          <li><button onClick={() => setActiveTab('settings')} className="flex flex-col items-center gap-1 min-w-[64px] p-2 rounded-xl transition-colors active:bg-white/5"><SafeIcon name="Settings" className={classNames("w-5 h-5", activeTab === 'settings' ? "text-emerald-400" : "text-white/40")} /><span className={classNames("text-[10px] whitespace-nowrap", activeTab === 'settings' ? "text-emerald-400 font-bold" : "text-white/40")}>Settings</span></button></li>
        </ul>
      </nav>
    </div>
  );
};

export default function ClientDashboard({ initialUser }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);

  return (
    <MainLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      isRecruiterMode={isRecruiterMode} 
      setIsRecruiterMode={setIsRecruiterMode} 
      user={initialUser} 
    />
  );
}
