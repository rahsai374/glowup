# GlowUp — Frontend Design Integration Spec

**Date:** 2026-05-25
**Status:** Approved

---

## Goal

Enhance the GlowUp project plan to accommodate the `frontend-design` skill
by providing a reusable design system and per-screen briefs. This removes
ambiguity when generating each of the 14 app screens and ensures visual
consistency across the entire build.

---

## Decisions

- **Option C selected:** separate `DESIGN.md` at project root + single reference line in `PLAN.md`.
- `PLAN.md` stays architecture-focused; `DESIGN.md` owns all visual and motion decisions.
- Design system is sourced directly from the Magic Patterns mockup (`glow up design magic patterns/`).

---

## What Was Created

### `DESIGN.md` (project root)
Contains nine sections:
1. Design Identity — aesthetic direction in plain language
2. Color Tokens — all hex values + NativeWind class equivalents
3. Typography — font pairings and usage rules
4. Spacing & Shape — border-radius scale, shadow definitions
5. Atmosphere — the ambient blob pattern (signature GlowUp element)
6. Motion — Framer Motion → react-native-reanimated translation table
7. Bottom Navigation — tab bar style rules
8. Screen Briefs — one brief per screen (14 total), each with intent, key elements, motion notes, NativeWind hints
9. NativeWind Translation Notes — web-to-native class mapping

### `PLAN.md` (updated)
Added one line under `## App Identity`:
`Design system → see DESIGN.md`

---

## How to Use

When building any screen with the `frontend-design` skill:

1. Open `DESIGN.md` and find the screen's brief under **Section 8**.
2. Prefix your prompt with the standard stack header (shown at top of Section 8).
3. Paste the brief as the body of your prompt.
4. The skill will generate production-grade React Native / NativeWind code consistent with the design system.

---

## Source

All design tokens, color values, font choices, motion patterns, and component
patterns are extracted directly from:
`/Users/rahul/projects/glowup/glow up design magic patterns/`

The Magic Patterns project is a web (React + Tailwind) prototype.
`DESIGN.md` includes a NativeWind translation table for all unsupported web patterns.
