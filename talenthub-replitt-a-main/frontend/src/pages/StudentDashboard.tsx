import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getStudentStats, getOverallLeaderboard, getWeeklyLeaderboard, getPracticeSessionDetail, StudentStats, LeaderboardEntry, PracticeSessionDetail, getStudentProfile } from "../lib/userApi";
import { getPaperAttempts, PaperAttempt, getPaperAttempt, PaperAttemptDetail, getPaperAttemptCount } from "../lib/api";
import { getAttendanceRecords, getAttendanceStats, getClassSessions, AttendanceRecord, AttendanceStats, ClassSession } from "../lib/attendanceApi";
import { Trophy, Target, Zap, Award, CheckCircle2, XCircle, BarChart3, History, X, Eye, ChevronDown, ChevronUp, Gift, RotateCcw, Calendar, Clock, Star, Flame, Rocket, Activity } from "lucide-react";
import AttendanceCalendar from "../components/AttendanceCalendar";
import { Link, useLocation } from "wouter";
import RewardsExplanation from "../components/RewardsExplanation";
import { formatDateToIST, formatDateOnlyToIST } from "../lib/timezoneUtils";
import { motion, AnimatePresence } from "framer-motion";

type SessionFilter = "overall" | "mental_math" | "practice_paper";

interface UnifiedSession {
  id: number;
  type: "mental_math" | "practice_paper";
  title: string;
  subtitle: string;
  started_at: string;
  completed_at: string | null;
  correct_answers: number;
  wrong_answers: number;
  accuracy: number;
  time_taken: number | null;
  points_earned: number;
  operation_type?: string;
  difficulty_mode?: string;
  paper_title?: string;
  paper_level?: string;
  paper_config?: any;
  generated_blocks?: any;
  seed?: number;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [overallLeaderboard, setOverallLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>("overall");
  const [unifiedSessions, setUnifiedSessions] = useState<UnifiedSession[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [calendarSessions, setCalendarSessions] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, overallLeaderRes, attemptsRes, profileRes] = await Promise.allSettled([
        getStudentStats(),
        getOverallLeaderboard(),
        getPaperAttempts(),
        getStudentProfile()
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (overallLeaderRes.status === 'fulfilled') setOverallLeaderboard(overallLeaderRes.value);
      
      let attempts: PaperAttempt[] = [];
      if (attemptsRes.status === 'fulfilled') {
        attempts = attemptsRes.value;
      }

      if (profileRes.status === 'fulfilled') {
        const profile = profileRes.value;
        const [attRecords, attStats, calSessions] = await Promise.allSettled([
          getAttendanceRecords({ student_profile_id: profile.id }),
          getAttendanceStats(profile.id),
          getClassSessions({ branch: profile.branch, course: profile.course })
        ]);
        if (attRecords.status === 'fulfilled') setAttendanceRecords(attRecords.value);
        if (attStats.status === 'fulfilled') setAttendanceStats(attStats.value);
        if (calSessions.status === 'fulfilled') setCalendarSessions(calSessions.value);
      }

      // Process unified sessions
      const mmSessions: UnifiedSession[] = (statsRes.status === 'fulfilled' ? statsRes.value.recent_sessions : []).map((s: any) => ({
        id: s.id, type: "mental_math", title: s.operation_type, subtitle: s.difficulty_mode, 
        started_at: s.started_at, completed_at: s.completed_at, correct_answers: s.correct_answers,
        wrong_answers: s.wrong_answers, accuracy: s.accuracy, time_taken: s.time_taken, points_earned: s.points_earned
      }));
      const pSessions: UnifiedSession[] = attempts.map(a => ({
        id: a.id, type: "practice_paper", title: a.paper_title || "Practice Paper", subtitle: a.paper_level || "Custom",
        started_at: a.started_at, completed_at: a.completed_at, correct_answers: a.correct_answers || 0,
        wrong_answers: a.wrong_answers || 0, accuracy: a.accuracy || 0, time_taken: a.time_taken, points_earned: a.points_earned || 0
      }));
      setUnifiedSessions([...mmSessions, ...pSessions].sort((a,b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <header className="mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">Neural Portal</h1>
            <p className="text-muted-foreground text-lg font-medium">Welcome back, {user?.name}. Your evolution is being tracked.</p>
          </motion.div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Neural Points", value: stats?.total_points || 0, icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
            { label: "Global Rank", value: `#${overallLeaderboard.findIndex(e => e.user_id === user?.id) + 1 || '--'}`, icon: Trophy, color: "text-primary", bg: "bg-primary/10" },
            { label: "Active Streak", value: `${stats?.current_streak || 0} Days`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Accuracy", value: `${(stats?.overall_accuracy || 0).toFixed(1)}%`, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" }
          ].map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-card border border-border hover:border-primary transition-all group shadow-xl"
            >
              <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                <s.icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
              <h3 className="text-3xl font-black italic">{s.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {/* Activity History */}
            <section className="glass-morphism rounded-[3rem] p-10 border border-border/50">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                  <History className="w-6 h-6 text-primary" /> Session History
                </h2>
                <div className="flex gap-2 bg-secondary/50 p-1 rounded-full border border-border">
                  {["overall", "mental_math", "practice_paper"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSessionFilter(f as any)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                        sessionFilter === f ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {unifiedSessions.filter(s => sessionFilter === "overall" || s.type === sessionFilter).slice(0, 10).map((session, i) => (
                  <div key={i} className="group flex items-center justify-between p-6 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${session.type === 'mental_math' ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-500'}`}>
                        {session.type === 'mental_math' ? <Zap className="w-6 h-6" /> : <Layout className="w-6 h-6" />}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-lg uppercase tracking-tight">{session.title}</h4>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                          {new Date(session.started_at).toLocaleDateString()} • {session.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-lg font-black italic">+{session.points_earned} PTS</div>
                        <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{session.accuracy.toFixed(0)}% Accuracy</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            {/* Attendance Overview */}
            <section className="bg-slate-950 text-white p-10 rounded-[3rem] border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                <Calendar className="w-32 h-32" />
              </div>
              <h2 className="text-xl font-black uppercase italic tracking-tight mb-8 relative z-10">Neural Presence</h2>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Total Classes</p>
                  <p className="text-3xl font-black italic">{attendanceStats?.total_classes || 0}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Attendance %</p>
                  <p className="text-3xl font-black italic text-primary">{attendanceStats?.attendance_percentage.toFixed(0) || 0}%</p>
                </div>
              </div>
              <Link href="/attendance">
                <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest transition-all">
                  Full Calendar View
                </button>
              </Link>
            </section>

            {/* Top Peers */}
            <section className="glass-morphism rounded-[3rem] p-10 border border-border/50">
              <h2 className="text-xl font-black uppercase italic tracking-tight mb-8">Elite Rankings</h2>
              <div className="space-y-6">
                {overallLeaderboard.slice(0, 5).map((peer, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${i === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-secondary text-muted-foreground'}`}>
                        #{i + 1}
                      </div>
                      <span className="font-bold text-sm uppercase tracking-tight">{peer.name}</span>
                    </div>
                    <span className="text-xs font-black text-primary italic">{peer.total_points} PTS</span>
                  </div>
                ))}
              </div>
              <Link href="/leaderboard">
                <button className="w-full mt-8 py-4 text-primary hover:underline text-xs font-black uppercase tracking-widest transition-all">
                  View Full Leaderboard
                </button>
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
