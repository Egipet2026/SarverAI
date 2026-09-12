// ── Intent detection: classify what the user wants ──

import { Language, normalize, containsAny, extractNumbers, extractMathExpression } from './nlp.js';

export type Intent =
  | 'greeting'
  | 'farewell'
  | 'about_self'
  | 'capabilities'
  | 'math'
  | 'time'
  | 'date'
  | 'joke'
  | 'help'
  | 'opinion'
  | 'thanks'
  | 'sentiment_positive'
  | 'sentiment_negative'
  | 'knowledge_question'
  | 'learn_fact'
  | 'unknown';

interface IntentDef {
  intent: Intent;
  keywords: string[];
  priority: number;
}

const INTENTS: IntentDef[] = [
  {
    intent: 'math',
    keywords: ['+', '-', '*', '/', 'умножи', 'събери', 'извади', 'раздели',
      'calculate', 'compute', 'равно', 'plus', 'minus', 'times', 'divided'],
    priority: 8,
  },
  {
    intent: 'greeting',
    keywords: ['здравей', 'здрасти', 'привет', 'добър ден', 'добро утро', 'добър вечер',
      'hello', 'hi', 'hey', 'good morning', 'good evening', 'yo', 'howdy'],
    priority: 5,
  },
  {
    intent: 'farewell',
    keywords: ['довиждане', 'чао', 'бай', 'ла път', 'пази се', 'довиждане',
      'bye', 'goodbye', 'see you', 'farewell', 'good night', 'gnight'],
    priority: 5,
  },
  {
    intent: 'about_self',
    keywords: ['кой си ти', 'какво си ти', 'как се казваш', 'твоето име', 'за себе си',
      'who are you', 'what are you', 'your name', 'about yourself', 'about you'],
    priority: 6,
  },
  {
    intent: 'capabilities',
    keywords: ['какво можеш', 'на какво си способен', 'какво умееш', 'за какво си',
      'what can you do', 'your capabilities', 'what do you do', 'help you with'],
    priority: 6,
  },
  {
    intent: 'time',
    keywords: ['колко е часа', 'какво е часа', 'часът', 'what time', 'current time'],
    priority: 7,
  },
  {
    intent: 'date',
    keywords: ['кой ден сме', 'каква дата', 'днес дата', 'what date', 'what day', 'today date'],
    priority: 7,
  },
  {
    intent: 'joke',
    keywords: ['шега', 'разкажи шега', 'нещо смешно', 'joke', 'tell a joke', 'make me laugh', 'something funny'],
    priority: 6,
  },
  {
    intent: 'thanks',
    keywords: ['благодаря', 'мерси', 'thanks', 'thank you', 'thx', 'благодаря ти'],
    priority: 5,
  },
  {
    intent: 'opinion',
    keywords: ['какво мислиш', 'мнение', 'съгласен ли си', 'what do you think',
      'your opinion', 'do you agree', 'do you like'],
    priority: 5,
  },
  {
    intent: 'help',
    keywords: ['помощ', 'помогни', 'help', 'how do i', 'как да', 'не знам как'],
    priority: 4,
  },
  {
    intent: 'learn_fact',
    keywords: ['запомни', 'научи', 'remember that', 'note that', 'store this', 'запиши'],
    priority: 7,
  },
];

const POSITIVE_WORDS = ['добре', 'отлично', 'страхотно', 'супер', 'прекрасно', 'чудесно', 'любов', 'щастие',
  'good', 'great', 'awesome', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'nice', 'cool'];
const NEGATIVE_WORDS = ['зле', 'лошо', 'тъжно', 'гадно', 'проблем', 'грешка', 'мразя',
  'bad', 'terrible', 'awful', 'sad', 'hate', 'angry', 'wrong', 'horrible', 'disgusting'];

export interface IntentResult {
  intent: Intent;
  confidence: number;
}

export function detectIntent(text: string, _lang: Language): IntentResult {
  const normalized = normalize(text);
  const numbers = extractNumbers(text);
  const mathExpr = extractMathExpression(text);

  // Math check — if we found numbers and math operators, high confidence
  if ((numbers.length >= 2 || (mathExpr && /[+\-*/^]/.test(mathExpr))) &&
      /[+\-*/]/.test(normalized) && numbers.length >= 1) {
    return { intent: 'math', confidence: 0.9 };
  }

  // Check each intent
  let bestIntent: Intent = 'unknown';
  let bestScore = 0;

  for (const def of INTENTS) {
    const matches = containsAny(normalized, def.keywords);
    if (matches.length > 0) {
      const score = def.priority + matches.length;
      if (score > bestScore) {
        bestScore = score;
        bestIntent = def.intent;
      }
    }
  }

  // Sentiment detection
  const positive = containsAny(normalized, POSITIVE_WORDS);
  const negative = containsAny(normalized, NEGATIVE_WORDS);
  if (bestIntent === 'unknown') {
    if (positive.length > negative.length && positive.length > 0) {
      return { intent: 'sentiment_positive', confidence: 0.6 };
    }
    if (negative.length > positive.length && negative.length > 0) {
      return { intent: 'sentiment_negative', confidence: 0.6 };
    }
  }

  // Knowledge question detection
  if (bestIntent === 'unknown') {
    const questionWords = ['какво е', 'кой е', 'каква е', 'кое е', 'къде е', 'кога е',
      'what is', 'who is', 'where is', 'when was', 'explain', 'разкажи за', 'tell me about'];
    if (containsAny(normalized, questionWords).length > 0) {
      return { intent: 'knowledge_question', confidence: 0.7 };
    }
  }

  const confidence = bestIntent === 'unknown' ? 0 : Math.min(bestScore / 10, 1);
  return { intent: bestIntent, confidence };
}

export { POSITIVE_WORDS, NEGATIVE_WORDS };
