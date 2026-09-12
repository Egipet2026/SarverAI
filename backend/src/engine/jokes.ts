// ── Bilingual jokes for SarverAI ──
import { Language } from './nlp.js';

const JOKES: { bg: string; en: string }[] = [
  { bg: 'Защо програмистите бъркат Halloween с Коледа? Защото Oct 31 = Dec 25. 🎃', en: 'Why do programmers confuse Halloween with Christmas? Because Oct 31 = Dec 25. 🎃' },
  { bg: 'Какво казва един бит на другия? — „Мирно, грубиянче!" 🤖', en: 'What did one bit say to the other? — "Bit, please!" 🤖' },
  { bg: 'Защо AI отишъл на терапия? Защото имал твърде много слоеве с проблеми. 🧠', en: 'Why did the AI go to therapy? Because it had too many layers of issues. 🧠' },
  { bg: 'Има ли грънци горе? — Не, само тава. 🍳', en: 'Why don\'t scientists trust atoms? Because they make up everything. ⚛️' },
  { bg: 'Как се казва риба без очи? — Фш. 🐟', en: 'What do you call a fish with no eyes? — Fsh. 🐟' },
  { bg: 'Защо математикът се уплаши от числото 7? Защото 7 8 9 (Seven ate nine). 😱', en: 'Why was the math book sad? Because it had too many problems. 📚' },
];

let jokeIndex = 0;

export function getJoke(lang: Language): string {
  const joke = JOKES[jokeIndex % JOKES.length];
  jokeIndex++;
  return lang === 'bg' ? joke.bg : joke.en;
}
