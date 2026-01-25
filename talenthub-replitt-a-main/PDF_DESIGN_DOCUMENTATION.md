# PDF Generator Design Documentation

## Overview

This document explains the redesigned PDF generator system that matches the preview layout exactly. The new system uses ReportLab's `Table` and `SimpleDocTemplate` for precise layout control, ensuring the PDF output looks identical to what users see in the preview.

## Design Philosophy

1. **Match Preview Exactly**: The PDF should be pixel-perfect (or as close as possible) to the preview
2. **Table-Based Layout**: Use ReportLab tables for precise control over spacing, borders, and alignment
3. **Consistent Spacing**: Match CSS padding/margins exactly (converted from pixels/rem to mm)
4. **Professional Typography**: Clean fonts, proper sizing, readable text
5. **Excel-Compatible**: Table structure allows easy import to Excel

## Layout Specifications

### Page Setup
- **Page Size**: A4 (210mm × 297mm)
- **Margins**: 15mm on all sides (professional exam format)
- **Usable Width**: 180mm (210mm - 2×15mm)
- **Usable Height**: 267mm (297mm - 2×15mm)

### Colors (Matching Tailwind CSS)
- **Question Numbers**: `#1E40AF` (blue-700)
- **Operators**: `#2563EB` (blue-600)
- **Question Text**: `#1F2937` (gray-800)
- **Answer Text**: `#4B5563` (gray-600)
- **Borders**: `#E5E7EB` (gray-200)
- **Line (horizontal rule)**: `#9CA3AF` (gray-400)

### Typography
- **Font Family**: Helvetica (regular), Helvetica-Bold, Courier (monospace for numbers)
- **Title**: 18pt, Bold
- **Section Title**: 14pt, Bold
- **Question Number**: 12pt, Bold, Blue
- **Question Text**: 12pt, Monospace, Gray-800
- **Answer**: 11pt, Monospace, Gray-600, Bold
- **Instructions**: 10pt, Regular

### Spacing (Matching Tailwind CSS)
- **Cell Padding (Small)**: 2.83mm (matching `p-1` = 0.25rem = 4px)
- **Cell Padding (Medium)**: 4.25mm (matching `p-1.5` = 0.375rem = 6px)
- **Gap Between Questions**: 4mm (matching `gap-2` = 0.5rem = 8px)
- **Space After Title**: 8mm
- **Space After Section**: 6mm
- **Space Between Blocks**: 8mm

## Question Layout Types

### 1. Vertical Questions (Addition/Subtraction)

**Preview Structure:**
- 10 columns in a table
- Each question gets 10% width (18mm per column)
- Layout:
  - **Row 1**: Serial numbers (1., 2., 3., ...)
  - **Rows 2-N**: Operands (one row per operand, right-aligned)
  - **Line Row**: Horizontal line (border-top)
  - **Answer Row**: Answers (if `with_answers=True`), otherwise blank space

**PDF Implementation:**
```python
def render_vertical_questions_table(blocks, question_counter, with_answers):
    # Create table with 10 columns
    # Row 1: Serial numbers (left-aligned, blue, bold)
    # Rows 2-N: Operands (right-aligned, monospace, gray-800)
    # Line row: Thicker bottom border (gray-400)
    # Answer row: Answers (right-aligned, monospace, gray-600, bold)
```

**Key Features:**
- All questions in a block are rendered in a single 10-column table
- Empty cells are added if less than 10 questions
- Operators are shown in blue, right-aligned with operands
- Decimal format detection (for `decimal_add_sub` type)

### 2. Horizontal Questions (Multiplication, Division, etc.)

**Preview Structure:**
- Single column, multiple rows
- Each question is a table with:
  - **Column 1**: Serial number (8mm width, left-aligned, blue, bold)
  - **Column 2**: Question text (remaining width, left-aligned, monospace, gray-800)
  - **Column 3** (optional): Answer (80mm width, right-aligned, monospace, gray-600, bold)

**PDF Implementation:**
```python
def render_horizontal_question_table(question, question_num, with_answers):
    # Create table with 2-3 columns
    # Column 1: Serial number
    # Column 2: Question text (uses question.text if available, otherwise formats operands)
    # Column 3: Answer (if with_answers=True)
```

**Key Features:**
- Each question is a separate table
- Special handling for question types that use `question.text` field:
  - Square root (√)
  - Cube root (∛)
  - LCM, GCD
  - Decimal multiplication/division
  - Percentage
- Proper number formatting (no scientific notation)

## Implementation Details

### File Structure
- **`pdf_generator_v2.py`**: New redesigned PDF generator
- **`pdf_layout.py`**: Layout constants (legacy, kept for reference)
- **`main.py`**: Backend endpoint (updated to use new generator)

### Key Functions

1. **`format_number(num)`**: Formats numbers without scientific notation
   - Handles integers, floats, decimals
   - Matches frontend `formatNumber` function

2. **`create_paragraph_style(...)`**: Creates paragraph styles
   - Matches preview typography exactly
   - Handles fonts, sizes, colors, alignment, leading

3. **`render_vertical_questions_table(...)`**: Renders vertical questions
   - Creates 10-column table
   - Handles serial numbers, operands, line, answers
   - Supports decimal format detection

4. **`render_horizontal_question_table(...)`**: Renders horizontal questions
   - Creates 2-3 column table per question
   - Handles special question types
   - Proper text formatting

5. **`generate_pdf_v2(...)`**: Main PDF generation function
   - Uses `SimpleDocTemplate` for page management
   - Builds story (content) with proper spacing
   - Handles answer key page

## How to Customize

### Adjusting Spacing
Edit constants in `pdf_generator_v2.py`:
```python
CELL_PADDING_SMALL = 2.83 * mm  # p-1
CELL_PADDING_MEDIUM = 4.25 * mm  # p-1.5
GAP_BETWEEN_QUESTIONS = 4 * mm  # gap-2
SPACE_AFTER_TITLE = 8 * mm
```

### Changing Colors
Edit color constants:
```python
COLOR_BLUE_700 = colors.HexColor('#1E40AF')
COLOR_GRAY_800 = colors.HexColor('#1F2937')
# etc.
```

### Changing Fonts
Edit font constants:
```python
FONT_NAME = "Helvetica"
FONT_BOLD = "Helvetica-Bold"
FONT_MONO = "Courier"
```

### Adjusting Column Count
For vertical questions:
```python
VERTICAL_COLUMNS = 10  # Change to 8, 12, etc.
```

## Manual Design Help

If you want to manually design the PDF layout, you can:

1. **Edit Constants**: Modify spacing, colors, fonts in `pdf_generator_v2.py`
2. **Adjust Table Styles**: Modify `TableStyle` commands in rendering functions
3. **Change Layout**: Edit table structure (column widths, row heights)
4. **Customize Typography**: Modify `create_paragraph_style` calls

### Example: Changing Vertical Questions to 8 Columns

```python
VERTICAL_COLUMNS = 8  # Instead of 10
VERTICAL_COLUMN_WIDTH = USABLE_WIDTH / VERTICAL_COLUMNS
```

### Example: Increasing Cell Padding

```python
CELL_PADDING_SMALL = 4 * mm  # Instead of 2.83mm
CELL_PADDING_MEDIUM = 6 * mm  # Instead of 4.25mm
```

### Example: Changing Question Number Color

```python
COLOR_BLUE_700 = colors.HexColor('#DC2626')  # Red instead of blue
```

## Testing

To test the new PDF generator:

1. Generate a preview in the frontend
2. Download the PDF
3. Compare PDF with preview side-by-side
4. Check:
   - Spacing matches
   - Borders match
   - Colors match
   - Typography matches
   - Layout structure matches

## Migration from Old Generator

The old generator (`pdf_generator.py`) uses:
- Canvas-based drawing (low-level)
- Different layout approach
- Different spacing

The new generator (`pdf_generator_v2.py`) uses:
- Table-based layout (high-level, precise)
- Matches preview exactly
- Better maintainability

To switch to the new generator, update `main.py`:
```python
from pdf_generator_v2 import generate_pdf_v2 as generate_pdf
```

## Future Enhancements

Potential improvements:
1. Support for landscape orientation
2. Custom page headers/footers
3. Watermarks
4. Multi-language support
5. Custom fonts (TTF support)
6. Image support for diagrams
7. Custom styling per question type

## Questions?

If you need help customizing the PDF design:
1. Check this documentation
2. Review the constants in `pdf_generator_v2.py`
3. Test changes incrementally
4. Compare with preview to ensure match




