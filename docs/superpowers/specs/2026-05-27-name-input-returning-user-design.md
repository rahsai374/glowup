# Name Input + Returning User Flow

## Summary

Two changes to the onboarding and sign-in experience:

1. **Name input (Q6):** Add a final question to the onboarding flow that collects the user's name, then write the full profile to Firestore on completion.
2. **Returning user detection:** After OTP verification, check if a Firestore profile exists. If yes, skip onboarding and go straight to home.
3. **Profile name sync:** When the user edits their name on the profile screen, update Firestore to keep it in sync.

## 1. Name Input — Q6 in questions.tsx

Add a 6th step to the questions flow, after Q5 (age range).

| Field | Value |
|-------|-------|
| Key | `q6` |
| Type | Text input (not radio select) |
| Title (en) | "What should we call you?" |
| Title (hi) | "हम आपको क्या बुलाएँ?" |
| Placeholder (en) | "Your name" |
| Placeholder (hi) | "आपका नाम" |
| Required | Yes — at least 1 character, trimmed |
| Button | "Done" (replaces "Next" on this final step) |

On Done:
1. `updateUser({ name: answers.q6.trim(), mainConcern, skinType, waterIntake, sunscreenHabit, ageRange })` — saves to Zustand/AsyncStorage (existing behavior for Q1–Q5 answers)
2. Write full profile to Firestore (see section 2)
3. Navigate to `/(tabs)`

## 2. Firestore Write on Onboarding Completion

After the Zustand update in step 1, write the full user profile to Firestore:

```
setDoc(doc(db, 'users', uid), {
  name,
  phone,
  language,
  skinType,
  mainConcern,
  waterIntake,
  sunscreenHabit,
  ageRange,
  createdAt: serverTimestamp()
})
```

- Uses `setDoc` (create or overwrite)
- Fire-and-forget — local Zustand store is the source of truth
- The `createdAt` field uses Firestore server timestamp for accuracy

## 3. Returning User Detection — auth.tsx

After OTP verification succeeds in `auth.tsx`:

1. Get `uid` from the Firebase auth result
2. `getDoc(doc(db, 'users', uid))`
3. If doc **exists** → `router.replace('/(tabs)')` — returning user, skip onboarding
4. If doc **doesn't exist** → `router.replace('/questions')` — new user, continue onboarding

The Zustand store still gets hydrated with basic auth info (`uid`, `phone`) so the app state is consistent. For returning users, AsyncStorage persistence handles the rest of the profile data locally.

Error handling: if the Firestore `getDoc` fails (network issue), fall through to `/questions` as a safe default. The user re-answers questions, and `setDoc` overwrites their existing profile — no data loss. Wrap the check in a try/catch.

## 4. Profile Name Sync — profile.tsx

The existing `save()` function in `app/(tabs)/profile.tsx` calls `updateUser({ name })` on Zustand. Add a Firestore update after it:

```
updateDoc(doc(db, 'users', user.uid), { name: trimmedName })
```

Fire-and-forget — same pattern as onboarding write. Local store remains source of truth.

## 5. Files Changed

| File | Change |
|------|--------|
| `app/questions.tsx` | Add Q6 (name text input step), Firestore write on Done |
| `app/auth.tsx` | After OTP success, check Firestore doc → route to `/(tabs)` or `/questions` |
| `app/(tabs)/profile.tsx` | Add Firestore `updateDoc` in `save()` function |
| `lib/firebase.ts` | Ensure Firestore imports (`doc`, `setDoc`, `getDoc`, `updateDoc`, `serverTimestamp`) are exported |
| i18n `en.json` / `hi.json` | Add Q6 title and placeholder translations |

## 6. Data Flow

### New User (first sign-in)
```
Auth (OTP) → check Firestore → doc missing → /questions
  → Q1–Q5 (skin profile) → Q6 (name)
  → updateUser() to Zustand
  → setDoc() to Firestore users/{uid}
  → /(tabs)
```

### Returning User (subsequent sign-in)
```
Auth (OTP) → check Firestore → doc exists → /(tabs)
```

### Name Edit (profile screen)
```
Edit name → save() → updateUser() to Zustand → updateDoc() to Firestore
```

## 7. What Doesn't Change

- Splash screen routing logic — unchanged
- Zustand store schema — `name` field already exists in UserProfile
- Q1–Q5 question structure — unchanged
- Scan flow — unchanged
- AsyncStorage persistence — still the primary local store
