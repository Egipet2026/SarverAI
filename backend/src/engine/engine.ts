// ── SarverAI Engine: the core AI orchestration ──

import { detectLanguage, normalize, extractNumbers, extractMathExpression, Language } from './nlp.js';
import { detectIntent, Intent } from './intents.js';
import { searchKnowledge } from './knowledge.js';
import { ConversationContext } from './context.js';
import { evaluateMath } from './mathParser.js';
import { getJoke } from './jokes.js';

export interface EngineResponse {
  response: string;
  intent: Intent;
  language: Language;
  thinkingMs: number;
}

export class SarverEngine {
  private context = new ConversationContext();

  process(input: string): EngineResponse {
    const start = Date.now();
    const lang = detectLanguage(input);
    const { intent } = detectIntent(input, lang);

    let response = this.generateResponse(input, intent, lang);

    this.context.update(lang, intent);

    return {
      response,
      intent,
      language: lang,
      thinkingMs: Date.now() - start,
    };
  }

  private generateResponse(input: string, intent: Intent, lang: Language): string {
    const bg = lang === 'bg';

    switch (intent) {
      case 'greeting':
        return bg
          ? this.pick(['Здравей! 👋 Радвам се да те видя. С какво мог да помогна?',
            'Здрасти! Какво те води при мен днес?',
            'Привет! Готов съм за разговор. За какво искаш да поговорим?'])
          : this.pick(['Hello! 👋 Great to see you. How can I help?',
            'Hi there! What brings you to me today?',
            'Hey! I\'m ready to chat. What would you like to talk about?']);

      case 'farewell':
        return bg
          ? this.pick(['Довиждане! Беше приятно да си поговорим. 👋',
            'Чао! Връщай се пак, когато искаш. 😊',
            'На добър час! Бях полезен, надявам се.'])
          : this.pick(['Goodbye! It was nice talking with you. 👋',
            'See you! Come back anytime. 😊',
            'Farewell! Hope I was helpful.']);

      case 'about_self':
        return this.selfResponse(lang);

      case 'capabilities':
        return this.capabilitiesResponse(lang);

      case 'math':
        return this.mathResponse(input, lang);

      case 'time':
        return bg
          ? `Точно сега е ${new Date().toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} часа. ⏰`
          : `The current time is ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}. ⏰`;

      case 'date':
        return bg
          ? `Днес е ${new Date().toLocaleDateString('bg-BG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. 📅`
          : `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. 📅`;

      case 'joke':
        return getJoke(lang);

      case 'thanks':
        return bg
          ? this.pick(['Няма проблем! Винаги съм насреща. 😊', 'Моля! Радвам се да съм полезен.'])
          : this.pick(['You\'re welcome! Always here to help. 😊', 'My pleasure! Glad I could help.']);

      case 'help':
        return bg
          ? 'Ето какво мога да направя за теб:\n• Отговарям на въпроси от моята база знания\n• Решавам математически изрази (напр. „колко е 15 * 7 + 3")\n• Казвам колко е часът и каква дата е\n• Разказвам шеги\n• Разпознавам емоции в текста\n• Работя на български и английски\n\nПросто питай!'
          : 'Here\'s what I can do for you:\n• Answer questions from my knowledge base\n• Solve math expressions (e.g. "what is 15 * 7 + 3")\n• Tell you the time and date\n• Tell jokes\n• Detect emotions in text\n• Work in both Bulgarian and English\n\nJust ask!';

      case 'opinion':
        return this.opinionResponse(input, lang);

      case 'sentiment_positive':
        return bg
          ? this.pick(['Радвам се, че си с добро настроение! 😊', 'Страхотно! Позитивната енергия е заразителна. ✨'])
          : this.pick(['I\'m glad you\'re in a good mood! 😊', 'Awesome! Positive energy is contagious. ✨']);

      case 'sentiment_negative':
        return bg
          ? this.pick(['Съжалявам да го чуя. Искаш ли да поговорим за това? 💙', 'Не си сам — понякога нещата са трудни, но преминават. 💪'])
          : this.pick(['I\'m sorry to hear that. Would you like to talk about it? 💙', 'You\'re not alone — things can be hard, but they pass. 💪']);

      case 'learn_fact':
        return this.learnFactResponse(input, lang);

      case 'knowledge_question':
        return this.knowledgeResponse(input, lang);

      case 'unknown':
      default:
        return this.unknownResponse(input, lang);
    }
  }

  private selfResponse(lang: Language): string {
    const bg = lang === 'bg';
    return bg
      ? 'Аз съм **SarverAI** — независим изкуствен интелект, създаден да работи изцяло локално. 🧠\n\nЗа разлика от други AI асистенти, аз не използвам външни API-та или облачни услуги. Цялата ми обработка става на сървъра ти, което означава:\n\n• 🔒 Пълна поверителност — данните не напускат сървъра\n• ⚡ Бърз отговор — без мрежови закъснения\n• 🔧 Пълна контрол — ти управляваш всичко\n\nМога да водя разговори, да отговарям на въпроси, да решавам математика и още. Просто питай!'
      : 'I am **SarverAI** — an independent artificial intelligence built to run entirely locally. 🧠\n\nUnlike other AI assistants, I don\'t use external APIs or cloud services. All my processing happens on your server, which means:\n\n• 🔒 Complete privacy — data never leaves the server\n• ⚡ Fast responses — no network latency\n• 🔧 Full control — you manage everything\n\nI can hold conversations, answer questions, solve math, and more. Just ask!';
  }

  private capabilitiesResponse(lang: Language): string {
    const bg = lang === 'bg';
    return bg
      ? 'Ето какво мога да направя:\n\n🧮 **Математика** — реши изрази като „колко е 25 * 4 + 10"\n📚 **Знания** — питай ме за технологии, наука, география, история\n⏰ **Време и дата** — попитай „колко е часа" или „кой ден сме"\n😄 **Шеги** — просто кажи „разкажи шега"\n🌍 **Двуезичен** — говоря български и английски\n🧠 **Анализ на емоции** — разпознавам настроението в текста ти\n💬 **Разговор** — водя смислени разговори с контекст\n\nКакво искаш да опиташ?'
      : 'Here\'s what I can do:\n\n🧮 **Math** — solve expressions like "what is 25 * 4 + 10"\n📚 **Knowledge** — ask me about tech, science, geography, history\n⏰ **Time & date** — ask "what time is it" or "what day is it"\n😄 **Jokes** — just say "tell me a joke"\n🌍 **Bilingual** — I speak both Bulgarian and English\n🧠 **Sentiment analysis** — I detect the mood in your text\n💬 **Conversation** — I hold meaningful context-aware conversations\n\nWhat would you like to try?';
  }

  private mathResponse(input: string, lang: Language): string {
    const bg = lang === 'bg';
    const expr = extractMathExpression(input);
    const numbers = extractNumbers(input);

    let expression = expr;
    let result: number | null = null;

    if (expression) {
      result = evaluateMath(expression);
    } else if (numbers.length >= 2) {
      // Fallback: try to evaluate the raw input as math
      const cleaned = input.replace(/[^0-9+\-*/().^]/g, '');
      if (cleaned) {
        result = evaluateMath(cleaned);
        expression = cleaned;
      }
    }

    if (result !== null && expression) {
      const formatted = Number.isInteger(result)
        ? result.toString()
        : result.toFixed(4).replace(/\.?0+$/, '');
      return bg
        ? `Резултатът е: **${expression.trim()} = ${formatted}** ✅`
        : `The result is: **${expression.trim()} = ${formatted}** ✅`;
    }

    return bg
      ? 'Мисля, че искаш математическа операция, но не успях да разчета израза. Опитай така: „колко е 15 * 7 + 3" 🧮'
      : 'I think you want a math operation, but I couldn\'t parse the expression. Try like this: "what is 15 * 7 + 3" 🧮';
  }

  private opinionResponse(_input: string, lang: Language): string {
    const bg = lang === 'bg';
    return bg
      ? this.pick([
        'Като AI, нямам лични предпочитания, но мога да анализирам обективно. За какво искаш мнение?',
        'Мога да споделя различни гледни точки по дадена тема. За какво конкретно искаш да чуеш мнение?',
        'Интересен въпрос! Мога да разгледам плюсовете и минусите. За какво става въпрос?',
      ])
      : this.pick([
        'As an AI, I don\'t have personal preferences, but I can analyze things objectively. What would you like my opinion on?',
        'I can share different perspectives on a topic. What specifically would you like to hear about?',
        'Interesting question! I can look at the pros and cons. What\'s the topic?',
      ]);
  }

  private knowledgeResponse(input: string, lang: Language): string {
    const entry = searchKnowledge(input, lang);
    if (entry) {
      return lang === 'bg' ? entry.response.bg : entry.response.en;
    }
    return this.unknownResponse(input, lang);
  }

  private learnFactResponse(input: string, lang: Language): string {
    const bg = lang === 'bg';
    // Try to extract the fact after "запомни"/"remember that" etc.
    const separators = bg ? ['запомни', 'научи', 'запиши'] : ['remember that', 'note that', 'store this', 'remember'];
    const normalized = input.toLowerCase();
    for (const sep of separators) {
      const idx = normalized.indexOf(sep);
      if (idx >= 0) {
        const fact = input.substring(idx + sep.length).trim();
        if (fact) {
          this.context.addFact(fact.substring(0, 50), fact);
          return bg
            ? `Запомнено! ✅ Ще помня: „${fact}"`
            : `Remembered! ✅ I\'ll keep that in mind: "${fact}"`;
        }
      }
    }
    return bg
      ? 'Какво искаш да запомня? Напиши например: „запомни: слънцето е звезда"'
      : 'What would you like me to remember? Try: "remember that the sun is a star"';
  }

  private unknownResponse(_input: string, lang: Language): string {
    const bg = lang === 'bg';
    return bg
      ? this.pick([
        'Интересен въпрос! Не съм сигурен, че знам отговор, но мога да ти помогна с: математика, време, дата, шеги, или въпроси от моята база знания. Опитай да питаш по друг начин. 🤔',
        'Хм, не съм напълно сигурен какво имаш предвид. Мога да отговарям на въпроси за технологии, наука, география и история, да решавам математика, да казвам часа и шеги. Какво те интересува? 😊',
        'Все още не знам всичко, но уча! Можеш да ме питаш за неща като: „какво е JavaScript", „колко е часа", „разкажи шега" или „кой си ти". 💡',
      ])
      : this.pick([
        'Interesting question! I\'m not sure I know the answer, but I can help with: math, time, date, jokes, or questions from my knowledge base. Try asking in another way. 🤔',
        'Hmm, I\'m not entirely sure what you mean. I can answer questions about technology, science, geography and history, solve math, tell the time, and tell jokes. What interests you? 😊',
        'I don\'t know everything yet, but I\'m learning! You can ask me things like: "what is JavaScript", "what time is it", "tell a joke" or "who are you". 💡',
      ]);
  }

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  reset(): void {
    this.context.reset();
  }
}
