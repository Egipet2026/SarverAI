// ── Intent detection: classify what the user wants (bilingual BG/EN) ──

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
    keywords: ['умножи', 'събери', 'извади', 'раздели', 'calculate', 'compute', 'равно',
      'plus', 'minus', 'times', 'divided', 'умножение', 'деление', 'събиране', 'изваждане'],
    priority: 8,
  },
  {
    intent: 'time',
    keywords: ['колко е часа', 'какво е часа', 'часът', 'кого е часа', 'часа сега',
      'what time', 'current time', 'time is it', 'what\'s the time'],
    priority: 7,
  },
  {
    intent: 'date',
    keywords: ['кой ден сме', 'каква дата', 'днес дата', 'какъв ден е днес', 'коя дата е днес',
      'what date', 'what day', 'today date', 'what\'s the date', 'day is it'],
    priority: 7,
  },
  {
    intent: 'learn_fact',
    keywords: ['запомни', 'научи', 'запиши', 'remember that', 'note that', 'store this'],
    priority: 7,
  },
  {
    intent: 'about_self',
    keywords: ['кой си ти', 'какво си ти', 'как се казваш', 'твоето име', 'за себе си',
      'who are you', 'what are you', 'your name', 'about yourself', 'about you', 'what is your name',
      'разкажи за себе си', 'кой те създаде', 'who made you', 'who created you'],
    priority: 6,
  },
  {
    intent: 'capabilities',
    keywords: ['какво можеш', 'на какво си способен', 'какво умееш', 'за какво си',
      'какво можеш да направиш', 'какви са възможностите ти',
      'what can you do', 'your capabilities', 'what do you do', 'help you with', 'what are your features'],
    priority: 6,
  },
  {
    intent: 'joke',
    keywords: ['шега', 'разкажи шега', 'нещо смешно', 'по-приказвай шега', 'направи ме да се смея',
      'joke', 'tell a joke', 'make me laugh', 'something funny', 'say something funny'],
    priority: 6,
  },
  {
    intent: 'greeting',
    keywords: ['здравей', 'здрасти', 'привет', 'добър ден', 'добро утро', 'добър вечер', 'здрасти',
      'hello', 'hi', 'hey', 'good morning', 'good evening', 'yo', 'howdy', 'what\'s up', 'sup', 'greetings'],
    priority: 5,
  },
  {
    intent: 'farewell',
    keywords: ['довиждане', 'чао', 'бай', 'ла път', 'пази се', 'на добър час', 'до скоро',
      'bye', 'goodbye', 'see you', 'farewell', 'good night', 'gnight', 'later', 'take care'],
    priority: 5,
  },
  {
    intent: 'thanks',
    keywords: ['благодаря', 'мерси', 'благодаря ти', 'много благодаря',
      'thanks', 'thank you', 'thx', 'appreciate it', 'much appreciated'],
    priority: 5,
  },
  {
    intent: 'opinion',
    keywords: ['какво мислиш', 'мнение', 'съгласен ли си', 'какво е мнението ти',
      'what do you think', 'your opinion', 'do you agree', 'do you like', 'what\'s your take'],
    priority: 5,
  },
  {
    intent: 'help',
    keywords: ['помощ', 'помогни', 'как да', 'не знам как', 'какво да правя',
      'help', 'how do i', 'i don\'t know how', 'can you help', 'i need help'],
    priority: 4,
  },
];

const POSITIVE_WORDS = ['добре', 'отлично', 'страхотно', 'супер', 'прекрасно', 'чудесно', 'любов', 'щастие',
  'браво', 'велико', 'супер си', 'харесвам', 'обичам', 'кефя се',
  'good', 'great', 'awesome', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'nice', 'cool',
  'brilliant', 'perfect', 'glad', 'pleased'];
const NEGATIVE_WORDS = ['зле', 'лошо', 'тъжно', 'гадно', 'проблем', 'грешка', 'мразя',
  'ужасно', 'трудно', 'несполука', 'счупено', 'не работи', 'объркано',
  'bad', 'terrible', 'awful', 'sad', 'hate', 'angry', 'wrong', 'horrible', 'disgusting',
  'broken', 'annoying', 'frustrated', 'disappointed', 'upset'];

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

  // Knowledge question detection — broad patterns for both languages
  if (bestIntent === 'unknown') {
    const questionWords = [
      'какво е', 'кой е', 'каква е', 'кое е', 'къде е', 'кога е', 'защо е',
      'как работи', 'обясни', 'разкажи за', 'разкажи ми за', 'какво знаеш за',
      'ми говори за', 'какво представлява', 'кои са', 'колко', 'защо',
      'what is', 'who is', 'where is', 'when was', 'explain', 'tell me about',
      'what do you know about', 'how does', 'what are', 'define', 'describe',
      'can you tell me about', 'what about', 'tell me',
    ];
    if (containsAny(normalized, questionWords).length > 0) {
      return { intent: 'knowledge_question', confidence: 0.7 };
    }
  }

  const confidence = bestIntent === 'unknown' ? 0 : Math.min(bestScore / 10, 1);
  return { intent: bestIntent, confidence };
}

export { POSITIVE_WORDS, NEGATIVE_WORDS };
