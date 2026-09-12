// ── Knowledge base: bilingual facts the AI can answer about ──

import { Language, tokenize } from './nlp.js';

export interface KnowledgeEntry {
  keywords: string[]; // match in either language
  response: { bg: string; en: string };
  category: string;
}

export const knowledgeBase: KnowledgeEntry[] = [
  // ── Self ──
  {
    category: 'self',
    keywords: ['sarverai', 'сарв', 'какво си ти', 'кой си ти', 'твоето име', 'who are you', 'what are you', 'your name', 'what is your name'],
    response: {
      bg: 'Аз съм SarverAI — независим изкуствен интелект, създаден да работи изцяло локално, без външни API-та или облачни услуги. Цялата ми обработка става на твоя сървър. 🧠',
      en: 'I am SarverAI — an independent artificial intelligence built to run entirely locally, without external APIs or cloud services. All my processing happens on your server. 🧠',
    },
  },
  {
    category: 'self',
    keywords: ['какво можеш', 'на какво си способен', 'какво умееш', 'what can you do', 'capabilities', 'features'],
    response: {
      bg: 'Мога да водя разговори, да отговарям на въпроси от моята база знания, да решавам математически изрази, да разказвам шеги, да давам мнения и да разпознавам емоции в текста. Работя на български и английски.',
      en: 'I can hold conversations, answer questions from my knowledge base, solve math expressions, tell jokes, give opinions, and detect emotions in text. I work in both Bulgarian and English.',
    },
  },
  // ── Technology ──
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
    keywords: ['node.js', 'nodejs', 'node js', 'нод', 'нод.жс'],
    response: {
      bg: 'Node.js е средище за изпълнение на JavaScript извън браузъра, създадено от Райан Дал през 2009 г. Използва V8 двигателя на Google и позволява изграждане на мащабируеми сървърни приложения.',
      en: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine, created by Ryan Dahl in 2009. It allows building scalable server-side applications using JavaScript.',
    },
  },
  {
    category: 'tech',
    keywords: ['typescript', 'тайпскрипт', 'type script'],
    response: {
      bg: 'TypeScript е надграждане на JavaScript, създадено от Microsoft през 2012 г. Добавя статично типизиране, което помага за откриване на грешки преди изпълнение и подобрява поддържаемостта на кода.',
      en: 'TypeScript is a superset of JavaScript, created by Microsoft in 2012. It adds static typing, which helps catch errors before runtime and improves code maintainability.',
    },
  },
  {
    category: 'tech',
    keywords: ['html', 'хтмл', 'hypertext markup'],
    response: {
      bg: 'HTML (HyperText Markup Language) е стандартният маркиращ език за създаване на уеб страници. Описва структурата на страницата чрез елементи (тагове), които браузърът визуализира.',
      en: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the page structure using elements (tags) that the browser renders.',
    },
  },
  {
    category: 'tech',
    keywords: ['css', 'цсс', 'cascading style', 'стилове'],
    response: {
      bg: 'CSS (Cascading Style Sheets) е език за стилизиране на уеб страници. Определя как HTML елементите се визуализират — цветове, шрифтове, разположение и анимации.',
      en: 'CSS (Cascading Style Sheets) is a style sheet language for styling web pages. It controls how HTML elements are displayed — colors, fonts, layout, and animations.',
    },
  },
  {
    category: 'tech',
    keywords: ['ai', 'изкуствен интелект', 'artificial intelligence', 'ии', 'какво е ии', 'what is ai'],
    response: {
      bg: 'Изкуственият интелект (ИИ) е област от компютърните науки, която се занимава със създаването на системи, способни да изпълняват задачи, които изискват човешки интелект — разпознаване на образи, разбиране на език, вземане на решения и учене.',
      en: 'Artificial Intelligence (AI) is a field of computer science focused on creating systems capable of performing tasks that require human intelligence — pattern recognition, language understanding, decision-making, and learning.',
    },
  },
  {
    category: 'tech',
    keywords: ['базата данни', 'database', 'база данни', 'sql', 'nosql'],
    response: {
      bg: 'Базата данни е организирана колекция от информация, съхранявана електронно. Основните типове са релационни (SQL — като PostgreSQL, MySQL) и нерелационни (NoSQL — като MongoDB, Redis). Базите данни позволяват ефективно съхранение, търсене и управление на данни.',
      en: 'A database is an organized collection of information stored electronically. The main types are relational (SQL — like PostgreSQL, MySQL) and non-relational (NoSQL — like MongoDB, Redis). Databases allow efficient storage, search, and management of data.',
    },
  },
  {
    category: 'tech',
    keywords: ['интернет', 'internet', 'как работи интернет', 'how does the internet work'],
    response: {
      bg: 'Интернет е глобална мрежа от свързани компютри, които обменят данни чрез протоколи като TCP/IP. Всеки компютър има IP адрес, а DNS системата преобразува домейни (напр. google.com) в IP адреси. Данните се разделят на пакети и пътуват през маршрутизатори до местоназначението си.',
      en: 'The internet is a global network of connected computers that exchange data using protocols like TCP/IP. Each computer has an IP address, and the DNS system translates domains (e.g. google.com) into IP addresses. Data is split into packets and travels through routers to its destination.',
    },
  },
  // ── Science ──
  {
    category: 'science',
    keywords: ['слънце', 'sun', 'звезда слънце', 'the sun'],
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
    keywords: ['гравитация', 'gravity', 'гравитационна сила', 'what is gravity'],
    response: {
      bg: 'Гравитацията е фундаментална сила, която привлича обектите с маса един към друг. На Земята тя ни държи на повърхността и придава тегло на телата. Законът за всемирното привличане е формулиран от Исак Нютон през 1687 г.',
      en: 'Gravity is a fundamental force that attracts objects with mass toward each other. On Earth, it keeps us on the surface and gives weight to objects. The law of universal gravitation was formulated by Isaac Newton in 1687.',
    },
  },
  {
    category: 'science',
    keywords: ['атом', 'atom', 'atoms', 'атоми', 'какво е атом', 'what is an atom'],
    response: {
      bg: 'Атомът е най-малката частица на химичен елемент, която запазва свойствата му. Състои се от ядро (протони и неутрони) и електрони, които се движат около него. Първата моделна теория на атома е предложена от Джон Далтон в началото на 19 век.',
      en: 'An atom is the smallest particle of a chemical element that retains its properties. It consists of a nucleus (protons and neutrons) and electrons orbiting around it. The first atomic theory was proposed by John Dalton in the early 19th century.',
    },
  },
  {
    category: 'science',
    keywords: ['двигател', 'вътрешно горене', 'engine', 'combustion engine', 'двигател вътрешно горене'],
    response: {
      bg: 'Двигателят с вътрешно горене преобразува химическата енергия на горивото в механична работа чрез изгаряне на гориво в камера вътре в самия двигател. Изобретен е в края на 19 век.',
      en: 'The internal combustion engine converts the chemical energy of fuel into mechanical work by burning fuel inside the engine itself. It was invented in the late 19th century.',
    },
  },
  {
    category: 'science',
    keywords: ['фотосинтеза', 'photosynthesis', 'фотосинтезата'],
    response: {
      bg: 'Фотосинтезата е процес, при който растенията преобразуват слънчевата светлина, водата и въглеродния диоксид в глюкоза и кислород. Тя е основен източник на кислород в атмосферата и основа на хранителната верига на Земята.',
      en: 'Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into glucose and oxygen. It is the main source of oxygen in the atmosphere and the foundation of Earth\'s food chain.',
    },
  },
  // ── Geography ──
  {
    category: 'geography',
    keywords: ['българия', 'bulgaria', 'къде е българия', 'за българия', 'about bulgaria'],
    response: {
      bg: 'България е държава в Югоизточна Европа, на Балканския полуостров. Граничи с Румъния, Сърбия, Северна Македония, Гърция и Турция. Столица е София. Населението е около 6.5 милиона души.',
      en: 'Bulgaria is a country in Southeast Europe, on the Balkan Peninsula. It borders Romania, Serbia, North Macedonia, Greece, and Turkey. The capital is Sofia. The population is about 6.5 million.',
    },
  },
  {
    category: 'geography',
    keywords: ['софия', 'sofia', 'столицата на българия', 'capital of bulgaria'],
    response: {
      bg: 'София е столицата и най-големият град на България. Намира се в подножието на планина Витоша. Една от най-старите столици в Европа — основана преди повече от 2000 години като римския град Сердика. Населението е около 1.2 милиона души.',
      en: 'Sofia is the capital and largest city of Bulgaria. It is located at the foot of Mount Vitosha. One of the oldest capitals in Europe — founded over 2000 years ago as the Roman city of Serdica. The population is about 1.2 million.',
    },
  },
  {
    category: 'geography',
    keywords: ['земя', 'earth', 'планетата', 'planet earth', 'планета земя', 'the earth'],
    response: {
      bg: 'Земята е третата планета от Слънцето и единствената известна планета, на която има живот. Радиусът ѝ е около 6,371 км, а възрастта — около 4.54 милиарда години. Има един естествен спътник — Луната.',
      en: 'Earth is the third planet from the Sun and the only known planet with life. Its radius is about 6,371 km, and it is about 4.54 billion years old. It has one natural satellite — the Moon.',
    },
  },
  {
    category: 'geography',
    keywords: ['луна', 'moon', 'the moon', 'луната', 'спътник луна'],
    response: {
      bg: 'Луната е единственият естествен спътник на Земята. Тя е на около 384,400 км от нас. Гравитацията ѝ предизвиква приливите и отливите в океаните. Луната е в приливно заключение — винаги показва едната си страна към Земята.',
      en: 'The Moon is Earth\'s only natural satellite. It is about 384,400 km away. Its gravity causes ocean tides. The Moon is tidally locked — it always shows the same side to Earth.',
    },
  },
  // ── History ──
  {
    category: 'history',
    keywords: ['българия история', 'история на българия', 'bulgaria history', 'първата българска държава', 'българска история'],
    response: {
      bg: 'Първата българска държава е основана през 681 г. от хан Аспарух. България е една от най-старите държави в Европа. През вековете е преминала през Първо и Второ българско царство, османско владичество и възстановяване на независимостта през 1878 г.',
      en: 'The first Bulgarian state was founded in 681 AD by Khan Asparuh. Bulgaria is one of the oldest states in Europe. Through the centuries it went through the First and Second Bulgarian Empires, Ottoman rule, and restoration of independence in 1878.',
    },
  },
  {
    category: 'history',
    keywords: ['кирилица', 'cyrillic', 'кирилска азбука', 'cyrillic alphabet'],
    response: {
      bg: 'Кирилицата е азбука, създадена през 9 век от учениците на светите братя Кирил и Методий — Климент, Наум и Ангеларий. Днес се използва от над 250 милиона души по света, включително в България, Русия, Сърбия, Украйна и други.',
      en: 'Cyrillic is an alphabet created in the 9th century by the disciples of Saints Cyril and Methodius — Clement, Naum, and Angelar. Today it is used by over 250 million people worldwide, including in Bulgaria, Russia, Serbia, Ukraine, and others.',
    },
  },
  // ── General ──
  {
    category: 'general',
    keywords: ['езици', 'languages', 'programming languages', 'езици за програмиране', 'програмни езици'],
    response: {
      bg: 'Езиците за програмиране са формални езици за задаване на инструкции на компютър. Най-популярните днес са JavaScript, Python, Java, C++, C#, TypeScript и Go. Всеки има своите предимства — JavaScript за уеб, Python за AI и наука, C++ за системи с висока производителност.',
      en: 'Programming languages are formal languages for giving instructions to a computer. The most popular today are JavaScript, Python, Java, C++, C#, TypeScript, and Go. Each has its strengths — JavaScript for web, Python for AI and science, C++ for high-performance systems.',
    },
  },
  {
    category: 'general',
    keywords: ['време', 'weather', 'времето', 'какво е времето'],
    response: {
      bg: 'За жалост, нямам сензори за реално време, така че не мога да ти кажа какво е времето навън. Мога да ти обясня как се образува времето — то зависи от температурата, влажността, налягането и движението на въздушните маси в атмосферата. ☀️🌧️',
      en: 'Unfortunately, I don\'t have real-time sensors, so I can\'t tell you the weather outside. I can explain how weather forms — it depends on temperature, humidity, pressure, and the movement of air masses in the atmosphere. ☀️🌧️',
    },
  },
];

export function searchKnowledge(query: string, _lang: Language): KnowledgeEntry | null {
  const lower = query.toLowerCase();
  const queryTokens = tokenize(query);
  let best: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();
      // Direct substring match (strong signal)
      if (lower.includes(kwLower)) {
        score += kw.length;
      }
      // Token overlap (weaker signal)
      const kwTokens = tokenize(kw);
      for (const kwt of kwTokens) {
        if (queryTokens.includes(kwt)) {
          score += kwt.length * 0.5;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 3 ? best : null;
}
