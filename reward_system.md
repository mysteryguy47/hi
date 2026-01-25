Talent Hub — Unified Reward System (Existing + New)

The system must be:
Stable
Deterministic
Behaviour-driven
Non-exploitative
Mobile-first
Visually rich but academically respectful

1️⃣ CORE PHILOSOPHY (NON-NEGOTIABLE)

Rewards must celebrate effort, consistency, discipline, improvement, and culture — not just speed or marks.
No gambling mechanics
No random rewards
No pay-to-win
No negative points
No silent overrides
All rules must be backend-enforced, frontend only reflects.

2️⃣ STUDENT TYPES (VERY IMPORTANT)
Abacus Students:
Mental Math + Practice Papers
Streaks depend on Mental Math only

Vedic Maths Students:
Practice Papers only
Streaks depend on Practice Papers only

Rules automatically adapt based on enrolled course.

3️⃣ POINTS ENGINE (EFFORT CURRENCY)
Per Question (Mental Math OR Practice Paper)
Action	Points
Attempted question	+1
Correct answer	+10

Rules:
No negative points
No deductions
Skipped / empty answers = 0 points
Backend validates correctness
Points are currency, not identity.

4️⃣ DAILY STREAK ENGINE (CONSISTENCY)
Day Definition
12:00 AM → 11:59 PM (local IST timezone)
Daily Requirement
≥ 15 questions attempted in a day
Can be across multiple sessions
Attempted = answered (right or wrong)
Logic
If requirement met → Streak +1 🔥
If not met:
    ├─ Grace skip available this week? 
    │     ├─ Spend 2000 points → streak preserved ⚪
    │     └─ No → streak resets ❌

Constraints

Max 1 grace skip per week
Grace skip must be explicitly redeemed
Grace skip consumes points (value-based decision)

Bonuses
7 consecutive streak days → +50 bonus points
14 consecutive streak days → +100 bonus points
21 consecutive streak days → +200 bonus points
Full calendar month without break → +500 bonus points & Monthly Streak Badge

5️⃣ ATTENDANCE ENGINE (DISCIPLINE)

Students attend ~8 classes/month
Attendance comes from Attendance Management system (admin-marked)
Monthly Evaluation (End-of-Month Job)
If attendance = 100% for the month
→ Award Attendance Champion Badge

Visual Reward
⭐ Attendance Star shown on:
Student profile
Dashboard
Leaderboard (subtle)
Attendance never affects points directly.

6️⃣ T-SHIRT STAR ENGINE (CULTURE)

Admin marks “T-Shirt worn” per class
Each marked class → ⭐ +1 T-Shirt Star
Monthly Recognition
Condition	Reward
All classes	Gold T-Shirt Star Badge🌟🌟
INTEGRATE OPTION TO GIVE T-SHIRT STAR TO STUDENT ALONGSIDE ATTENDANCE IN ADMIN DASHBOARD

Purpose:
Encourage belonging
Reinforce offline participation
Celebrate institute culture

7️⃣ SKILL BADGES (QUALITY, NOT GRIND)

Badges unlocked by behaviour, not points.
Accuracy Badges
Accuracy Ace → ≥ 90%
Perfect Precision → 100% (min question threshold)

Speed Badge
Speed Spark → COMING SOON

Improvement Badge
Comeback Kid → ≥ 20% accuracy improvement from last month and in this month

ALL ABOVE BADGES ARE RESETTED MONTHLY AND GIVEN AT THE END OF THE MONTH AND GETS RESET NEXT MONTH (THERE RECORDS WILL REMAIN IN HISTORY BUT WILL NOT BE SHOWN AS CURRENT BADGES, WILL NOT BE DELETED)

TOTAL QUESTIONS ATTEMPTED (MENTAL MATH + PRACTICE PAPER) Badges
Questions Attempted	Badge
GREATER THAN OR EQUAL TO 500	🥉 Bronze Mind
GREATER THAN OR EQUAL TO 2000	🥈 Silver Mind
GREATER THAN OR EQUAL TO 5000	🥇 Gold Mind

ONLY THE ABOVE MENTAL MATH VOLUME BADGE IS A LIFETIME BADGE

8️⃣ SUPER JOURNEY (MEANINGFUL PROGRESSION)

SUPER letters unlock every 3000 points:

Letter	Meaning	Message
S	Started	“You’ve begun your journey.”
U	Understanding	“You’re understanding concepts.”
P	Practice	“Strong practice habits.”
E	Excellence	“Consistency reflects excellence.”
R	Ready	“Competition-ready mindset.”
Chocolates (Physical Rewards)

CHOCOLATES AT - 1500, 4500, 7500, 10500, 13500, 16500, 19500
BADGES AT - 3000(S), 6000(U), 9000(P), 12000(E), 15000(R)
MYSTERY GIFT AT 18000 POINTS AND A PARTY AT 21000 POINTS

9️⃣ DIGITAL ACCESSORIES (IDENTITY)
🎓 Hats (Auto-Unlocked, Cosmetic Only)
COMING SOON

10️⃣ LEADERBOARD BADGES
Monthly evaluation
Top 3 students get:
🥇 🥈 🥉 Leaderboard Badge
Awarded automatically
Reset monthly
Visible on profile & leaderboard

11️⃣ REWARD PAGE UI STRUCTURE (STRICT)
Section 1 — Your Progress
Points
Streak (calendar flame)
Attendance %
SUPER letter
Next unlock progress bar
Section 2 — What You’re Good At
Earned skill badges
Locked badges (grey + hint)
Section 3 — Rewards & Unlocks
Physical rewards (chocolates, T-shirt)
Digital rewards (badges, hats, stars)
Section 4 — How to Earn More
Practice mental math
Try practice papers
Attend classes regularly
Be consistent

Section 5 — Why Rewards Matter
Rewards encourage discipline, confidence, and regular practice — not comparison.
No clutter. No overload. Mobile-first.

12️⃣ ADMIN CONTROLS (SAFE & LIMITED)
Admin CAN:
View full reward breakdown per student
View unlock history
Mark attendance & T-shirt worn
Configure thresholds (points per question, streak min)
Revoke rewards

13️⃣ TECHNICAL REQUIREMENTS
All calculations backend-side
All unlocks deterministic
Idempotent reward evaluation
Monthly cron jobs for:
Attendance
Leaderboards
Monthly badges
Full audit logs

✅ TESTING & VERIFICATION CHECKLIST (NO BUGS EVER)
POINTS
 Attempted answer always gives +1
 Correct answer gives +10
 No negative points possible
 Refresh does not duplicate points

STREAKS
 <15 questions → no streak increment
 ≥15 questions → streak +1
 Grace skip works once/week only
 Grace skip deducts 2000 points
 Monthly streak badge only if no breaks

ATTENDANCE
 Attendance derived only from admin records
 100% attendance → badge awarded
 <100% → no badge
 Badge awarded only once/month

T-SHIRT STARS
 Only admin can mark
 Correct star count per month
 Gold star only if all classes marked

SKILL BADGES
 Accuracy thresholds respected
 Speed badge age-adjusted
 Comeback badge only on improvement
 Lifetime badges never revoked

SUPER & CHOCOLATES
 Chocolates at correct milestones
 SUPER letters unlock correctly
 Meaning text shown correctly

LEADERBOARD
 Monthly reset
 Only top 3 awarded
 Badges not duplicated

UX & SAFETY
 No crashes on refresh
 State persists during sessions
 Mobile layout verified
 Parent-friendly language
 Error fallback UI exists

🏁 FINAL STATEMENT
This reward system must feel motivational, fair, premium, and educational — never gimmicky, never addictive, never confusing.