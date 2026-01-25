TALENT HUB FRONTEND DESIGN SYSTEM GUIDE
📋 OVERVIEW
This document provides a complete specification for recreating the Talent Hub frontend design system. Every visual element, spacing, color, typography, and interaction pattern is documented with precise measurements and implementation details.
🎨 COLOR SYSTEM
Primary Color Palette/* CSS Custom Properties (HSL Values) */--background: 0 0% 100%           /* Pure White */--foreground: 224 71.4% 4.1%      /* Dark Slate */--card: 0 0% 100%                  /* White */--card-foreground: 224 71.4% 4.1% /* Dark Slate */--primary: 263.4 70% 50.4%        /* Purple: hsl(263, 70%, 50%) */--primary-foreground: 210 20% 98% /* Near White */--secondary: 220 14.3% 95.9%      /* Light Gray */--secondary-foreground: 220.9 39.3% 11% /* Dark Gray */--muted: 220 14.3% 95.9%          /* Light Gray */--muted-foreground: 220 8.9% 46.1% /* Medium Gray */--accent: 262.2 83.3% 94.6%       /* Light Purple */--accent-foreground: 262.2 43.3% 13.7% /* Dark Purple */--destructive: 0 84.2% 60.2%      /* Red */--destructive-foreground: 210 20% 98% /* Near White */--border: 220 13% 91%             /* Very Light Gray */--input: 220 13% 91%              /* Very Light Gray */--ring: 263.4 70% 50.4%           /* Purple */--radius: 0.75rem                  /* 12px border radius */DARK MODE COLORS--background: 224 71.4% 4.1%      /* Dark Slate */--foreground: 210 20% 98%         /* Near White */--card: 224 71.4% 4.1%            /* Dark Slate */--card-foreground: 210 20% 98%    /* Near White */--primary: 263.4 70% 50.4%        /* Purple (same) */--primary-foreground: 210 20% 98% /* Near White */--secondary: 215 27.9% 16.9%      /* Dark Gray */--secondary-foreground: 210 20% 98% /* Near White */--muted: 215 27.9% 16.9%          /* Dark Gray */--muted-foreground: 217.9 10.6% 64.9% /* Light Gray */--accent: 215 27.9% 16.9%         /* Dark Gray */--accent-foreground: 210 20% 98%  /* Near White */--destructive: 0 62.8% 30.6%      /* Dark Red */--destructive-foreground: 210 20% 98% /* Near White */--border: 215 27.9% 16.9%         /* Dark Gray */--input: 215 27.9% 16.9%          /* Dark Gray */--ring: 263.4 70% 50.4%           /* Purple */Gradient Definitions
/* Premium Gradient (Primary) */.premium-gradient {  background: linear-gradient(135deg,     hsl(263, 70%, 50%) 0%,    /* Purple */    hsl(280, 70%, 50%) 50%,   /* Purple-Pink */    hsl(300, 70%, 50%) 100%   /* Pink */  );}/* Text Gradient */.text-gradient {  background: linear-gradient(90deg,     hsl(263, 70%, 50%) 0%,    /* Purple */    hsl(280, 70%, 50%) 50%,   /* Purple-Pink */    hsl(300, 70%, 50%) 100%   /* Pink */  );  -webkit-background-clip: text;  background-clip: text;  -webkit-text-fill-color: transparent;}




📝 TYPOGRAPHY SYSTEM
Font Family
Primary Font: System font stack (Inter, system-ui, sans-serif)
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
Font Sizes & Weights
/* Display Text */text-7xl: 4.5rem (72px) - font-extrabold (800)text-6xl: 3.75rem (60px) - font-extrabold (800)  text-5xl: 3rem (48px) - font-black (900)text-4xl: 2.25rem (36px) - font-bold (700)text-3xl: 1.875rem (30px) - font-black (900)
/* Body Text */text-xl: 1.25rem (20px) - font-medium (500)text-lg: 1.125rem (18px) - font-medium (500)text-base: 1rem (16px) - defaulttext-sm: 0.875rem (14px) - font-bold (700)text-xs: 0.75rem (12px) - font-bold (700) / font-black (900)
/* Micro Text */text-[10px]: 0.625rem (10px) - font-bold (700)Typography Classes
/* Headers */.font-black: 900 weight, uppercase, tracking-tighter, italic.font-extrabold: 800 weight.font-bold: 700 weight.font-medium: 500 weight
/* Tracking */.tracking-tighter: -0.025em.tracking-widest: 0.25em.tracking-[0.2em]: 0.2em
/* Special Text */.uppercase: All caps.italic: Italic style.leading-none: 1 line height.antialiased: Font smoothing




SPACING SYSTEM
Container & Layout


/* Page Container */.container: max-width 1400px, centered, padding 2rem
/* Page Padding */pt-32: 8rem (128px) top padding (for fixed header)pb-20: 5rem (80px) bottom paddingpx-6: 1.5rem (24px) horizontal padding
/* Section Spacing */mb-12: 3rem (48px) bottom marginmb-8: 2rem (80px) bottom marginmb-6: 1.5rem (24px) bottom marginmb-4: 1rem (16px) bottom marginmb-2: 0.5rem (8px) bottom margin
/* Grid Gaps */gap-12: 3rem (48px)gap-8: 2rem (32px)gap-6: 1.5rem (24px)gap-4: 1rem (16px)gap-3: 0.75rem (12px)gap-2: 0.5rem (8px)




Component Spacing
1. Cards
/* Standard Card */className="bg-card border border-border rounded-[2.5rem] shadow-xl p-8"
/* Glass Morphism Card */className="glass-morphism rounded-[3rem] p-10 border border-border/50"
/* Hover Card */className="bg-card border border-border hover:border-primary transition-all group shadow-xl p-8"


2. Buttons
Primary Button (Large)
className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-black text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"Secondary Button
className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all bg-background text-primary shadow-sm"
Ghost Button
className="p-3 rounded-2xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
Destructive Button

className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-lg transition-colors"

3. Form Elements
Input Field
className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
Select Dropdown
className="bg-transparent font-black uppercase tracking-widest text-xs focus:outline-none border-b border-transparent focus:border-primary cursor-pointer"
Checkbox/Radio
className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/20"
4. Navigation
Header

className={fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${  scrolled     ? "py-4 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"     : "py-6 bg-transparent"}}

Navigation Pills





className="hidden lg:flex items-center gap-2 bg-secondary/50 backdrop-blur-md p-1.5 rounded-full border border-border/50"
Dropdown Menu

className="absolute right-0 mt-3 w-64 bg-background/95 backdrop-blur-xl border border-border rounded-[2rem] shadow-2xl p-4"
5. Stats Cards

className="p-8 rounded-[2.5rem] bg-card border border-border hover:border-primary transition-all group shadow-xl"

Icon Container:
className={w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110}
Label:
className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1"
Value:
className="text-3xl font-black italic"

🎭 ANIMATIONS & TRANSITIONS
Framer Motion Presets

/* Page Enter Animation */initial={{ opacity: 0, y: 20 }}animate={{ opacity: 1, y: 0 }}transition={{ delay: i * 0.1 }}
/* Card Hover */hover:border-primary transition-all group shadow-xl
/* Button Hover */hover:scale-105 transition-all
/* Icon Hover */group-hover:scale-110 transition-transform
Custom CSS Animations

@keyframes float {  0% { transform: translateY(0px); }  50% { transform: translateY(-10px); }  100% { transform: translateY(0px); }}
.animate-float {  animation: float 6s ease-in-out infinite;}
.animate-float-delayed {  animation: float 6s ease-in-out infinite;  animation-delay: 2s;}

Transition Classes

/* Standard Transitions */transition-all duration-300transition-colors duration-300transition-transform duration-300
/* Page Transitions */.page-transition-enter { opacity: 0; transform: translateY(10px); }.page-transition-enter-active { opacity: 1; transform: translateY(0); transition: opacity 400ms, transform 400ms; }
📱 RESPONSIVE DESIGN
Breakpoint System

/* Mobile First */sm: 640pxmd: 768px  lg: 1024pxxl: 1280px2xl: 1400px
Grid Layouts

/* Stats Grid */grid-cols-1 md:grid-cols-2 lg:grid-cols-4
/* Content Layout */grid lg:grid-cols-12 gap-12
/* Sidebar Layout */lg:col-span-8 (main content)lg:col-span-4 (sidebar)
Responsive Navigation

/* Desktop Nav */hidden lg:flex
/* Mobile Menu */lg:hidden
🎯 ICON SYSTEM
Icon Library
Primary: Lucide React
Size Classes:
w-4 h-4 (16px) - Small
w-5 h-5 (20px) - Medium
w-6 h-6 (24px) - Large
w-8 h-8 (32px) - Extra Large
w-10 h-10 (40px) - Header
w-12 h-12 (48px) - Hero
Icon Usage Patterns


/* Button Icons */
<Plus className="w-5 h-5" />
/* Card Icons */
<Star className="w-6 h-6" />
/* Navigation Icons */
<Calculator className="w-4 h-4" />
/* Header Icons */
<Shield className="w-10 h-10" />
🔄 LOADING & ERROR STATES
Loading Spinner

<div className="relative">
  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-pulse" />
</div>
Skeleton Loading
<div className="animate-pulse">
  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-muted rounded w-1/2"></div>
</div>


Error States

<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
  <div className="text-center">
    <div className="text-2xl font-bold text-red-600 mb-4">Error Title</div>
    <div className="text-slate-600 mb-4">Error message</div>
  </div>
</div>
🌙 DARK MODE IMPLEMENTATION
Theme Toggle
const [theme, setTheme] = useState("light");
const toggleTheme = () => {  const newTheme = theme === "light" ? "dark" : "light";  setTheme(newTheme);  document.documentElement.classList.toggle("dark", newTheme === "dark");};Theme Button
<button  onClick={toggleTheme}  className="p-3 rounded-2xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
{theme === "dark" ?  : }  
📋 PAGE LAYOUT PATTERNS
Standard Page Structure
<div className="min-h-screen bg-background pt-32 pb-20 px-6">
  <div className="container mx-auto">
    {/* Page Header */}
    <header className="mb-12">
      <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
        Page Title
      </h1>
      <p className="text-muted-foreground text-lg font-medium">
        Page description
      </p>
    </header>
    {/* Content Grid */}
    <div className="grid lg:grid-cols-12 gap-12">
      {/* Main Content */}
      <div className="lg:col-span-8">
        {/* Content */}
      </div>
      
      {/* Sidebar */}
      <div className="lg:col-span-4">
        {/* Sidebar content */}
      </div>
    </div>
  </div>
</div>
Dashboard Layout
{/* Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
  {/* Stat Cards */}
</div>
{/* Content Sections */}
<div className="grid lg:grid-cols-12 gap-12">
  <div className="lg:col-span-8 space-y-12">
    {/* Main sections */}
  </div>
</div>

🎨 VISUAL HIERARCHY
Color Usage Priority
Primary: Call-to-action buttons, active states, primary links
Foreground: Main text, headings
Muted Foreground: Secondary text, descriptions
Border: Dividers, input borders, subtle outlines
Secondary: Backgrounds, inactive states
Accent: Highlights, badges, special states
Size Hierarchy
7xl (72px): Hero titles
5xl (48px): Page headers
3xl (30px): Section headers, large numbers
xl (20px): Body text, descriptions
base (16px): Default text
sm (14px): Small labels, buttons
xs (12px): Micro text, metadata
Spacing Scale
1 (4px): Minimal gaps
2 (8px): Tight spacing
3 (12px): Component spacing
4 (16px): Element spacing
6 (24px): Section spacing
8 (32px): Large spacing
12 (48px): Major sections
🛠️ IMPLEMENTATION CHECKLIST
Setup Requirements
 Tailwind CSS configured with custom theme
 CSS custom properties defined
 Dark mode class strategy
 Framer Motion installed
 Lucide React icons
 Wouter for routing
Component Library
 Button variants (primary, secondary, ghost, destructive)
 Card components (standard, glass, hover)
 Form elements (inputs, selects, checkboxes)
 Navigation components (header, dropdown, pills)
 Loading states (spinner, skeleton)
 Error boundaries
Page Templates
 Authentication layout
 Dashboard layout
 Form layouts
 Admin layouts
 Marketing pages
This design system provides everything needed to recreate the Talent Hub frontend exactly as specified, with precise measurements, colors, spacing, and interaction patterns.