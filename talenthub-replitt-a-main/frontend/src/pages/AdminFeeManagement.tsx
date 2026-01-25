import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { DollarSign, CreditCard, FileText, Wallet, Receipt, TrendingUp } from "lucide-react";
import { getFeeDashboardStats } from "../lib/feeApi";
import { motion } from "framer-motion";

export default function AdminFeeManagement() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (isAdmin) {
      const loadStats = async () => {
        try {
          const data = await getFeeDashboardStats();
          setStats(data);
        } catch (err) { console.error(err); }
      };
      loadStats();
    }
  }, [isAdmin]);

  if (!isAdmin) return <div className="p-20 text-center">Financial Access Denied.</div>;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <header className="mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">Financial Grid</h1>
            <p className="text-muted-foreground text-lg font-medium">Neural revenue tracking and fee architecture.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Total Revenue", value: `₹${stats?.total_revenue || 0}`, icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Pending Dues", value: `₹${stats?.total_overdue || 0}`, icon: Receipt, color: "text-red-500", bg: "bg-red-500/10" },
            { label: "Neural Plans", value: stats?.total_plans || 0, icon: FileText, color: "text-primary", bg: "bg-primary/10" }
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

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="glass-morphism rounded-[3rem] p-10 border border-border/50 min-h-[500px]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" /> Transaction Flow
                </h2>
                <div className="flex gap-2">
                  {["dashboard", "students", "plans"].map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                        activeTab === t ? "bg-primary text-white shadow-lg" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest italic">Grid Data Loading...</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-primary text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <DollarSign className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-black italic uppercase mb-4 relative z-10">Quick Sync</h3>
              <p className="text-sm text-white/70 mb-8 relative z-10 leading-relaxed">Record manual neural payments directly into the central grid.</p>
              <button className="w-full py-4 bg-white text-primary rounded-full font-black uppercase text-xs tracking-[0.2em] relative z-10 hover:scale-105 transition-all shadow-xl">Record Payment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
