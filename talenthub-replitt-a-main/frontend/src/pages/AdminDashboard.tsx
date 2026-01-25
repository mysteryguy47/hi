import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { 
  getAdminStats, getAllStudents, AdminStats, User
} from "../lib/userApi";
import { Shield, Users, Target, Search, Zap, ChevronRight } from "lucide-react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, studentsData] = await Promise.all([getAdminStats(), getAllStudents()]);
        setStats(statsData);
        setStudents(studentsData);
      } catch (error) { console.error(error); }
    }
    loadData();
  }, []);

  if (!isAdmin && false) return <div className="p-20 text-center font-black">UNAUTHORIZED NEURAL ACCESS.</div>;

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s as any).public_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">Neural Nexus</h1>
            <p className="text-muted-foreground text-lg font-medium">Central command for all student evolution tracks.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/attendance">
              <button className="px-6 py-3 bg-card border border-border rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">Attendance Sync</button>
            </Link>
            <Link href="/fees">
              <button className="px-6 py-3 bg-card border border-border rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">Financial Grid</button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Recruits", value: stats?.total_students, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Neural Sessions", value: stats?.total_sessions, icon: Target, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Avg Efficiency", value: `${stats?.average_accuracy.toFixed(1)}%`, icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Active Nodes", value: (stats as any)?.active_students_today || 0, icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" }
          ].map((s, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-card border border-border shadow-xl group hover:border-primary transition-all">
              <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-6`}>
                <s.icon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
              <h3 className="text-3xl font-black italic">{s.value}</h3>
            </div>
          ))}
        </div>

        <div className="glass-morphism rounded-[3rem] p-10 border border-border/50">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" /> Global Cohort
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="SEARCH NEURAL ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-full text-xs font-bold uppercase tracking-widest outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredStudents.map((student) => (
              <div 
                key={student.id}
                className="p-6 rounded-3xl bg-card border border-border flex items-center justify-between group hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => setLocation(`/profile?user_id=${student.id}`)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-black italic">
                    {student.name[0]}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-lg uppercase tracking-tight">{student.name}</h4>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">ID: {(student as any).public_id} • {student.total_points} PTS</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
