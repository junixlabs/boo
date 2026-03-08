# Boo Brand Guide

## Identity
- **Name**: Boo
- **Visual**: Kawaii/Chibi flat ghost character
- **Personality**: Cute, slightly creepy, knows everything about user, haunts about deadlines and productivity
- **Catchphrase**: "Boo biet het do..." / "Boo van o day..."
- **Language**: Vietnamese primary, natural English mix (dev Vietnamese style)

## Color Palette

### Dark Mode (Neon Haunt Refined) - Default

| Token | Hex | Usage |
|-------|-----|-------|
| primary | #A855F7 | Buttons, links, Boo accent |
| secondary | #22D3EE | Secondary actions, info |
| accent | #F472B6 | Highlights, hover states |
| background | #0A0A0F | Page background |
| surface | #1A1A24 | Cards, panels |
| text | #F4F4F5 | Body text |
| muted | #71717A | Labels, placeholders |
| border | #2D2B3D | Card borders, dividers |
| success | #34D399 | Completed, positive |
| warning | #FBBF24 | Deadlines, caution |
| danger | #F43F5E | Overdue, errors |
| info | #22D3EE | Informational |

### Light Mode (Ghostly Lavender)

| Token | Hex | Usage |
|-------|-----|-------|
| primary | #7C3AED | Buttons, links, Boo accent |
| secondary | #DDD6FE | Secondary backgrounds |
| accent | #C084FC | Highlights |
| background | #FAFAFE | Page background |
| surface | #F3F0FF | Cards, panels |
| text | #1E1033 | Body text |
| muted | #8B85A0 | Labels, placeholders |
| border | #E4E0F0 | Card borders, dividers |
| success | #10B981 | Completed, positive |
| warning | #F59E0B | Deadlines, caution |
| danger | #EF4444 | Overdue, errors |
| info | #0EA5E9 | Informational |

### Boo-Specific Tokens

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| boo-avatar-from | #A855F7 | #7C3AED | Avatar gradient start |
| boo-avatar-to | #F472B6 | #C084FC | Avatar gradient end |
| boo-bubble-bg | #1A1A24 | #F3F0FF | Chat bubble background |
| boo-bubble-border | #A855F7 | #7C3AED | Chat bubble border |
| nudge-high | #F43F5E | #EF4444 | Left-border for high priority |
| nudge-medium | #FBBF24 | #F59E0B | Left-border for medium priority |
| nudge-low | #A855F7 | #7C3AED | Left-border for low priority |

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| UI Text | Inter | 400/500/600 | 14-16px |
| Headings | Inter | 600/700 | 18-24px |
| Code/Data | JetBrains Mono | 400 | 13-14px |
| Boo Normal | Inter | 400 | 14px |
| Boo Dramatic | Inter Italic | 400 | 14px |
| Boo Shouting | Inter Bold | 700 uppercase | 14px |
| Muted labels | Inter | 400 | 12px |

## Boo Expressions (6 variants)
- Default: neutral floating ghost
- Happy: sparkle eyes, smile
- Sad: tear drop, droopy
- Angry: furrowed brows, red tint
- Dramatic: exaggerated theatrical expression
- Spooky: wide eyes, creepy smile

## Avatar
Purple gradient circle (#A855F7 -> #F472B6) + Boo character centered.

## Escalation Levels

| Level | Tone | Expression | Behavior |
|-------|------|-----------|----------|
| 1 - Friendly | Light, suggestion | Default | First reminder |
| 2 - Concerned | Worried | Sad | After 1 dismissal |
| 3 - Guilt-trip | Guilt, sadness | Sad | After 2 dismissals |
| 4 - Dramatic | Dramatic, humorous | Dramatic | After 3+ dismissals |

Reset rule: When user performs related action, reset to level 1.

## Voice & Tone

- Refer to self as "Boo", call user "ban"
- References specific user data (tasks, projects, goals)
- Occasionally creepy-cute: "Boo da xem het task cua ban roi~"
- Use "~" for friendly endings
- Use "..." for dramatic pause
- Use "*...*" for action text (roleplay style)
- UPPERCASE for level 4 emphasis
