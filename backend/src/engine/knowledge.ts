// ── Knowledge base: bilingual facts the AI can answer about ──

import { Language } from './nlp.js';

export interface KnowledgeEntry {
  keywords: string[]; // match in either language
  response: { bg: string; en: string };
  category: string;
}

export const knowledgeBase: KnowledgeEntry[] = [
  {
    category: 'self',
    keywords: ['sarverai', 'сарв', 'ти кой', 'who are you', 'what are you', 'какво си ти', 'кой си ти', 'твоето име', 'your name'],
    response: {
      bg: 'Аз съм SarverAI — независим изкуствен интелект, създаден да работи изцяло локално, без външни API-та или облачни услуги. Цялата ми обработка става на твоя сървър.',
      en: 'I am SarverAI — an independent artificial intelligence built to run entirely locally, without external APIs or cloud services. All my processing happens on your server.',
    },
  },
  {
    category: 'self',
    keywords: ['what can you do', 'какво можеш', 'на какво си способен', 'capabilities', 'за какво си', 'какво умееш'],
    response: {
      bg: 'Мога да водя разговори, да отговарям на въпроси от моята база знания, да решавам математически изрази, да разказвам шеги, да давам мнения и да разпознавам емоции в текста. Работя на български и английски.',
      en: 'I can hold conversations, answer questions from my knowledge base, solve math expressions, tell jokes, give opinions, and detect emotions in text. I work in both Bulgarian and English.',
    },
  },
  {
    category: 'tech',
    keywords: ['javascript', 'java script', 'джава скрипт'],
    response: {
      bg: 'JavaScript е език за програмиране, създаден през 1995 г. от Брендан Айк. Днес е един от най-популярните езици в света, използван за уеб сайтове, сървъри (Node.js), мобилни и десктоп приложения.',
      en: 'JavaScript is a programming language created in 1995 by Brendan Eich. Today it is one of the most popular languages in the world, used for websites, servers (Node.js), mobile and desktop apps.',
    },
  },
  {
    category: 'tech',
    keywords: ['python', 'питон', 'пайтън'],
    response: {
      bg: 'Python е високоефективен език за програмиране, създаден от Гуидо ван Розум през 1991 г. Известен е с четимостта си и се използва широко в изкуствения интелект, науката за данни, уеб разработката и автоматизацията.',
      en: 'Python is a high-level programming language created by Guido van Rossum in 1991. Known for its readability, it is widely used in AI, data science, web development, and automation.',
    },
  },
  {
    category: 'tech',
    keywords: ['react', 'реакт'],
    response: {
      bg: 'React е JavaScript библиотека за създаване на потребителски интерфейси, разработена от Facebook (Meta). Използва компонентен модел и виртуален DOM за ефективно обновяване на страниците.',
      en: 'React is a JavaScript library for building user interfaces, developed by Facebook (Meta). It uses a component model and virtual DOM for efficient page updates.',
    },
  },
  {
    category: 'tech',
    keywords: ['ai', 'изкуствен интелект', 'artificial intelligence', 'штучен интелект', 'ии'],
    response: {
      bg: 'Изкуственият интелект (ИИ) е област от компютърните науки, която се занимава със създаването на системи, способни да изпълняват задачи, които изискват човешки интелект — разпознаване на образи, разбиране на език, вземане на решения и учене.',
      en: 'Artificial Intelligence (AI) is a field of computer science focused on creating systems capable of performing tasks that require human intelligence — pattern recognition, language understanding, decision-making, and learning.',
    },
  },
  {
    category: 'science',
    keywords: ['слънце', 'sun', 'sun star', 'звезда слънце'],
    response: {
      bg: 'Слънцето е звезда от тип G2V в центъра на Слънчевата система. То съдържа около 99.86% от общата маса на системата. Температурата на повърхността му е около 5,500°C, а в ядрото — около 15 милиона градуса.',
      en: 'The Sun is a G2V-type star at the center of the Solar System. It contains about 99.86% of the system\'s total mass. Its surface temperature is about 5,500°C, and its core reaches about 15 million degrees.',
    },
  },
  {
    category: 'science',
    keywords: ['вода', 'water', 'h2o', 'х2о'],
    response: {
      bg: 'Водата (H₂O) е химично съединение от два водородни атома и един кислороден атом. Тя покрива около 71% от повърхността на Земята и е необходима за всички известни форми на живот.',
      en: 'Water (H₂O) is a chemical compound of two hydrogen atoms and one oxygen atom. It covers about 71% of Earth\'s surface and is essential for all known forms of life.',
    },
  },
  {
    category: 'science',
    keywords: ['двигател', 'вътрешно горене', 'engine', 'combustion engine', 'двигател вътрешно'],
    response: {
      bg: 'Двигателят с вътрешно горене преобразува химическата енергия на горивото в механична работа чрез изгаряне на гориво в камера вътре в самия двигател. Изобретен е в края на 19 век.',
      en: 'The internal combustion engine converts the chemical energy of fuel into mechanical work by burning fuel inside the engine itself. It was invented in the late 19th century.',
    },
  },
  {
    category: 'geography',
    keywords: ['българия', 'bulgaria', 'българия къде', 'къде е българия'],
    response: {
      bg: 'България е държава в Югоизточна Европа, на Балканския полуостров. Граничи с Румъния, Сърбия, Северна Македония, Гърция и Турция. Столица е София. Населението е около 6.5 милиона души.',
      en: 'Bulgaria is a country in Southeast Europe, on the Balkan Peninsula. It borders Romania, Serbia, North Macedonia, Greece, and Turkey. The capital is Sofia. The population is about 6.5 million.',
    },
  },
  {
    category: 'geography',
    keywords: ['земя', 'earth', 'планетата', 'planet earth', 'планета земя'],
    response: {
      bg: 'Земята е третата планета от Слънцето и единствената известна планета, на която има живот. Радиусът ѝ е около 6,371 км, а възрастта — около 4.54 милиарда години. Има един естествен спътник — Луната.',
      en: 'Earth is the third planet from the Sun and the only known planet with life. Its radius is about 6,371 km, and it is about 4.54 billion years old. It has one natural satellite — the Moon.',
    },
  },
  {
    category: 'history',
    keywords: ['българия история', 'история на българия', 'bulgaria history', 'първата българска държава'],
    response: {
      bg: 'Първата българска държава е основана през 681 г. от хан Аспарух. България е една от най-старите държави в Европа. През вековете е преминала през Първо и Второ българско царство, османско владичество и възстановяване на независимостта през 1878 г.',
      en: 'The first Bulgarian state was founded in 681 AD by Khan Asparuh. Bulgaria is one of the oldest states in Europe. Through the centuries it went through the First and Second Bulgarian Empires, Ottoman rule, and restoration of independence in 1878.',
    },
  },
];

export function searchKnowledge(query: string, _lang: Language): KnowledgeEntry | null {
  const lower = query.toLowerCase();
  let best: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += kw.length; // longer matches score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 0 ? best : null;
}
