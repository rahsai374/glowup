# Gender Personalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add gender collection to onboarding, persist to Firestore, and show gender-based SVG avatar on profile.

**Architecture:** Gender field added to UserProfile type and Firestore `users/{uid}` doc. Collected on the existing name step (Q6) with a pill selector. Profile page replaces the emoji avatar with an SVG line-art component. Reusable `GenderSelector` component shared between onboarding and profile edit.

**Tech Stack:** React Native, react-native-svg, Zustand, Firebase Firestore, i18next

---

### Task 1: Add i18n Keys

**Files:**
- Modify: `i18n/en.json`
- Modify: `i18n/hi.json`

- [ ] **Step 1: Add English keys**

Add these entries to `i18n/en.json` (after `"q6_placeholder"` line):

```json
"gender_helper": "Adding gender helps us personalize your routines",
"gender_male": "Male",
"gender_female": "Female",
"gender_unspecified": "Prefer not to say",
```

- [ ] **Step 2: Add Hindi (Hinglish) keys**

Add these entries to `i18n/hi.json` (after `"q6_placeholder"` line):

```json
"gender_helper": "Gender add करने से हम आपकी routines personalize कर सकते हैं",
"gender_male": "Male",
"gender_female": "Female",
"gender_unspecified": "बताना नहीं चाहते",
```

- [ ] **Step 3: Commit**

```bash
git add i18n/en.json i18n/hi.json
git commit -m "feat: add gender i18n keys (en + hi)"
```

---

### Task 2: Add Gender to UserProfile Type & Zustand Store

**Files:**
- Modify: `stores/useUserStore.ts`

- [ ] **Step 1: Add gender to UserProfile interface**

In `stores/useUserStore.ts`, add `gender` to the `UserProfile` interface (after `ageRange`):

```typescript
export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  language: 'en' | 'hi';
  skinType: string;
  mainConcern: string;
  waterIntake: string;
  sunscreenHabit: string;
  ageRange: string;
  gender: 'male' | 'female' | 'unspecified';
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

This will show errors in `firestore.ts` and `questions.tsx` where `UserProfile` is constructed without `gender`. That's expected — we fix those in Tasks 3 and 5.

- [ ] **Step 3: Commit**

```bash
git add stores/useUserStore.ts
git commit -m "feat: add gender field to UserProfile type"
```

---

### Task 3: Update Firestore Functions

**Files:**
- Modify: `lib/firestore.ts`

- [ ] **Step 1: Update saveProfile signature to include gender**

Change the `saveProfile` function signature in `lib/firestore.ts:15-17`:

```typescript
export async function saveProfile(
  uid: string,
  profile: { name: string; phone: string; language: string; mainConcern: string; skinType: string; waterIntake: string; sunscreenHabit: string; ageRange: string; gender: string }
): Promise<void> {
```

- [ ] **Step 2: Update hydrateFromFirestore to read gender**

In `lib/firestore.ts:54-64`, add `gender` to the profile object construction:

```typescript
  const profile: UserProfile = {
    uid,
    name: data.name ?? '',
    phone: data.phone ?? '',
    language: (data.language as 'en' | 'hi') ?? 'en',
    skinType: data.skinType ?? '',
    mainConcern: data.mainConcern ?? '',
    waterIntake: data.waterIntake ?? '',
    sunscreenHabit: data.sunscreenHabit ?? '',
    ageRange: data.ageRange ?? '',
    gender: (data.gender as 'male' | 'female' | 'unspecified') ?? 'unspecified',
  };
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`

Remaining errors should only be in `questions.tsx` (Task 5).

- [ ] **Step 4: Commit**

```bash
git add lib/firestore.ts
git commit -m "feat: persist and hydrate gender field in Firestore"
```

---

### Task 4: Create GenderSelector Component

**Files:**
- Create: `components/GenderSelector.tsx`

- [ ] **Step 1: Create the component**

Create `components/GenderSelector.tsx`:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

type Gender = 'male' | 'female' | 'unspecified';

interface GenderSelectorProps {
  value: Gender | '';
  onChange: (g: Gender) => void;
}

const OPTIONS: { key: Gender; labelKey: string }[] = [
  { key: 'male', labelKey: 'gender_male' },
  { key: 'female', labelKey: 'gender_female' },
  { key: 'unspecified', labelKey: 'gender_unspecified' },
];

export default function GenderSelector({ value, onChange }: GenderSelectorProps) {
  const { t } = useTranslation();

  return (
    <View>
      <Text
        style={{
          fontSize: 12,
          fontFamily: 'PlusJakartaSans_400Regular',
          color: 'rgba(45,24,16,0.55)',
          marginBottom: 10,
          textAlign: 'center',
        }}
      >
        {t('gender_helper')}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {OPTIONS.map((opt) => {
          const selected = value === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => onChange(opt.key)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: 'center',
                backgroundColor: selected ? '#E07856' : 'white',
                borderWidth: 1.5,
                borderColor: selected ? '#E07856' : 'rgba(224,120,86,0.12)',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans_600SemiBold',
                  color: selected ? 'white' : '#2D1810',
                }}
              >
                {t(opt.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add components/GenderSelector.tsx
git commit -m "feat: create reusable GenderSelector pill component"
```

---

### Task 5: Add Gender to Onboarding Name Step

**Files:**
- Modify: `app/questions.tsx`

- [ ] **Step 1: Add gender state**

In `app/questions.tsx`, add state for gender (after `const [nameInput, setNameInput] = useState('');` on line 73):

```typescript
const [gender, setGender] = useState<'male' | 'female' | 'unspecified' | ''>('');
```

- [ ] **Step 2: Import GenderSelector**

Add to imports at top:

```typescript
import GenderSelector from '@/components/GenderSelector';
```

- [ ] **Step 3: Include gender in profile object**

In the `finish()` function (line 93-100), add `gender` to the profile:

```typescript
    const profile = {
      name: trimmed,
      mainConcern: answers.q1 ?? '',
      skinType: answers.q2 ?? '',
      waterIntake: answers.q3 ?? '',
      sunscreenHabit: answers.q4 ?? '',
      ageRange: answers.q5 ?? '',
      gender: gender || 'unspecified',
    };
```

- [ ] **Step 4: Add GenderSelector below name input in the isNameStep block**

In the `{isNameStep ? (` block (line 171-191), add the gender selector after the TextInput's closing `Animated.View`. Replace the entire `isNameStep` branch:

```tsx
        {isNameStep ? (
          <Animated.View entering={FadeInRight.springify()}>
            <TextInput
              value={nameInput}
              onChangeText={(v) => setNameInput(v.replace(/[\x00-\x1F\x7F]/g, ''))}
              placeholder={t('q6_placeholder')}
              maxLength={50}
              autoFocus
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                paddingHorizontal: 18,
                paddingVertical: 18,
                fontSize: 16,
                color: '#2D1810',
                fontFamily: 'PlusJakartaSans_400Regular',
                textAlign: 'center',
                borderWidth: 2,
                borderColor: nameInput.trim() ? '#E07856' : 'rgba(224,120,86,0.12)',
              }}
            />
            <View style={{ marginTop: 24 }}>
              <GenderSelector value={gender} onChange={setGender} />
            </View>
          </Animated.View>
        ) : (
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add app/questions.tsx
git commit -m "feat: add gender selector to onboarding name step"
```

---

### Task 6: Create ProfileAvatar SVG Component

**Files:**
- Create: `components/ProfileAvatar.tsx`

- [ ] **Step 1: Create the SVG avatar component**

Create `components/ProfileAvatar.tsx`:

```tsx
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';

type Gender = 'male' | 'female' | 'unspecified';

interface ProfileAvatarProps {
  gender: Gender;
  size?: number;
}

function MaleAvatar({ size }: { size: number }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <Circle cx="40" cy="32" r="14" stroke="#2D1810" strokeWidth="2.5" />
      <Path d="M28 22c2-6 8-10 12-10s10 4 12 10" stroke="#2D1810" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M24 70c0-10 7-18 16-18s16 8 16 18" stroke="#2D1810" strokeWidth="2.5" strokeLinecap="round" />
      <Ellipse cx="35" cy="33" rx="1.5" ry="2" fill="#2D1810" />
      <Ellipse cx="45" cy="33" rx="1.5" ry="2" fill="#2D1810" />
      <Path d="M37 40c1.5 1.5 4.5 1.5 6 0" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function FemaleAvatar({ size }: { size: number }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <Circle cx="40" cy="32" r="14" stroke="#2D1810" strokeWidth="2.5" />
      <Path d="M24 20c4-8 10-12 16-12s12 4 16 12c2 4 2 14 0 20" stroke="#2D1810" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M20 20c0 8-2 18 0 28" stroke="#2D1810" strokeWidth="2" strokeLinecap="round" />
      <Path d="M24 70c0-10 7-18 16-18s16 8 16 18" stroke="#2D1810" strokeWidth="2.5" strokeLinecap="round" />
      <Ellipse cx="35" cy="33" rx="1.5" ry="2" fill="#2D1810" />
      <Ellipse cx="45" cy="33" rx="1.5" ry="2" fill="#2D1810" />
      <Path d="M37 40c1.5 1.5 4.5 1.5 6 0" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function NeutralAvatar({ size }: { size: number }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <Circle cx="40" cy="32" r="14" stroke="#2D1810" strokeWidth="2.5" />
      <Path d="M26 20c4-6 9-9 14-9s10 3 14 9" stroke="#2D1810" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M24 70c0-10 7-18 16-18s16 8 16 18" stroke="#2D1810" strokeWidth="2.5" strokeLinecap="round" />
      <Ellipse cx="35" cy="33" rx="1.5" ry="2" fill="#2D1810" />
      <Ellipse cx="45" cy="33" rx="1.5" ry="2" fill="#2D1810" />
      <Path d="M37 40c1.5 1.5 4.5 1.5 6 0" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export default function ProfileAvatar({ gender, size = 80 }: ProfileAvatarProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#FFF5EE',
        borderWidth: 2,
        borderColor: 'rgba(224,120,86,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {gender === 'male' && <MaleAvatar size={size * 0.85} />}
      {gender === 'female' && <FemaleAvatar size={size * 0.85} />}
      {gender === 'unspecified' && <NeutralAvatar size={size * 0.85} />}
    </View>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add components/ProfileAvatar.tsx
git commit -m "feat: create ProfileAvatar SVG component with gender variants"
```

---

### Task 7: Update Profile Screen

**Files:**
- Modify: `app/(tabs)/profile.tsx`

- [ ] **Step 1: Import new components**

Add imports at top of `app/(tabs)/profile.tsx`:

```typescript
import ProfileAvatar from '@/components/ProfileAvatar';
import GenderSelector from '@/components/GenderSelector';
import { updateProfileField } from '@/lib/firestore';
```

Note: `updateProfileField` is already imported — just add `ProfileAvatar` and `GenderSelector`.

- [ ] **Step 2: Replace emoji avatar with ProfileAvatar**

In `app/(tabs)/profile.tsx`, replace the avatar `View` block (lines 109-121) — the inner view with the emoji:

Replace:
```tsx
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: 'rgba(224,120,86,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 36 }}>👩🏽</Text>
            </View>
```

With:
```tsx
            <View style={{ marginBottom: 12 }}>
              <ProfileAvatar gender={user?.gender ?? 'unspecified'} size={72} />
            </View>
```

- [ ] **Step 3: Add GenderSelector below the name edit section**

After the name input section's closing `</Animated.View>` (around line 179), add a gender section:

```tsx
        {/* Gender selector */}
        <Animated.View entering={FadeInDown.delay(120).springify()}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810', marginBottom: 8 }}>
              Gender
            </Text>
            <GenderSelector
              value={user?.gender ?? 'unspecified'}
              onChange={(g) => {
                updateUser({ gender: g });
                logEvent(EVENTS.PROFILE_UPDATED, { field: 'gender' });
                if (user?.uid) {
                  updateProfileField(user.uid, { gender: g }).catch(() => {});
                }
              }}
            />
          </View>
        </Animated.View>
```

- [ ] **Step 4: Update animation delays for sections below**

Bump the `delay()` values for sections that follow the new gender block:
- Language toggle: `delay(160)` → `delay(200)`
- Skin details: `delay(240)` → `delay(280)`
- Account actions: `delay(320)` → `delay(360)`

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add app/\(tabs\)/profile.tsx
git commit -m "feat: replace emoji avatar with gender-based SVG, add gender edit"
```

---

### Task 8: Visual Verification

- [ ] **Step 1: Start dev server**

Run: `npx expo start`

- [ ] **Step 2: Verify onboarding name step**

Navigate through onboarding. On the name step:
- Name input should appear at top
- Below it: helper text "Adding gender helps us personalize your routines"
- Three pills: Male / Female / Prefer not to say
- Tapping a pill selects it (terracotta fill, white text)
- Tapping Done without selecting gender should still work

- [ ] **Step 3: Verify profile page**

On profile tab:
- SVG avatar shows based on selected gender (or neutral if unspecified)
- Gender selector appears between name and language sections
- Changing gender updates avatar immediately
- Avatar style: line art in deep brown on cream circle

- [ ] **Step 4: Verify Firestore persistence**

After completing onboarding or editing gender on profile:
- Check Firestore console → `users/{uid}` document has `gender` field
- Kill and relaunch app → gender persists (hydrated from Firestore)

---
