# ZODIACSOCCER Visual Style Guide

## Core Philosophy

ZODIACSOCCER combines two worlds:

* Football = competition, tactics, rankings, statistics
* Zodiac = mystery, destiny, cosmic influence

The UI should feel:

* Elegant
* Slow
* Celestial
* Competitive
* Data-rich

Avoid:

* Fast esports aesthetics
* Neon cyberpunk overload
* Cartoon astrology
* Excessive motion

Everything should feel like stars slowly moving above a football stadium.

---

# Color System

## Primary Background

```css
--bg-dark: #070b12;
--bg-card: #101722;
--bg-elevated: #182231;
```

The application should remain dark-first.

---

## Cosmic Gold

Used for rankings, trophies, stars and important actions.

```css
--gold: #d8b45f;
--gold-light: #f0d38a;
```

---

## Zodiac Blue

```css
--cosmic-blue: #4c7dff;
--cosmic-blue-soft: #7ea4ff;
```

---

## Field Green

Used sparingly.

```css
--pitch-green: #3f9b55;
--pitch-green-soft: #63c57b;
```

Never use large football-green surfaces.

Football should be represented through accents.

---

## Danger

```css
--danger: #ff6b6b;
```

---

# Typography

## Headers

Elegant sans-serif.

```css
font-family: "Signika", sans-serif;
```

Used for:

* Team names
* Zodiac signs
* League titles

---

## Body

Clean sans-serif.

```css
font-family: "Signika", sans-serif;
```

Used for:

* Stats
* Tables
* Menus
* Forms

---

# Shadows

Never use hard shadows.

Use atmospheric glows.

```css
box-shadow:
0 0 20px rgba(216,180,95,.08),
0 0 40px rgba(216,180,95,.04);
```

Cards should appear illuminated from within.

---

# Animation Philosophy

Everything moves slowly.

Think:

* planets
* constellations
* breathing light

Not:

* slot machines
* casino effects
* esports HUD

---

## Global Timing

```css
--slow: 400ms;
--slower: 800ms;
--cosmic: 1500ms;
```

---

# Glow Animation

```css
@keyframes cosmicPulse {
  0% {
    box-shadow:
    0 0 10px rgba(216,180,95,.08);
  }

  50% {
    box-shadow:
    0 0 25px rgba(216,180,95,.18);
  }

  100% {
    box-shadow:
    0 0 10px rgba(216,180,95,.08);
  }
}
```

Apply only to:

* active zodiac
* selected team
* trophy areas

---

# Card Design

Cards are the foundation.

```css
background:
linear-gradient(
180deg,
rgba(255,255,255,.03),
rgba(255,255,255,.01)
);

border:
1px solid rgba(255,255,255,.08);

backdrop-filter: blur(8px);
```

Visual inspiration:

* UEFA graphics
* celestial observatories
* luxury dashboards

---

# Zodiac Visual Language

Each sign should have:

```css
--sign-color
--sign-glow
```

Example:

Aries

```css
--sign-color: #ff7d6b;
```

Taurus

```css
--sign-color: #8ecf7d;
```

Leo

```css
--sign-color: #f7c95f;
```

Aquarius

```css
--sign-color: #63bfff;
```

Do not change layouts.

Only accents and glows.

---

# Tables

League tables should resemble official competition broadcasts.

```css
border-spacing: 0 8px;
```

Rows:

```css
background: rgba(255,255,255,.03);
```

Hover:

```css
transform: translateX(4px);
```

Transition:

```css
transition: 400ms ease;
```

---

# Match Cards

Finished matches:

Gold border glow.

Live matches:

Blue glow.

Upcoming matches:

Neutral.

This instantly communicates state.

---

# Background Effects

## Starfield

Very subtle.

```css
opacity: .15;
```

Slow drift:

```css
animation: drift 120s linear infinite;
```

---

## Constellation Layer

SVG overlay.

Opacity:

```css
0.03 - 0.08
```

Never brighter.

---

# Buttons

Buttons should feel ceremonial.

```css
border-radius: 999px;
```

Hover:

```css
transform: translateY(-2px);
```

Glow:

```css
box-shadow:
0 0 15px rgba(216,180,95,.15);
```

---

# Rankings

Top 3 should have unique treatments.

1st:
Gold glow

2nd:
Silver glow

3rd:
Bronze glow

This creates visual hierarchy without extra UI.

---

# Squad View

Player cards should resemble collectible cards.

Information hierarchy:

1. Name
2. Position
3. Zodiac
4. Rating

Rating should be the brightest element.

---

# Microinteractions

Allowed:

✓ glow changes

✓ soft scaling

✓ opacity fades

✓ slow movement

Avoid:

✗ shaking

✗ bouncing

✗ flashing

✗ spinning

---

# Overall Mood

If UEFA Champions League,
Football Manager,
and a Zodiac Observatory
had a child,
it should look like ZODIACSOCCER.


A final touch that would make Zodiac Soccer feel unique: use the 12 zodiac colors as the only strong colors in the entire app, keeping everything else dark, gold, silver, and white. Then when a user opens Leo, Aquarius, Scorpio, etc., the whole screen subtly inherits that sign's glow color. This creates a strong identity with very little CSS.

I would avoid ultra-saturated horoscope colors and instead use deep gemstone tones. The contrast color is intended primarily for text/icons placed on the sign color.

Sign	Main Color	Text/Contrast
♈ Aries	#D65A4A	#FFF4EF
♉ Taurus	#5C8F63	#F3FAF4
♊ Gemini	#D8B45F	#182231
♋ Cancer	#5E82B8	#F5F8FF
♌ Leo	#D99A2B	#1A1306
♍ Virgo	#7B9B7D	#F7FAF7
♎ Libra	#C77BAA	#FFF8FC
♏ Scorpio	#7B2F44	#FFF2F5
♐ Sagittarius	#A96A36	#FFF8F2
♑ Capricorn	#55606D	#F5F8FB
♒ Aquarius	#4FA6D8	#08131B
♓ Pisces	#6678C8	#F5F7FF
Group Harmony
Fire Signs
--aries: #D65A4A;
--leo: #D99A2B;
--sagittarius: #A96A36;

Warm, heroic, trophy-like.

Earth Signs
--taurus: #5C8F63;
--virgo: #7B9B7D;
--capricorn: #55606D;

Grounded, managerial, tactical.

Air Signs
--gemini: #D8B45F;
--libra: #C77BAA;
--aquarius: #4FA6D8;

Elegant, intellectual, celestial.

Water Signs
--cancer: #5E82B8;
--scorpio: #7B2F44;
--pisces: #6678C8;

Mystical, emotional, night-sky friendly.

Glow Colors

Use a lighter version for glows:

--aries-glow: rgba(214,90,74,.25);
--taurus-glow: rgba(92,143,99,.25);
--gemini-glow: rgba(216,180,95,.25);
--cancer-glow: rgba(94,130,184,.25);
--leo-glow: rgba(217,154,43,.25);
--virgo-glow: rgba(123,155,125,.25);
--libra-glow: rgba(199,123,170,.25);
--scorpio-glow: rgba(123,47,68,.25);
--sagittarius-glow: rgba(169,106,54,.25);
--capricorn-glow: rgba(85,96,109,.25);
--aquarius-glow: rgba(79,166,216,.25);
--pisces-glow: rgba(102,120,200,.25);
Special recommendation for Zodiac Soccer

Instead of making the sign color the card background, keep cards dark:

background: #101722;
border: 1px solid var(--sign-color);

Then use the sign color only for:

borders
icons
rank badges
active tabs
glows
charts

This will make the app feel much more like a premium football manager and prevent the zodiac colors from overwhelming the statistics UI.