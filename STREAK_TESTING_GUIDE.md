# Streak Testing Guide

## Overview
The streak system tracks daily practice in **mental math sessions only**. A streak increments only when a user practices **15 or more questions** in mental math practice sessions on consecutive days.

## Key Requirements

1. **Minimum Questions**: 15 questions per day (correct + wrong both count)
2. **Session Type**: Only mental math practice sessions count (NOT paper attempts)
3. **Consecutive Days**: Streak increments only on consecutive days
4. **Daily Reset**: Each day starts fresh - you need 15+ questions that day

## How Streak Works

### First Practice Session
- If you complete 15+ questions → Streak = 1
- If you complete < 15 questions → Streak = 0

### Same Day (Multiple Sessions)
- If total questions across all sessions today = 15+ → Streak maintained
- If total questions across all sessions today < 15 → Streak reset to 0

### Consecutive Days
- Yesterday: 15+ questions → Streak maintained/incremented
- Today: 15+ questions → Streak increments
- Gap of 1+ days → Streak resets

## Testing Scenarios

### Test 1: First Practice (15+ questions)
1. Create a new test user account
2. Complete a mental math session with 15+ questions
3. **Expected**: Streak = 1

### Test 2: First Practice (< 15 questions)
1. Create a new test user account
2. Complete a mental math session with 10 questions
3. **Expected**: Streak = 0

### Test 3: Same Day Multiple Sessions (Total 15+)
1. Complete session 1: 8 questions
2. Complete session 2: 7 questions
3. **Expected**: Total = 15, Streak = 1 (if first day) or maintained (if continuing streak)

### Test 4: Same Day Multiple Sessions (Total < 15)
1. Complete session 1: 8 questions
2. Complete session 2: 6 questions
3. **Expected**: Total = 14, Streak = 0

### Test 5: Consecutive Days (Both 15+)
1. Day 1: Complete 15+ questions → Streak = 1
2. Day 2: Complete 15+ questions → Streak = 2
3. **Expected**: Streak increments each day

### Test 6: Consecutive Days (Yesterday < 15, Today 15+)
1. Day 1: Complete 10 questions → Streak = 0
2. Day 2: Complete 15+ questions → Streak = 1 (new streak starts)
3. **Expected**: Streak starts fresh, doesn't continue from Day 1

### Test 7: Gap Day (Streak Broken)
1. Day 1: Complete 15+ questions → Streak = 1
2. Day 2: No practice
3. Day 3: Complete 15+ questions → Streak = 1 (new streak)
4. **Expected**: Streak resets, doesn't continue from Day 1

### Test 8: Paper Attempts Don't Count
1. Complete 20 questions in paper attempts
2. Complete 0 questions in mental math
3. **Expected**: Streak = 0 (paper attempts don't count)

### Test 9: Mixed Sessions (Paper + Mental Math)
1. Complete 20 questions in paper attempts
2. Complete 15 questions in mental math
3. **Expected**: Streak = 1 (only mental math counts)

## Testing Steps

### Manual Testing
1. **Check Current Streak**: Look at user profile or dashboard
2. **Complete Mental Math Session**: Go to `/mental` and complete a session
3. **Verify Streak**: Check if streak updated correctly
4. **Check Database**: Query `users` table for `current_streak` and `last_practice_date`

### Database Verification
```sql
-- Check user streak
SELECT id, email, current_streak, longest_streak, last_practice_date 
FROM users 
WHERE email = 'test@example.com';

-- Check today's practice sessions
SELECT id, user_id, total_questions, completed_at 
FROM practice_sessions 
WHERE user_id = <user_id> 
  AND DATE(completed_at) = CURRENT_DATE;
```

### Backend Logs
Check console logs for streak updates:
- `🟡 [STREAK]` - Streak calculation logs
- `⚠️ [STREAK]` - Streak validation warnings

## Common Issues

### Issue: Streak not incrementing
- **Check**: Did you complete 15+ questions in mental math?
- **Check**: Is it a consecutive day?
- **Check**: Are you counting paper attempts? (They don't count)

### Issue: Streak reset unexpectedly
- **Check**: Did you complete < 15 questions today?
- **Check**: Was there a gap day?
- **Check**: Are you looking at the right user account?

### Issue: Streak shows 0 but should be higher
- **Check**: Database `current_streak` field
- **Check**: `last_practice_date` - is it today?
- **Check**: Total questions from today's sessions

## Quick Test Checklist

- [ ] New user, 15+ questions → Streak = 1
- [ ] New user, < 15 questions → Streak = 0
- [ ] Same day, multiple sessions, total 15+ → Streak maintained
- [ ] Same day, multiple sessions, total < 15 → Streak = 0
- [ ] Consecutive days, both 15+ → Streak increments
- [ ] Gap day → Streak resets
- [ ] Paper attempts don't count → Verified
- [ ] Mixed sessions → Only mental math counts

## Notes

- Streak is calculated server-side in `backend/gamification.py`
- Streak updates happen when saving practice sessions
- Timezone: Uses IST (Indian Standard Time) for date calculations
- Streak badges are awarded at 7 days and 30 days

