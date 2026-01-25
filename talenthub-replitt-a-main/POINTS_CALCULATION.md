# Points Calculation System

## Formula Breakdown

### 1. Base Points
- **Formula**: `correct_answers × 10`
- Every correct answer earns 10 base points

### 2. Speed Bonus
Based on average time per question:
- **Very Fast** (< 2 seconds per question): `correct_answers × 5`
- **Fast** (< 5 seconds per question): `correct_answers × 3`
- **Normal** (≥ 5 seconds per question): `0`

### 3. Accuracy Bonus
- **90%+ accuracy**: `total_questions × 5`
- **80-89% accuracy**: `total_questions × 3`
- **70-79% accuracy**: `total_questions × 2`
- **Below 70%**: `0`

### 4. Difficulty Multiplier
- **Easy**: 1.0× (no multiplier)
- **Medium**: 1.5×
- **Hard**: 2.0×
- **Custom**: 1.0× (no multiplier)

## Final Calculation

```
Total Points = (Base Points + Speed Bonus + Accuracy Bonus) × Difficulty Multiplier
```

## Example Calculations

### Example 1: Medium Difficulty
- 10 questions total
- 8 correct answers (80% accuracy)
- Average 3 seconds per question
- Medium difficulty

**Calculation:**
- Base: 8 × 10 = **80**
- Speed: 8 × 3 = **24** (avg_time < 5 seconds)
- Accuracy: 10 × 3 = **30** (80% accuracy)
- Subtotal: 80 + 24 + 30 = **134**
- Final: 134 × 1.5 = **201 points**

### Example 2: Hard Difficulty, Perfect Score
- 10 questions total
- 10 correct answers (100% accuracy)
- Average 1.5 seconds per question
- Hard difficulty

**Calculation:**
- Base: 10 × 10 = **100**
- Speed: 10 × 5 = **50** (avg_time < 2 seconds)
- Accuracy: 10 × 5 = **50** (90%+ accuracy)
- Subtotal: 100 + 50 + 50 = **200**
- Final: 200 × 2.0 = **400 points**

### Example 3: Easy Difficulty, Slower
- 10 questions total
- 7 correct answers (70% accuracy)
- Average 8 seconds per question
- Easy difficulty

**Calculation:**
- Base: 7 × 10 = **70**
- Speed: **0** (avg_time ≥ 5 seconds)
- Accuracy: 10 × 2 = **20** (70% accuracy)
- Subtotal: 70 + 0 + 20 = **90**
- Final: 90 × 1.0 = **90 points**





