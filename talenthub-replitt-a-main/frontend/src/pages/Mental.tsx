import { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Play, Flame, RotateCcw, Brain, Sparkles, Activity, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function Mental() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [operation, setOperation] = useState<string>("add_sub");
  const [difficulty, setDifficulty] = useState<'Basic' | 'Medium' | 'Advanced'>('Basic');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState<{q: string, a: number} | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startNewGame = () => {
    setGameState('playing');
    setScore(0);
    setTimer(60);
    nextQuestion();
  };

  const nextQuestion = () => {
    let num1, num2;
    if (difficulty === 'Basic') {
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * 9) + 1;
    } else if (difficulty === 'Medium') {
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 90) + 10;
    } else {
      num1 = Math.floor(Math.random() * 900) + 100;
      num2 = Math.floor(Math.random() * 900) + 100;
    }
    
    let q = "", a = 0;
    if (operation === 'add_sub') {
      const isSub = Math.random() > 0.5 && num1 > num2;
      q = isSub ? `${num1} - ${num2}` : `${num1} + ${num2}`;
      a = isSub ? num1 - num2 : num1 + num2;
    } else if (operation === 'multiplication') {
      q = `${num1} × ${num2}`;
      a = num1 * num2;
    }
    
    setCurrentQuestion({ q, a });
    setAnswer("");
    setFeedback(null);
  };

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer) === currentQuestion?.a) {
      setScore(s => s + 10);
      setFeedback('correct');
      setTimeout(nextQuestion, 300);
    } else {
      setFeedback('wrong');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setGameState('finished');
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary/20 flex flex-col pt-20">
      <nav className="p-6 flex items-center justify-between border-b border-white/5">
        <Link href="/">
          <button className="p-3 hover:bg-white/5 rounded-2xl transition-all group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold uppercase tracking-widest">Streak: 12</span>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-widest">{score} PTS</span>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        <AnimatePresence mode="wait">
          {gameState === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="relative z-10 w-full max-w-4xl"
            >
              <div className="text-center mb-16">
                <div className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Brain className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic">Mental Math</h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">Push your cognitive boundaries. Calibrate your neural engine for maximum velocity.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic">Configuration</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Operation</p>
                      <div className="grid grid-cols-2 gap-3">
                        {['add_sub', 'multiplication'].map(op => (
                          <button
                            key={op}
                            onClick={() => setOperation(op)}
                            className={`p-4 rounded-2xl border transition-all font-bold uppercase text-[10px] tracking-widest ${
                              operation === op ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 hover:border-primary/50'
                            }`}
                          >
                            {op.replace('_', ' & ')}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Difficulty</p>
                      <div className="grid grid-cols-3 gap-3">
                        {['Basic', 'Medium', 'Advanced'].map(d => (
                          <button
                            key={d}
                            onClick={() => setDifficulty(d as any)}
                            className={`p-4 rounded-2xl border transition-all font-bold uppercase text-[10px] tracking-widest ${
                              difficulty === d ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 hover:border-primary/50'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Activity className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold uppercase tracking-tight">System Ready</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Optimized for {difficulty} {operation}</p>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-xs text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 60 Second Session</li>
                      <li className="flex items-center gap-3 text-xs text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time Analytics</li>
                      <li className="flex items-center gap-3 text-xs text-slate-400"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Global Ranking Impact</li>
                    </ul>
                  </div>
                  <button 
                    onClick={startNewGame}
                    className="w-full mt-10 py-6 bg-primary text-primary-foreground rounded-full font-black text-xl hover:scale-[1.02] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 uppercase italic"
                  >
                    Engage <Play className="w-6 h-6 fill-current" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 w-full max-w-3xl"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time Remaining</span>
                  <div className={`text-4xl font-black tabular-nums ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {timer}s
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Score</span>
                  <div className="text-4xl font-black text-primary uppercase">{score}</div>
                </div>
              </div>

              <div className="glass-morphism rounded-[4rem] p-24 text-center border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 60, ease: "linear" }}
                    className="h-full bg-primary"
                  />
                </div>

                <motion.h2 
                  key={currentQuestion?.q}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-8xl md:text-9xl font-black tracking-tighter mb-16 italic"
                >
                  {currentQuestion?.q}
                </motion.h2>

                <form onSubmit={checkAnswer} className="relative max-w-xs mx-auto">
                  <input 
                    autoFocus
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className={`w-full bg-transparent border-b-4 ${
                      feedback === 'correct' ? 'border-emerald-500 text-emerald-500' : 
                      feedback === 'wrong' ? 'border-red-500 text-red-500' : 'border-white/20'
                    } text-center text-6xl font-black p-4 focus:outline-none transition-all duration-300`}
                    placeholder="?"
                  />
                </form>
              </div>
            </motion.div>
          )}

          {gameState === 'finished' && (
            <motion.div 
              key="finished"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 text-center glass-morphism p-16 rounded-[4rem] border border-white/10 shadow-2xl"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-5xl font-black mb-2 uppercase tracking-tight italic">Session Complete</h2>
              <p className="text-slate-400 mb-12">Exceptional focus demonstrated today.</p>
              
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Score Achieved</span>
                  <div className="text-6xl font-black text-primary mt-2">{score}</div>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Accuracy</span>
                  <div className="text-6xl font-black text-white mt-2">100%</div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={startNewGame}
                  className="w-full py-5 bg-primary text-primary-foreground rounded-full font-black text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 uppercase italic"
                >
                  RE-ENGAGE SYSTEM <RotateCcw className="w-5 h-5" />
                </button>
                <Link href="/">
                  <button className="w-full py-5 bg-white/5 text-white rounded-full font-bold hover:bg-white/10 transition-all border border-white/10 uppercase tracking-widest text-xs">
                    Exit to Terminal
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
