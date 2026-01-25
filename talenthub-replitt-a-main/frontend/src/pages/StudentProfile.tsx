import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import {
  getStudentProfile,
  getStudentProfileById,
  updateStudentProfile,
  updateStudentProfileById,
  StudentProfile as StudentProfileType,
  StudentProfileUpdate,
} from "../lib/userApi";
import { getAttendanceStats, AttendanceStats } from "../lib/attendanceApi";
import { User, Phone, Mail, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentProfile() {
  const { user, isAdmin } = useAuth();
  const [profile, setProfile] = useState<StudentProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfileUpdate>({});
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const viewUserId = urlParams.get("user_id");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = viewUserId && isAdmin
          ? await getStudentProfileById(parseInt(viewUserId))
          : await getStudentProfile();
        setProfile(data);
        setFormData({
          display_name: data.display_name || "",
          class_name: data.class_name || "",
          parent_contact_number: data.parent_contact_number || "",
        });
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [viewUserId, isAdmin]);

  useEffect(() => {
    if (profile) {
      const loadAttendanceStats = async () => {
        try {
          const stats = await getAttendanceStats(profile.id);
          setAttendanceStats(stats);
        } catch (err) {
          console.error(err);
        }
      };
      loadAttendanceStats();
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const updated = viewUserId && isAdmin
        ? await updateStudentProfileById(parseInt(viewUserId), formData)
        : await updateStudentProfile(formData);
      setProfile(updated);
      setEditing(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </Link>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-card border border-border rounded-[3rem] p-12 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <User className="w-64 h-64" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-5xl font-black italic shadow-2xl">
              {profile?.display_name?.[0] || user?.name?.[0]}
            </div>

            <div className="flex-grow space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter italic">{profile?.display_name}</h1>
                  <p className="text-muted-foreground font-bold tracking-widest text-xs uppercase mt-1">ID: {profile?.public_id}</p>
                </div>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="px-6 py-2 bg-secondary rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="px-6 py-2 text-muted-foreground font-bold text-xs uppercase tracking-widest">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-2 bg-primary text-white rounded-full font-bold text-xs uppercase tracking-widest">Save Changes</button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-border pb-2">Core Identity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm font-medium">
                      <Mail className="w-4 h-4 text-primary" /> {user?.email}
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium">
                      <Phone className="w-4 h-4 text-primary" /> {profile?.parent_contact_number || "Not set"}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground border-b border-border pb-2">Academic Sync</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/50 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Course</p>
                      <p className="font-bold text-sm">{profile?.course}</p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Level</p>
                      <p className="font-bold text-sm">{profile?.level}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-black italic text-primary">{attendanceStats?.attendance_percentage.toFixed(0)}%</div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Attendance</p>
                </div>
                <div className="text-center border-x border-border">
                  <div className="text-2xl font-black italic text-primary">{profile?.status?.toUpperCase()}</div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">System Status</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black italic text-primary">{profile?.branch}</div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Neural Branch</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
