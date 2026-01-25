import { useState } from "react";
import { X, Gift, Trophy, Sparkles, BookOpen, Award, PartyPopper, Crown, Star, Zap, Target } from "lucide-react";

interface RewardsExplanationProps {
  isOpen: boolean;
  onClose: () => void;
  currentPoints?: number;
}

export default function RewardsExplanation({ isOpen, onClose, currentPoints = 0 }: RewardsExplanationProps) {
  if (!isOpen) return null;

  const rewards = [
    { points: 1500, icon: "🍫", title: "Chocolate", description: "Your first sweet reward!", color: "from-amber-500 to-orange-500", unlocked: currentPoints >= 1500 },
    { points: 3000, icon: "S", title: "SUPER Badge - S", description: "First letter unlocked!", color: "from-blue-500 to-indigo-500", badge: true, unlocked: currentPoints >= 3000 },
    { points: 4500, icon: "🍫", title: "Chocolate", description: "Another delicious treat!", color: "from-amber-500 to-orange-500", unlocked: currentPoints >= 4500 },
    { points: 6000, icon: "U", title: "SUPER Badge - U", description: "Second letter unlocked!", color: "from-purple-500 to-pink-500", badge: true, unlocked: currentPoints >= 6000 },
    { points: 7500, icon: "🍫", title: "Chocolate", description: "Keep going, you're amazing!", color: "from-amber-500 to-orange-500", unlocked: currentPoints >= 7500 },
    { points: 9000, icon: "P", title: "SUPER Badge - P", description: "Third letter unlocked!", color: "from-green-500 to-emerald-500", badge: true, unlocked: currentPoints >= 9000 },
    { points: 12000, icon: "E", title: "SUPER Badge - E + Mystery Gift", description: "Fourth letter + Surprise! 🎁", color: "from-yellow-500 to-amber-500", badge: true, gift: true, unlocked: currentPoints >= 12000 },
    { points: 15000, icon: "R", title: "SUPER Badge - R + Party", description: "Complete SUPER + Celebration! 🎉", color: "from-red-500 to-pink-500", badge: true, party: true, unlocked: currentPoints >= 15000 },
  ];

  const nextReward = rewards.find(r => !r.unlocked) || rewards[rewards.length - 1];
  const progress = nextReward ? (currentPoints / nextReward.points) * 100 : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl border-2 border-indigo-200 dark:border-slate-700 overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/50 to-purple-700/50"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Rewards System</h2>
                <p className="text-sm text-white/90">Earn points and unlock amazing rewards!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">
          {/* How to Earn Points */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg dark:shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              How to Earn Points
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200 dark:border-blue-700 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Mental Math Practice</h4>
                  <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                    Practice mental math questions and earn <span className="font-bold text-blue-600 dark:text-blue-400">10 points per correct answer</span>!
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-700/60 px-3 py-1.5 rounded-lg inline-block">
                    💡 Points are awarded only for correct answers, just like practice papers!
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200 dark:border-purple-700 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Practice Papers</h4>
                  <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                    Attempt practice papers and earn <span className="font-bold text-purple-600 dark:text-purple-400">10 points per correct answer</span>!
                  </p>
                  <div className="text-xs text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-700/60 px-3 py-1.5 rounded-lg space-y-1">
                    <p>📊 Example: Score 39/50 = <span className="font-bold">390 points</span></p>
                    <p>📊 Example: Score 2/4 = <span className="font-bold">20 points</span></p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-700 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Daily Streak</h4>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">
                    Practice <span className="font-bold text-green-600 dark:text-green-400">10+ questions daily</span> in mental math to maintain your streak! 
                    Your streak increases by +1 each day you meet this goal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Progress */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-white/90 mb-1">Your Points</p>
                <p className="text-4xl font-bold">{currentPoints.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/90 mb-1">Next Reward</p>
                <p className="text-2xl font-bold">{nextReward?.points.toLocaleString() || "Maxed!"} pts</p>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 mb-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                {progress > 10 && (
                  <span className="text-xs font-bold text-white drop-shadow-lg">
                    {Math.round(progress)}%
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-white/80 text-center">
              {nextReward && currentPoints < nextReward.points 
                ? `${(nextReward.points - currentPoints).toLocaleString()} more points to unlock ${nextReward.title}!`
                : "🎉 You've unlocked all rewards! Amazing work!"}
            </p>
          </div>

          {/* Rewards List */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-500" />
              Unlock Amazing Rewards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl p-5 border-2 transition-all duration-300 ${
                    reward.unlocked
                      ? `bg-gradient-to-br ${reward.color} text-white shadow-xl scale-105`
                      : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 opacity-60"
                  }`}
                >
                  {reward.unlocked && (
                    <div className="absolute top-2 right-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold flex-shrink-0 ${
                      reward.unlocked ? "bg-white/20 backdrop-blur-sm" : "bg-slate-100 dark:bg-slate-800"
                    }`}>
                      {reward.badge ? (
                        <span className={`text-3xl font-black ${reward.unlocked ? "text-white" : "text-slate-400"}`}>
                          {reward.icon}
                        </span>
                      ) : (
                        <span className="text-3xl">{reward.icon}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-bold text-lg ${reward.unlocked ? "text-white" : "text-slate-700 dark:text-white"}`}>
                          {reward.title}
                        </h4>
                        {reward.gift && (
                          <Gift className={`w-4 h-4 ${reward.unlocked ? "text-yellow-300" : "text-slate-400"}`} />
                        )}
                        {reward.party && (
                          <PartyPopper className={`w-4 h-4 ${reward.unlocked ? "text-yellow-300" : "text-slate-400"}`} />
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${reward.unlocked ? "text-white/90" : "text-slate-600 dark:text-slate-300"}`}>
                        {reward.description}
                      </p>
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${
                        reward.unlocked 
                          ? "bg-white/20 backdrop-blur-sm text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}>
                        <Trophy className="w-3 h-3" />
                        {reward.points.toLocaleString()} points
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl border-2 border-slate-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Coming Soon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <h4 className="font-bold">Talent Hub Hats</h4>
                </div>
                <p className="text-sm text-white/80">
                  Exclusive virtual hats you can collect and show off! More points = cooler hats!
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-6 h-6 text-purple-400" />
                  <h4 className="font-bold">Title Badges</h4>
                </div>
                <p className="text-sm text-white/80">
                  Earn special titles like "Math Master" or "Speed Demon" with even higher point milestones!
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-indigo-200 dark:border-indigo-800 transition-all duration-300">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Quick Summary
            </h3>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                <span><strong>Mental Math:</strong> 10 points per question (right or wrong)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                <span><strong>Practice Papers:</strong> 10 points per correct answer (marks × 10)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                <span><strong>Daily Streak:</strong> Practice 10+ questions daily to maintain your streak</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold">•</span>
                <span><strong>Unlock Rewards:</strong> Earn chocolates, SUPER badges, mystery gifts, and a party!</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 transition-all duration-300">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Got it! Let's Earn Points! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
