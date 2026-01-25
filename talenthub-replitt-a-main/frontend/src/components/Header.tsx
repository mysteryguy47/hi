import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  ChevronDown, LogOut, BarChart3, Shield, GraduationCap, 
  Calculator, BookOpen, PenTool, Rocket, Menu, X, Brain, 
  FileText, Sparkles, Trophy, User, Calendar, Moon, Sun, 
  ArrowRight, DollarSign, Layout, Zap, Settings, CreditCard, ClipboardCheck
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Courses", path: "/courses/abacus", icon: GraduationCap },
    { name: "Papers", path: "/create", icon: Layout },
    { name: "Mental Math", path: "/mental", icon: Zap },
  ];

  const profileLinks = [
    { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Attendance", path: "/attendance", icon: ClipboardCheck },
    { name: "Fees", path: "/fees", icon: CreditCard },
  ];

  if (isAdmin) {
    profileLinks.unshift({ name: "Admin Panel", path: "/admin", icon: Shield });
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? "py-4 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg" 
          : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src="/imagesproject/logo.ico.jpg" 
                alt="Talent Hub" 
                className="w-10 h-10 rounded-xl object-cover relative z-10 border border-border group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="hidden sm:block text-left">
              <h1 className="text-lg font-black tracking-tighter uppercase leading-none">Talent Hub</h1>
              <p className="text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase mt-1">Excellence Lab</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2 bg-secondary/50 backdrop-blur-md p-1.5 rounded-full border border-border/50">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <button className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                  location.startsWith(link.path) 
                    ? "bg-background text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}>
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </button>
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 pl-3 pr-5 py-2 bg-secondary/50 hover:bg-secondary rounded-full border border-border transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary ring-2 ring-primary/10">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold group-hover:text-primary transition-colors">Portal</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-background/95 backdrop-blur-xl border border-border rounded-[2rem] shadow-2xl p-4 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border/50 mb-2">
                        <p className="text-sm font-black uppercase tracking-tight truncate">{user?.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <div className="space-y-1">
                        {profileLinks.map((link) => (
                          <Link key={link.path} href={link.path} onClick={() => setProfileDropdownOpen(false)}>
                            <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group cursor-pointer">
                              <link.icon className="w-4 h-4" />
                              <span className="text-sm font-bold">{link.name}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 mt-2 rounded-2xl hover:bg-destructive/10 hover:text-destructive transition-all text-muted-foreground"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-bold">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-black text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20">
                  Sign In
                </button>
              </Link>
            )}

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-2xl bg-secondary/50 text-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 p-6 bg-background/95 backdrop-blur-2xl border-b border-border shadow-2xl lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path} onClick={() => setMobileMenuOpen(false)}>
                  <div className="p-4 rounded-3xl bg-secondary hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <link.icon className="w-6 h-6" />
                      <span className="text-lg font-bold uppercase tracking-tight">{link.name}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
