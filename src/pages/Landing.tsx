import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckSquare, CalendarClock, BarChart3, Target, Sparkles, ListChecks } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 -z-10">
        <svg className="absolute left-[-10%] top-[-10%] opacity-30 blur-2xl animate-pulse" width="400" height="400">
          <ellipse cx="200" cy="200" rx="180" ry="120" fill="#1a1a1a" />
        </svg>
        <svg className="absolute right-[-10%] bottom-[-10%] opacity-20 blur-2xl animate-pulse" width="400" height="400">
          <ellipse cx="200" cy="200" rx="160" ry="100" fill="#1F2937" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1a1a1a] via-[#1F2937] to-[#0f0f0f] opacity-80 animate-gradient-x" />
      </div>
      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-10">
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight text-primary drop-shadow-lg">Flowstate Planner</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl text-center">
          The modern, distraction-free productivity planner. Organize your tasks, projects, and focus your day—all in one beautiful, dark workspace.
        </p>
        <Button
          size="lg"
          className="text-lg px-8 py-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
          onClick={() => navigate('/auth')}
        >
          Get Started
        </Button>
        <div className="mt-4 text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            className="underline hover:text-primary transition-colors"
            onClick={() => navigate('/auth')}
          >
            Login
          </button>
        </div>
      </main>
      {/* Bento Grid */}
      <section className="relative z-10 w-full max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Task Management */}
          <div className="bento-box group">
            <div className="bento-icon">
              <CheckSquare className="h-12 w-12 text-primary drop-shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />
            </div>
            <h3 className="bento-title">Task Management</h3>
            <p className="bento-desc">Add, organize, and prioritize your daily tasks with ease.</p>
          </div>
          {/* Calendar */}
          <div className="bento-box group">
            <div className="bento-icon">
              <CalendarClock className="h-12 w-12 text-primary drop-shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
            </div>
            <h3 className="bento-title">Smart Calendar</h3>
            <p className="bento-desc">Visualize your schedule and never miss a deadline.</p>
          </div>
          {/* Analytics */}
          <div className="bento-box group">
            <div className="bento-icon">
              <BarChart3 className="h-12 w-12 text-primary drop-shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />
            </div>
            <h3 className="bento-title">Analytics</h3>
            <p className="bento-desc">Track your productivity and see your progress over time.</p>
          </div>
          {/* Focus Mode */}
          <div className="bento-box group">
            <div className="bento-icon">
              <Target className="h-12 w-12 text-primary drop-shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
            </div>
            <h3 className="bento-title">Focus Mode</h3>
            <p className="bento-desc">Zero in on what matters most with Today's Focus.</p>
          </div>
          {/* Project Organization */}
          <div className="bento-box group">
            <div className="bento-icon">
              <ListChecks className="h-12 w-12 text-primary drop-shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />
            </div>
            <h3 className="bento-title">Project Organization</h3>
            <p className="bento-desc">Group tasks into projects and keep everything organized.</p>
          </div>
          {/* Delightful Experience */}
          <div className="bento-box group">
            <div className="bento-icon">
              <Sparkles className="h-12 w-12 text-primary drop-shadow-xl animate-bounce-slow group-hover:scale-125 transition-transform duration-300" />
            </div>
            <h3 className="bento-title">Delightful Experience</h3>
            <p className="bento-desc">Enjoy a beautiful, fast, and interactive workspace every day.</p>
          </div>
        </div>
      </section>
      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground z-20">
        &copy; {new Date().getFullYear()} Flowstate Planner. All rights reserved.
      </footer>
      {/* Bento and animation styles */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease-in-out infinite;
        }
        .bento-box {
          background: rgba(26,26,26,0.85);
          border-radius: 1.5rem;
          box-shadow: 0 4px 32px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 rgba(31,41,55,0.12);
          border: 1.5px solid #232323;
          padding: 2.5rem 1.5rem 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.3s, transform 0.3s, border 0.3s;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .bento-box:hover {
          box-shadow: 0 8px 40px 0 #6366f1cc, 0 2px 12px 0 #1F2937cc;
          border: 1.5px solid #6366f1;
          transform: translateY(-4px) scale(1.03);
        }
        .bento-icon {
          margin-bottom: 1.2rem;
          filter: drop-shadow(0 2px 8px #6366f1cc);
        }
        .bento-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
          text-align: center;
        }
        .bento-desc {
          font-size: 1rem;
          color: #a1a1aa;
          text-align: center;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite;
        }
      `}</style>
    </div>
  );
} 