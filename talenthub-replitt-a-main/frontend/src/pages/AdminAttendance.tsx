import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getStudentsForAttendance, markBulkAttendance, getClassSessions,
  createClassSession, ClassSession,
} from "../lib/attendanceApi";
import { Users, Layout } from "lucide-react";
import { motion } from "framer-motion";
import AttendanceCalendar from "../components/AttendanceCalendar";

export default function AdminAttendance() {
  const { isAdmin } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [calendarSessions, setCalendarSessions] = useState<ClassSession[]>([]);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getStudentsForAttendance(selectedBranch || undefined);
        setStudents(data);
      } catch (err) { console.error(err); }
    };
    const loadCalendarSessions = async () => {
      try {
        const data = await getClassSessions({ branch: selectedBranch || undefined });
        setCalendarSessions(data);
      } catch (err) { console.error(err); }
    };
    loadStudents();
    loadCalendarSessions();
  }, [selectedBranch]);

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendanceData({ ...attendanceData, [studentId]: status });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const session = await createClassSession({
        session_date: new Date(sessionDate).toISOString(),
        branch: selectedBranch || "All Branches",
        course: "General", level: "All", batch_name: null, topic: null, teacher_remarks: null,
      });
      const attendance_data = students.map(s => ({
        session_id: session.id, student_profile_id: s.id, status: attendanceData[s.id] || "present",
      }));
      await markBulkAttendance({ session_id: session.id, attendance_data });
      alert("Neural sync complete.");
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  if (!isAdmin && false) return <div className="p-20 text-center">Neural Access Denied.</div>;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">Presence Sync</h1>
            <p className="text-muted-foreground text-lg font-medium">Calibrate neural attendance for your branch.</p>
          </div>
          <div className="flex gap-4">
            <select 
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-6 py-3 bg-card border border-border rounded-full font-bold text-xs uppercase tracking-widest outline-none focus:border-primary"
            >
              <option value="">All Branches</option>
              {["Rohini-16", "Rohini-11", "Gurgaon", "Online"].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <input 
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="px-6 py-3 bg-card border border-border rounded-full font-bold text-xs uppercase tracking-widest outline-none focus:border-primary"
            />
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-morphism rounded-[3rem] p-8 border border-border/50 text-foreground">
              <AttendanceCalendar 
                sessions={calendarSessions}
                attendanceRecords={[]}
                onDateClick={(d) => setSessionDate(d.toISOString().split('T')[0])}
                selectedDate={new Date(sessionDate)}
                isStudentView={false}
              />
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="glass-morphism rounded-[3rem] p-10 border border-border/50">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" /> Active Cohort
                </h2>
                <button 
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-8 py-3 bg-primary text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  {saving ? "Syncing..." : "Mark Attendance"}
                </button>
              </div>

              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="p-6 rounded-3xl bg-card border border-border flex items-center justify-between group hover:border-primary/50 transition-all">
                    <div>
                      <h4 className="font-bold text-lg uppercase tracking-tight">{student.display_name || student.name}</h4>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">ID: {student.public_id} • {student.level}</p>
                    </div>
                    <div className="flex gap-2">
                      {['present', 'absent', 'on_break'].map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(student.id, s)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            (attendanceData[student.id] || 'present') === s 
                              ? "bg-primary text-white shadow-lg" 
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
