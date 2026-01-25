import { Link } from "wouter";
import { MapPin, Phone, Mail, Instagram, ArrowUpRight, Calculator, BookOpen, PenTool, Rocket, Layout, Zap, Trophy, BarChart3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-32 pb-12 overflow-hidden relative">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-4 mb-8">
              <img src="/imagesproject/logo.ico.jpg" className="w-12 h-12 rounded-2xl border border-white/10" alt="Talent Hub" />
              <div className="text-left">
                <h2 className="text-2xl font-black tracking-tighter uppercase italic">Talent Hub</h2>
                <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase">Neural Architecture</p>
              </div>
            </Link>
            <p className="text-xl text-slate-400 leading-relaxed mb-12 max-w-md">
              We engineer the next generation of mathematical prodigies through cognitive focus and structured mastery.
            </p>
            <div className="flex gap-4">
              <a href="tel:+919266117055" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all border border-white/10 group">
                <Phone className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://maps.google.com" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all border border-white/10 group">
                <MapPin className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all border border-white/10 group">
                <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all border border-white/10 group">
                <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8 italic">Curriculum</h3>
            <ul className="space-y-4">
              <li><Link href="/courses/abacus" className="text-slate-400 hover:text-white transition-colors font-bold flex items-center gap-2"><Calculator className="w-4 h-4" /> Study Abacus</Link></li>
              <li><Link href="/courses/vedic-maths" className="text-slate-400 hover:text-white transition-colors font-bold flex items-center gap-2"><BookOpen className="w-4 h-4" /> Vedic Maths</Link></li>
              <li><Link href="/courses/handwriting" className="text-slate-400 hover:text-white transition-colors font-bold flex items-center gap-2"><PenTool className="w-4 h-4" /> Handwriting</Link></li>
              <li><Link href="/courses/stem" className="text-slate-400 hover:text-white transition-colors font-bold flex items-center gap-2"><Rocket className="w-4 h-4" /> STEM</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8 italic">Workspace</h3>
            <ul className="space-y-4">
              <li><Link href="/create" className="text-slate-400 hover:text-white transition-colors font-bold flex items-center gap-2"><Layout className="w-4 h-4" /> Papers</Link></li>
              <li><Link href="/mental" className="text-slate-400 hover:text-white transition-colors font-bold flex items-center gap-2"><Zap className="w-4 h-4" /> Mental Math</Link></li>
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors font-bold flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Dashboard</Link></li>
              <li><Link href="/leaderboard" className="text-slate-400 hover:text-white transition-colors font-bold flex items-center gap-2"><Trophy className="w-4 h-4" /> Leaderboard</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-8 italic">Branches</h3>
            <div className="space-y-6">
              <div>
                <p className="text-white font-black text-sm uppercase">Rohini Sector - 16</p>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest italic">New Delhi</p>
              </div>
              <div>
                <p className="text-white font-black text-sm uppercase">Rohini Sector - 11</p>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest italic">New Delhi</p>
              </div>
              <div>
                <p className="text-white font-black text-sm uppercase">Gurgaon</p>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest italic">Haryana</p>
              </div>
              <a href="tel:+919266117055" className="inline-flex items-center gap-2 text-primary font-black text-lg hover:gap-4 transition-all uppercase italic mt-4">
                Connect Now <ArrowUpRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">© 2026 Talent Hub / The Neural Architecture Lab</p>
          <div className="flex gap-12">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">Since 2008</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">Built for Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
