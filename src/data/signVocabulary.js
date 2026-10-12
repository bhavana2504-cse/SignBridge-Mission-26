import { VIDEO_MAPPINGS, getVideoPath } from './videoMapping';

/**
 * Standard Categories in SignBridge ISL Curriculum
 */
export const CATEGORIES = [
  'Everyday Communication',
  'People and Family',
  'Food and Drinks',
  'Places',
  'Actions',
  'Questions'
];

/**
 * Verified Initial Vocabulary (40 Signs)
 * Data-driven definitions with reliable usage notes and verified video references.
 */
export const SIGN_VOCABULARY = [
  // 1. Everyday Communication
  {
    id: 'hello',
    word: 'Hello',
    category: 'Everyday Communication',
    videoFile: VIDEO_MAPPINGS.hello,
    videoPath: getVideoPath('hello'),
    sourceDataset: 'ISL500',
    description: 'A standard opening greeting used when meeting or addressing someone.',
    example: 'Hello! Welcome to our class.',
    difficulty: 'Beginner',
    tags: ['greeting', 'welcome', 'hi', 'start']
  },
  {
    id: 'goodbye',
    word: 'Goodbye',
    category: 'Everyday Communication',
    videoFile: VIDEO_MAPPINGS.goodbye,
    videoPath: getVideoPath('goodbye'),
    sourceDataset: 'CISLR',
    description: 'A polite parting gesture used when leaving or closing a conversation.',
    example: 'Goodbye, see you again tomorrow!',
    difficulty: 'Beginner',
    tags: ['farewell', 'bye', 'parting', 'leave']
  },
  {
    id: 'thank-you',
    word: 'Thank You',
    category: 'Everyday Communication',
    videoFile: VIDEO_MAPPINGS.thank_you,
    videoPath: getVideoPath('thank_you'),
    sourceDataset: 'CISLR',
    description: 'A courteous expression acknowledging gratitude, kindness, or help received.',
    example: 'Thank you for explaining the directions.',
    difficulty: 'Beginner',
    tags: ['thanks', 'gratitude', 'polite', 'appreciation']
  },
  {
    id: 'sorry',
    word: 'Sorry',
    category: 'Everyday Communication',
    videoFile: VIDEO_MAPPINGS.sorry,
    videoPath: getVideoPath('sorry'),
    sourceDataset: 'CISLR',
    description: 'A gesture expressing sincere apology, regret, or sympathy.',
    example: 'I am sorry for the misunderstanding.',
    difficulty: 'Beginner',
    tags: ['apology', 'regret', 'pardon', 'excuse']
  },
  {
    id: 'please',
    word: 'Please',
    category: 'Everyday Communication',
    videoFile: VIDEO_MAPPINGS.please,
    videoPath: getVideoPath('please'),
    sourceDataset: 'CISLR',
    description: 'A polite conversational sign used when requesting assistance or making an ask.',
    example: 'Please repeat the last sentence.',
    difficulty: 'Beginner',
    tags: ['request', 'polite', 'ask', 'courtesy']
  },
  {
    id: 'yes',
    word: 'Yes',
    category: 'Everyday Communication',
    videoFile: VIDEO_MAPPINGS.yes,
    videoPath: getVideoPath('yes'),
    sourceDataset: 'CISLR',
    description: 'Sign signifying affirmation, consent, agreement, or positive answer.',
    example: 'Yes, I am ready to start the quiz.',
    difficulty: 'Beginner',
    tags: ['agree', 'affirm', 'correct', 'true']
  },
  {
    id: 'no',
    word: 'No',
    category: 'Everyday Communication',
    videoFile: VIDEO_MAPPINGS.no,
    videoPath: getVideoPath('no'),
    sourceDataset: 'CISLR',
    description: 'Sign signifying negation, denial, refusal, or negative response.',
    example: 'No, this is not my bag.',
    difficulty: 'Beginner',
    tags: ['negation', 'disagree', 'false', 'deny']
  },
  {
    id: 'help',
    word: 'Help',
    category: 'Everyday Communication',
    videoFile: VIDEO_MAPPINGS.help,
    videoPath: getVideoPath('help'),
    sourceDataset: 'CISLR',
    description: 'Essential sign for offering or urgently requesting assistance.',
    example: 'Can someone please help me find the room?',
    difficulty: 'Beginner',
    tags: ['support', 'assist', 'emergency', 'aid']
  },
  {
    id: 'stop',
    word: 'Stop',
    category: 'Everyday Communication',
    videoFile: VIDEO_MAPPINGS.stop,
    videoPath: getVideoPath('stop'),
    sourceDataset: 'CISLR',
    description: 'Sign indicating a pause, halting an ongoing motion, or calling for an immediate break.',
    example: 'Please stop here for a moment.',
    difficulty: 'Beginner',
    tags: ['halt', 'pause', 'wait', 'cease']
  },
  {
    id: 'okay',
    word: 'Okay',
    category: 'Everyday Communication',
    videoFile: VIDEO_MAPPINGS.okay,
    videoPath: getVideoPath('okay'),
    sourceDataset: 'CISLR',
    description: 'Sign signaling agreement, readiness, satisfaction, or general confirmation.',
    example: 'Okay, everything is set for the presentation.',
    difficulty: 'Beginner',
    tags: ['alright', 'fine', 'ok', 'ready']
  },
  {
    id: 'today',
    word: 'Today',
    category: 'Everyday Communication',
    videoFile: VIDEO_MAPPINGS.today,
    videoPath: getVideoPath('today'),
    sourceDataset: 'CISLR',
    description: 'Sign indicating the current present day and immediate timeframe.',
    example: 'Today we are practicing 10 new signs.',
    difficulty: 'Beginner',
    tags: ['now', 'present', 'day', 'time']
  },

  // 2. People and Family
  {
    id: 'me',
    word: 'Me',
    category: 'People and Family',
    videoFile: VIDEO_MAPPINGS.me,
    videoPath: getVideoPath('me'),
    sourceDataset: 'CISLR',
    description: 'First person pronoun indicating oneself (I / me).',
    example: 'Look at me while I demonstrate the sign.',
    difficulty: 'Beginner',
    tags: ['i', 'myself', 'self', 'person']
  },
  {
    id: 'you',
    word: 'You',
    category: 'People and Family',
    videoFile: VIDEO_MAPPINGS.you,
    videoPath: getVideoPath('you'),
    sourceDataset: 'CISLR',
    description: 'Second person pronoun indicating the conversational partner.',
    example: 'You did a great job on that lesson!',
    difficulty: 'Beginner',
    tags: ['yourself', 'partner', 'listener']
  },
  {
    id: 'he',
    word: 'He',
    category: 'People and Family',
    videoFile: VIDEO_MAPPINGS.he,
    videoPath: getVideoPath('he'),
    sourceDataset: 'CISLR',
    description: 'Third person pronoun referring to an identified male person.',
    example: 'He is sitting in the front row.',
    difficulty: 'Beginner',
    tags: ['him', 'boy', 'man', 'person']
  },
  {
    id: 'she',
    word: 'She',
    category: 'People and Family',
    videoFile: VIDEO_MAPPINGS.she,
    videoPath: getVideoPath('she'),
    sourceDataset: 'CISLR',
    description: 'Third person pronoun referring to an identified female person.',
    example: 'She is practicing sign language in the library.',
    difficulty: 'Beginner',
    tags: ['her', 'girl', 'woman', 'person']
  },
  {
    id: 'mother',
    word: 'Mother',
    category: 'People and Family',
    videoFile: VIDEO_MAPPINGS.mother,
    videoPath: getVideoPath('mother'),
    sourceDataset: 'CISLR',
    description: 'Family relationship sign identifying one’s mother or female parent.',
    example: 'My mother taught me my first signs.',
    difficulty: 'Beginner',
    tags: ['mom', 'parent', 'family', 'relative']
  },
  {
    id: 'father',
    word: 'Father',
    category: 'People and Family',
    videoFile: VIDEO_MAPPINGS.father,
    videoPath: getVideoPath('father'),
    sourceDataset: 'CISLR',
    description: 'Family relationship sign identifying one’s father or male parent.',
    example: 'My father encourages me to learn ISL.',
    difficulty: 'Beginner',
    tags: ['dad', 'parent', 'family', 'relative']
  },
  {
    id: 'brother',
    word: 'Brother',
    category: 'People and Family',
    videoFile: VIDEO_MAPPINGS.brother,
    videoPath: getVideoPath('brother'),
    sourceDataset: 'CISLR',
    description: 'Family relationship sign for a male sibling.',
    example: 'My brother and I practice signing every evening.',
    difficulty: 'Beginner',
    tags: ['sibling', 'boy', 'family', 'relative']
  },
  {
    id: 'sister',
    word: 'Sister',
    category: 'People and Family',
    videoFile: VIDEO_MAPPINGS.sister,
    videoPath: getVideoPath('sister'),
    sourceDataset: 'CISLR',
    description: 'Family relationship sign for a female sibling.',
    example: 'Her sister is also studying Indian Sign Language.',
    difficulty: 'Beginner',
    tags: ['sibling', 'girl', 'family', 'relative']
  },
  {
    id: 'friend',
    word: 'Friend',
    category: 'People and Family',
    videoFile: VIDEO_MAPPINGS.friend,
    videoPath: getVideoPath('friend'),
    sourceDataset: 'CISLR',
    description: 'Sign representing companionship, peer connection, and friendship.',
    example: 'She is my closest friend from college.',
    difficulty: 'Beginner',
    tags: ['peer', 'buddy', 'companion', 'relationship']
  },
  {
    id: 'teacher',
    word: 'Teacher',
    category: 'People and Family',
    videoFile: VIDEO_MAPPINGS.teacher,
    videoPath: getVideoPath('teacher'),
    sourceDataset: 'CISLR',
    description: 'Sign designating an educator, instructor, or mentor.',
    example: 'The teacher shared helpful feedback after practice.',
    difficulty: 'Beginner',
    tags: ['instructor', 'educator', 'mentor', 'school']
  },
  {
    id: 'student',
    word: 'Student',
    category: 'People and Family',
    videoFile: VIDEO_MAPPINGS.student,
    videoPath: getVideoPath('student'),
    sourceDataset: 'CISLR',
    description: 'Sign designating a learner, scholar, or enrolled pupil.',
    example: 'Every student can learn beginner ISL signs.',
    difficulty: 'Beginner',
    tags: ['learner', 'pupil', 'college', 'school']
  },

  // 3. Food and Drinks
  {
    id: 'food',
    word: 'Food',
    category: 'Food and Drinks',
    videoFile: VIDEO_MAPPINGS.food,
    videoPath: getVideoPath('food'),
    sourceDataset: 'CISLR',
    description: 'General sign for meals, nourishment, and cooked dishes.',
    example: 'The food is ready to be served.',
    difficulty: 'Beginner',
    tags: ['meal', 'dish', 'diet', 'lunch', 'dinner']
  },
  {
    id: 'water',
    word: 'Water',
    category: 'Food and Drinks',
    videoFile: VIDEO_MAPPINGS.water,
    videoPath: getVideoPath('water'),
    sourceDataset: 'CISLR',
    description: 'Essential sign indicating drinking water or hydration.',
    example: 'Please offer clean drinking water to our guest.',
    difficulty: 'Beginner',
    tags: ['drink', 'liquid', 'hydration', 'thirst']
  },
  {
    id: 'drink',
    word: 'Drink',
    category: 'Food and Drinks',
    videoFile: VIDEO_MAPPINGS.drink,
    videoPath: getVideoPath('drink'),
    sourceDataset: 'ISL500',
    description: 'Sign representing the physical action of sipping or drinking beverages.',
    example: 'Drink some water before we continue.',
    difficulty: 'Beginner',
    tags: ['sip', 'beverage', 'liquid', 'action']
  },
  {
    id: 'eat',
    word: 'Eat',
    category: 'Food and Drinks',
    videoFile: VIDEO_MAPPINGS.eat,
    videoPath: getVideoPath('eat'),
    sourceDataset: 'CISLR',
    description: 'Sign representing the physical action of chewing and having a meal.',
    example: 'Let us eat lunch together in the cafeteria.',
    difficulty: 'Beginner',
    tags: ['meal', 'consume', 'bite', 'action']
  },
  {
    id: 'tea',
    word: 'Tea',
    category: 'Food and Drinks',
    videoFile: VIDEO_MAPPINGS.tea,
    videoPath: getVideoPath('tea'),
    sourceDataset: 'CISLR',
    description: 'Popular beverage sign for tea or chai.',
    example: 'Would you prefer hot tea or warm water?',
    difficulty: 'Beginner',
    tags: ['chai', 'beverage', 'hot drink', 'cup']
  },

  // 4. Places
  {
    id: 'home',
    word: 'Home',
    category: 'Places',
    videoFile: VIDEO_MAPPINGS.home,
    videoPath: getVideoPath('home'),
    sourceDataset: 'CISLR',
    description: 'Sign designating one’s residence, house, or family living space.',
    example: 'I am returning home after finishing the hackathon.',
    difficulty: 'Beginner',
    tags: ['house', 'residence', 'family', 'living']
  },
  {
    id: 'school',
    word: 'School',
    category: 'Places',
    videoFile: VIDEO_MAPPINGS.school,
    videoPath: getVideoPath('school'),
    sourceDataset: 'CISLR',
    description: 'Sign indicating a school, learning center, or academic building.',
    example: 'The school has an inclusive sign language program.',
    difficulty: 'Beginner',
    tags: ['academy', 'education', 'classroom', 'institute']
  },
  {
    id: 'hospital',
    word: 'Hospital',
    category: 'Places',
    videoFile: VIDEO_MAPPINGS.hospital,
    videoPath: getVideoPath('hospital'),
    sourceDataset: 'CISLR',
    description: 'Crucial sign indicating a healthcare facility, clinic, or medical center.',
    example: 'SignBridge helps healthcare staff communicate at the hospital.',
    difficulty: 'Beginner',
    tags: ['medical', 'clinic', 'doctor', 'health', 'emergency']
  },
  {
    id: 'market',
    word: 'Market',
    category: 'Places',
    videoFile: VIDEO_MAPPINGS.market,
    videoPath: getVideoPath('market'),
    sourceDataset: 'CISLR',
    description: 'Sign indicating a market, shopping bazaar, or grocery store.',
    example: 'We bought fresh groceries at the local market.',
    difficulty: 'Beginner',
    tags: ['bazaar', 'shop', 'store', 'grocery']
  },

  // 5. Actions
  {
    id: 'come',
    word: 'Come',
    category: 'Actions',
    videoFile: VIDEO_MAPPINGS.come,
    videoPath: getVideoPath('come'),
    sourceDataset: 'CISLR',
    description: 'Directional action sign beckoning or inviting someone to approach.',
    example: 'Come join our study circle.',
    difficulty: 'Beginner',
    tags: ['approach', 'arrive', 'join', 'motion']
  },
  {
    id: 'go',
    word: 'Go',
    category: 'Actions',
    videoFile: VIDEO_MAPPINGS.go,
    videoPath: getVideoPath('go'),
    sourceDataset: 'CISLR',
    description: 'Directional action sign indicating moving away or departing.',
    example: 'It is time to go to the auditorium.',
    difficulty: 'Beginner',
    tags: ['depart', 'leave', 'move', 'motion']
  },
  {
    id: 'sit',
    word: 'Sit',
    category: 'Actions',
    videoFile: VIDEO_MAPPINGS.sit,
    videoPath: getVideoPath('sit'),
    sourceDataset: 'CISLR',
    description: 'Sign instructing or describing resting in a seated position.',
    example: 'Please sit comfortably and watch the screen.',
    difficulty: 'Beginner',
    tags: ['seated', 'chair', 'rest', 'posture']
  },
  {
    id: 'stand',
    word: 'Stand',
    category: 'Actions',
    videoFile: VIDEO_MAPPINGS.stand,
    videoPath: getVideoPath('stand'),
    sourceDataset: 'CISLR',
    description: 'Sign instructing or describing rising to an upright standing posture.',
    example: 'Please stand up when you are ready to sign.',
    difficulty: 'Beginner',
    tags: ['rise', 'upright', 'posture', 'feet']
  },
  {
    id: 'read',
    word: 'Read',
    category: 'Actions',
    videoFile: VIDEO_MAPPINGS.read,
    videoPath: getVideoPath('read'),
    sourceDataset: 'CISLR',
    description: 'Sign representing scanning and reading text or written words.',
    example: 'Read each question carefully before choosing your answer.',
    difficulty: 'Beginner',
    tags: ['book', 'text', 'study', 'literature']
  },
  {
    id: 'write',
    word: 'Write',
    category: 'Actions',
    videoFile: VIDEO_MAPPINGS.write,
    videoPath: getVideoPath('write'),
    sourceDataset: 'CISLR',
    description: 'Sign representing the act of writing, taking notes, or jotting down words.',
    example: 'Write down new signs in your practice journal.',
    difficulty: 'Beginner',
    tags: ['pen', 'notes', 'record', 'paper']
  },

  // 6. Questions
  {
    id: 'what',
    word: 'What',
    category: 'Questions',
    videoFile: VIDEO_MAPPINGS.what,
    videoPath: getVideoPath('what'),
    sourceDataset: 'CISLR',
    description: 'Core question sign asking for identity, description, or clarifying info.',
    example: 'What is the sign for "hospital"?',
    difficulty: 'Beginner',
    tags: ['question', 'inquiry', 'clarify']
  },
  {
    id: 'where',
    word: 'Where',
    category: 'Questions',
    videoFile: VIDEO_MAPPINGS.where,
    videoPath: getVideoPath('where'),
    sourceDataset: 'CISLR',
    description: 'Question sign inquiring about a place, location, or destination.',
    example: 'Where can I find the nearest bus stand?',
    difficulty: 'Beginner',
    tags: ['location', 'place', 'direction', 'question']
  },
  {
    id: 'when',
    word: 'When',
    category: 'Questions',
    videoFile: VIDEO_MAPPINGS.when,
    videoPath: getVideoPath('when'),
    sourceDataset: 'CISLR',
    description: 'Question sign inquiring about time, timing, schedule, or date.',
    example: 'When does the quiz session start?',
    difficulty: 'Beginner',
    tags: ['time', 'schedule', 'date', 'question']
  }
];
