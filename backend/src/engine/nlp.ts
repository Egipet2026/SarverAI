// ── NLP utilities: language detection, tokenization, similarity ──

export type Language = 'bg' | 'en';

const BG_STOPWORDS = new Set([
  'на', 'в', 'за', 'с', 'от', 'до', 'из', 'към', 'при', 'по', 'за', 'да',
  'не', 'си', 'са', 'те', 'то', 'това', 'тази', 'този', 'аз', 'ти', 'той',
  'тя', 'ние', 'вие', 'те', 'какво', 'кой', 'къде', 'кога', 'защо', 'как',
  'и', 'или', 'но', 'че', 'ако', 'дори', 'само', 'още', 'вече', 'все',
  'му', 'ѝ', 'им', 'ни', 'ви', 'ги', 'ме', 'те', 'се', 'го',
]);

const EN_STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'to', 'of',
  'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'about',
  'and', 'or', 'but', 'if', 'then', 'else', 'when', 'where', 'why', 'how',
  'what', 'who', 'whom', 'this', 'that', 'these', 'those', 'i', 'you',
  'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'its', 'our', 'their', 'not', 'no',
]);

export function detectLanguage(text: string): Language {
  const cyrillicCount = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
  return cyrillicCount > latinCount ? 'bg' : 'en';
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

export function removeStopwords(tokens: string[], lang: Language): string[] {
  const stops = lang === 'bg' ? BG_STOPWORDS : EN_STOPWORDS;
  return tokens.filter((t) => !stops.has(t));
}

export function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => i);
  for (let j = 1; j <= n; j++) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i];
      dp[i] = Math.min(
        dp[i] + 1,
        dp[i - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      prev = tmp;
    }
  }
  return dp[m];
}

export function wordSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const dist = levenshtein(a, b);
  return 1 - dist / maxLen;
}

export function textSimilarity(a: string, b: string): number {
  const tokensA = new Set(tokenize(a));
  const tokensB = new Set(tokenize(b));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let intersection = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) intersection++;
    else {
      // fuzzy match
      for (const tb of tokensB) {
        if (wordSimilarity(t, tb) > 0.8) {
          intersection += 0.5;
          break;
        }
      }
    }
  }
  const union = tokensA.size + tokensB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function containsAny(text: string, words: string[]): string[] {
  const lower = text.toLowerCase();
  return words.filter((w) => lower.includes(w.toLowerCase()));
}

export function containsAll(text: string, words: string[]): boolean {
  const lower = text.toLowerCase();
  return words.every((w) => lower.includes(w.toLowerCase()));
}

export function extractNumbers(text: string): number[] {
  const matches = text.match(/-?\d+(?:[.,]\d+)?/g);
  return matches ? matches.map((m) => parseFloat(m.replace(',', '.'))) : [];
}

export function extractMathExpression(text: string): string | null {
  // Find a math expression: sequence of digits, operators, parentheses, dots
  const matches = text.match(/-?\d[\d\s+\-*/().^]*\d/g);
  if (!matches || matches.length === 0) return null;
  return matches.sort((a, b) => b.length - a.length)[0].trim();
}
