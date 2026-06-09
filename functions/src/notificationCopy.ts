export interface NotificationCopy {
  title: string;
  body: string;
}

export const DAILY_PUNCHLINES: NotificationCopy[] = [
  { title: 'Aaj ka skin check', body: 'Routine miss mat karo — results toh chahiye na?' },
  { title: 'Tera glow, teri care', body: 'Subah uthke ek scan — best wali habit hai ye.' },
  { title: 'Skin check reminder', body: '1 min ka scan, din bhar ka confidence.' },
  { title: 'Daily glow check', body: 'Aaj bhi chamakna hai? Toh routine pe kaam karo.' },
  { title: 'Miss mat karo yaar', body: 'Kal ka glow aaj ki routine pe depend karta hai.' },
  { title: 'Skin ne bulaya hai', body: 'Ek scan = ek step closer to that skin you want.' },
  { title: 'GlowUp time!', body: 'Healthy skin, happy face — aaj ka check-in pending hai.' },
  { title: 'Consistency wins', body: 'Thoda sa consistency, bahut saara glow. Aaj karo.' },
  { title: 'Apni skin dekho', body: 'Tera skin type kuch kehna chahta hai — sunn lo.' },
  { title: 'Routine yaad hai?', body: 'Serum lagaya? SPF lagaya? Routine done karo aaj.' },
  { title: 'Self-care time', body: 'Apni skin ki care karo — baaki sab baad mein.' },
  { title: 'Scan karo, fark dekho', body: 'Kya aaj bhi mirror mein same chehra dikhega?' },
  { title: 'Glow game on', body: 'Glow game strong rakhna hai? Routine pe stay karo.' },
  { title: 'Tera skin, teri journey', body: 'Miss mat karo — skin journey continuous hai.' },
  { title: 'Simple math', body: 'Daily scan = daily glow. That\'s it yaar.' },
  { title: 'Yaad dilana tha', body: 'Skin bhi improve hoti hai — jab tum consistently karo.' },
  { title: 'Check-in time', body: 'Tera skin deserve karta hai ek baar check karna.' },
  { title: 'Sunscreen yaad hai?', body: 'Sunscreen lagaya aaj? Skin ka shukriya maano.' },
  { title: 'Glow up chal raha hai', body: 'Glow up start ho gaya tha — band mat karo abhi.' },
  { title: 'Routine hero', body: 'Koi nahi dekhta toh kya? Skin toh tum dono jaante ho.' },
  { title: 'Skin baat kar rahi hai', body: 'Teri skin ne aaj kuch naya notice kiya? Check karo.' },
  { title: 'Quick scan', body: 'App open karo, scan karo, glow karo. That\'s it.' },
  { title: 'Aaj bhi skip?', body: 'Aaj ki date mein bhi self-care skip? Tch tch.' },
  { title: 'Skin yaad rakhti hai', body: 'Routine bhool gaye? Skin yaad rakhti hai.' },
  { title: 'Naye din, naya glow', body: 'Har subah ek naya chance — aaj ka scan pending hai.' },
];

export function pickRandom(): NotificationCopy {
  const index = Math.floor(Math.random() * DAILY_PUNCHLINES.length);
  return DAILY_PUNCHLINES[index];
}
