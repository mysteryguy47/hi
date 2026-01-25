import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, Plus, Trash2, Eye, EyeOff, FileDown, 
  Settings2, Sparkles, Layout, Database, 
  ChevronRight, Calculator, GraduationCap,
  History, Bookmark, Share2, Printer, Copy, ArrowUp, ArrowDown, Eraser
} from "lucide-react";
import { previewPaper, PaperConfig, BlockConfig, GeneratedBlock } from "@/lib/api";
import MathQuestion from "@/components/MathQuestion";
import { motion, AnimatePresence } from "framer-motion";

export default function PaperCreate() {
  const [location, setLocation] = useLocation();
  const [step, setStep] = useState(0); // 0: Selection, 1: Builder, 2: Preview
  const [title, setTitle] = useState("Daily Excellence Practice");
  const [mainLevel, setMainLevel] = useState<string>("");
  const [level, setLevel] = useState<PaperConfig["level"]>("Custom");
  const [blocks, setBlocks] = useState<BlockConfig[]>([]);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const mainLevels = ["Junior", "Basic", "Advanced"];
  const subLevels: Record<string, string[]> = {
    "Junior": ["Junior-1", "Junior-2", "Junior-3"],
    "Basic": ["Basic-1", "Basic-2", "Basic-3", "Basic-4"],
    "Advanced": ["AB-1", "AB-2", "AB-3", "AB-4", "AB-5", "AB-6", "AB-7", "AB-8", "AB-9", "AB-10"],
  };

  const operations = [
    { id: "addition", name: "Addition & Subtraction" },
    { id: "multiplication", name: "Multiplication" },
    { id: "division", name: "Division" },
    { id: "percentage", name: "Percentage" },
    { id: "square_root", name: "Square Root" },
    { id: "cube_root", name: "Cube Root" }
  ];

  const addBlock = (type: string = "addition") => {
    const newBlock: BlockConfig = {
      id: `block-${Date.now()}`,
      type: type as any,
      count: 10,
      constraints: { digits: 2, rows: 2 },
      title: ""
    };
    setBlocks([...blocks, newBlock]);
  };

  const duplicateBlock = (idx: number) => {
    const block = blocks[idx];
    const newBlock = { ...block, id: `block-${Date.now()}` };
    const newBlocks = [...blocks];
    newBlocks.splice(idx + 1, 0, newBlock);
    setBlocks(newBlocks);
  };

  const moveBlock = (idx: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === blocks.length - 1)) return;
    const newBlocks = [...blocks];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newBlocks[idx], newBlocks[targetIdx]] = [newBlocks[targetIdx], newBlocks[idx]];
    setBlocks(newBlocks);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const clearAllBlocks = () => {
    if (confirm("Are you sure you want to clear all blocks?")) {
      setBlocks([]);
    }
  };

  const handlePreview = async () => {
    setIsLoading(true);
    try {
      const config: PaperConfig = {
        title,
        level,
        blocks,
        totalQuestions: blocks.reduce((acc, b) => acc + b.count, 0).toString(),
        orientation: "portrait"
      };
      const data = await previewPaper(config);
      setPreviewData(data);
      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 glass-morphism border-b border-border/50 px-6 py-4 mt-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div className="h-6 w-[1px] bg-border" />
            <div>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent font-bold text-lg focus:outline-none border-b border-transparent focus:border-primary transition-colors"
                placeholder="Paper Title"
              />
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">Workspace / {level}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={clearAllBlocks}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Eraser className="w-4 h-4" /> Clear All
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold hover:bg-secondary rounded-lg transition-colors">
              <Bookmark className="w-4 h-4" /> Save Draft
            </button>
            <button 
              onClick={handlePreview}
              disabled={blocks.length === 0 || isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? "Generating..." : "Generate & Preview"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto text-center space-y-12 py-20"
            >
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">Choose Your Path</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {mainLevels.map((ml) => (
                  <button
                    key={ml}
                    onClick={() => {
                      setMainLevel(ml);
                      setStep(1);
                    }}
                    className="group relative p-12 rounded-[3rem] bg-card border border-border hover:border-primary transition-all duration-500 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]" />
                    <h3 className="text-2xl font-black italic uppercase relative z-10">{ml}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-4 relative z-10">Select Track</p>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : step === 1 ? (
            <motion.div 
              key="builder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col lg:flex-row gap-12"
            >
              {/* Controls Panel */}
              <aside className="w-full lg:w-80 space-y-8">
                <section className="space-y-4">
                  <button 
                    onClick={() => setStep(0)}
                    className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest hover:underline"
                  >
                    <ArrowLeft className="w-3 h-3" /> Change Level Track
                  </button>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Sub Levels</label>
                  <div className="grid grid-cols-1 gap-2">
                    {subLevels[mainLevel]?.map((l) => (
                      <button
                        key={l}
                        onClick={() => setLevel(l as any)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          level === l 
                            ? "bg-primary/5 border-primary text-primary shadow-inner" 
                            : "bg-card border-border hover:border-primary/30"
                        }`}
                      >
                        <span className="font-semibold text-sm">{l}</span>
                        {level === l && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </section>
              </aside>

              {/* Builder Canvas */}
              <section className="flex-grow min-h-[70vh] glass-morphism rounded-[2.5rem] p-10 border border-border/50 relative overflow-hidden">
                <div className="relative z-10 max-w-3xl mx-auto">
                  {blocks.length === 0 ? (
                    <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center text-muted-foreground">
                        <Layout className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold">Build Your Excellence</h3>
                      <button 
                        onClick={() => addBlock()}
                        className="flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-bold hover:scale-105 transition-all"
                      >
                        <Plus className="w-5 h-5" /> Add First Block
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <AnimatePresence>
                        {blocks.map((block, idx) => (
                          <motion.div
                            key={block.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group relative bg-card p-6 rounded-3xl border border-border hover:border-primary/50 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">
                                  {idx + 1}
                                </div>
                                <select 
                                  value={block.type}
                                  onChange={(e) => {
                                    const newBlocks = [...blocks];
                                    newBlocks[idx].type = e.target.value as any;
                                    setBlocks(newBlocks);
                                  }}
                                  className="bg-transparent font-black uppercase tracking-widest text-xs focus:outline-none border-b border-transparent focus:border-primary cursor-pointer"
                                >
                                  {operations.map(op => (
                                    <option key={op.id} value={op.id}>{op.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => moveBlock(idx, 'up')} className="p-2 hover:bg-secondary rounded-lg"><ArrowUp className="w-4 h-4" /></button>
                                <button onClick={() => moveBlock(idx, 'down')} className="p-2 hover:bg-secondary rounded-lg"><ArrowDown className="w-4 h-4" /></button>
                                <button onClick={() => duplicateBlock(idx)} className="p-2 hover:bg-secondary rounded-lg"><Copy className="w-4 h-4" /></button>
                                <button onClick={() => removeBlock(block.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Quantity</label>
                                <input 
                                  type="number"
                                  value={block.count}
                                  onChange={(e) => {
                                    const newBlocks = [...blocks];
                                    newBlocks[idx].count = parseInt(e.target.value);
                                    setBlocks(newBlocks);
                                  }}
                                  className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 font-semibold text-sm focus:ring-1 focus:ring-primary outline-none"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Digits</label>
                                <input 
                                  type="number"
                                  value={block.constraints.digits}
                                  onChange={(e) => {
                                    const newBlocks = [...blocks];
                                    newBlocks[idx].constraints.digits = parseInt(e.target.value);
                                    setBlocks(newBlocks);
                                  }}
                                  className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 font-semibold text-sm focus:ring-1 focus:ring-primary outline-none"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Rows</label>
                                <input 
                                  type="number"
                                  value={block.constraints.rows}
                                  onChange={(e) => {
                                    const newBlocks = [...blocks];
                                    newBlocks[idx].constraints.rows = parseInt(e.target.value);
                                    setBlocks(newBlocks);
                                  }}
                                  className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 font-semibold text-sm focus:ring-1 focus:ring-primary outline-none"
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <button 
                        onClick={() => addBlock()}
                        className="w-full py-6 border-2 border-dashed border-border rounded-3xl text-muted-foreground font-bold hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 group"
                      >
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        Add Question Block
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="container mx-auto px-6 py-12 min-h-screen flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <button 
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 font-bold hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" /> Return to Builder
                </button>
                <div className="flex gap-3">
                  <button className="px-8 py-3 bg-foreground text-background rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-black/10">
                    <Printer className="w-5 h-5" /> Print Excellence
                  </button>
                </div>
              </div>

              <div className="flex-grow flex flex-col items-center">
                <div className="w-full max-w-4xl bg-card rounded-[3rem] p-16 shadow-2xl border border-border/50">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">{title}</h2>
                    <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
                  </div>

                  {previewData?.blocks.map((block: any, idx: number) => (
                    <div key={idx} className="mb-12">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8 border-b border-border pb-2 inline-block">Section {idx + 1}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {block.questions.map((q: any) => (
                          <div key={q.id} className="text-center font-mono text-lg py-4 px-2 bg-secondary/30 rounded-2xl border border-border/20">
                            <MathQuestion question={q} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
