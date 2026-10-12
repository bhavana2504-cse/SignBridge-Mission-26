/**
 * SignBridge - Indian Sign Language Infographic Guides Dataset
 * Extracted from 'ISL Help Sign Language Guide.zip'
 * 
 * Contains 17 illustrated educational guides:
 * - 15 Phrase/Question Step-by-Step Breakdown Infographics
 * - 1 Fingerspelling Alphabet Chart (A-Z)
 * - 1 Number Chart (0-9)
 */

export const GUIDE_CATEGORIES = [
  'All',
  'Common Phrases',
  'Questions',
  'Alphabet & Numbers',
  'Conversations'
];

export const SIGN_GUIDES = [
  // 1. Alphabet Fingerspelling Chart
  {
    id: 'guide_alphabets',
    phrase: 'English Alphabets in ISL',
    category: 'Alphabet & Numbers',
    badge: 'Fingerspelling Chart',
    imageFile: 'WhatsApp Image 2026-10-12 at 2.42.21 PM.jpeg',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('WhatsApp Image 2026-10-12 at 2.42.21 PM.jpeg'),
    altText: 'Complete chart of 26 English Alphabets from A to Z illustrated in Indian Sign Language with handshapes.',
    description: 'Master the 26 Indian Sign Language handshapes for English letters A to Z. Uses two-handed and single-handed signs essential for fingerspelling names and technical terms.',
    connectedSignId: null, // General foundation chart
    tags: ['alphabet', 'letters', 'fingerspelling', 'basics', 'a-z', 'spelling']
  },

  // 2. Numbers Chart
  {
    id: 'guide_numbers',
    phrase: 'Numbers in ISL (0 to 9)',
    category: 'Alphabet & Numbers',
    badge: 'Numerals Chart',
    imageFile: 'WhatsApp Image 2026-10-12 at 2.34.19 PM.jpeg',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('WhatsApp Image 2026-10-12 at 2.34.19 PM.jpeg'),
    altText: 'Illustrated Indian Sign Language counting numbers chart showing hand gestures for digits 0 through 9.',
    description: 'Illustrated guide displaying exact finger configurations for numbers 0 through 9 in Indian Sign Language for counting, time, and quantities.',
    connectedSignId: null,
    tags: ['numbers', 'counting', 'digits', 'basics', '0-9', 'math']
  },

  // 3. Help (matches existing video lesson: 'help')
  {
    id: 'guide_help',
    phrase: 'Help',
    category: 'Common Phrases',
    badge: 'Emergency & Aid',
    imageFile: 'ISL Help Sign Language Guide.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('ISL Help Sign Language Guide.png'),
    altText: 'Step-by-step illustrated guide showing how to sign Help in Indian Sign Language.',
    description: 'Detailed illustrated breakdown of the sign for "Help" in ISL, showing hand positioning, supportive upward movement, and expressive cues.',
    connectedSignId: 'help',
    tags: ['help', 'assist', 'emergency', 'support', 'aid']
  },

  // 4. Thank You - Guide 1 (matches existing video lesson: 'thank-you')
  {
    id: 'guide_thank_you_1',
    phrase: 'Thank You (Step Guide)',
    category: 'Common Phrases',
    badge: 'Courtesy & Politeness',
    imageFile: 'Indian Sign Language_ Thank You Guide.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('Indian Sign Language_ Thank You Guide.png'),
    altText: 'Step-by-step visual tutorial showing how to sign Thank You in Indian Sign Language.',
    description: 'Step-by-step guide explaining the hand shape moving from chin forward to express gratitude and appreciation in ISL.',
    connectedSignId: 'thank-you',
    tags: ['thank you', 'thanks', 'gratitude', 'polite', 'courtesy']
  },

  // 5. Thank You - Guide 2 (alternate variation)
  {
    id: 'guide_thank_you_2',
    phrase: 'Thank You (Expression & Usage)',
    category: 'Common Phrases',
    badge: 'Conversational Sign',
    imageFile: 'Thank You in Indian Sign Language.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('Thank You in Indian Sign Language.png'),
    altText: 'Visual infographic detailing the Thank You gesture in Indian Sign Language with friendly expression.',
    description: 'Complementary illustrated infographic detailing the movement arc and warm facial expression for signing Thank You.',
    connectedSignId: 'thank-you',
    tags: ['thank you', 'thanks', 'gratitude', 'polite', 'appreciation']
  },

  // 6. Sorry (matches existing video lesson: 'sorry')
  {
    id: 'guide_sorry',
    phrase: 'Sorry',
    category: 'Common Phrases',
    badge: 'Courtesy & Politeness',
    imageFile: 'Indian Sign Language_ Sorry.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('Indian Sign Language_ Sorry.png'),
    altText: 'Visual guide explaining how to sign Sorry in Indian Sign Language.',
    description: 'Illustrated guide showing circular hand movement over the chest with an apologetic facial expression in Indian Sign Language.',
    connectedSignId: 'sorry',
    tags: ['sorry', 'apology', 'regret', 'pardon', 'excuse']
  },

  // 7. Please (matches existing video lesson: 'please')
  {
    id: 'guide_please',
    phrase: 'Please',
    category: 'Common Phrases',
    badge: 'Courtesy & Politeness',
    imageFile: 'Indian Sign Language_ Please Gesture.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('Indian Sign Language_ Please Gesture.png'),
    altText: 'Illustrated guide demonstrating the Please sign gesture in Indian Sign Language.',
    description: 'Step-by-step illustrated breakdown for signing "Please" politely in everyday Indian Sign Language communication.',
    connectedSignId: 'please',
    tags: ['please', 'request', 'polite', 'ask', 'courtesy']
  },

  // 8. Excuse Me
  {
    id: 'guide_excuse_me',
    phrase: 'Excuse Me',
    category: 'Common Phrases',
    badge: 'Courtesy & Politeness',
    imageFile: 'Indian Sign Language_ Excuse Me.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('Indian Sign Language_ Excuse Me.png'),
    altText: 'Illustrated breakdown of the Excuse Me gesture in Indian Sign Language.',
    description: 'Visual steps to politely capture attention, excuse oneself, or pass by politely using Indian Sign Language.',
    connectedSignId: null,
    tags: ['excuse me', 'pardon', 'polite', 'attention', 'courtesy']
  },

  // 9. How Are You?
  {
    id: 'guide_how_are_you',
    phrase: 'How Are You?',
    category: 'Conversations',
    badge: 'Everyday Sentence',
    imageFile: 'How Are You_ Indian Sign Language Guide.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('How Are You_ Indian Sign Language Guide.png'),
    altText: 'Illustrated infographic for signing How Are You in Indian Sign Language with step-by-step breakdown: HOW + YOU + ARE.',
    description: 'Comprehensive 4-step infographic breaking down HOW + YOU + ARE, finger orientation, questioning facial cues, and practical tips.',
    connectedSignId: 'you', // shares the YOU gesture
    tags: ['how are you', 'greeting', 'well-being', 'conversation', 'question', 'meeting']
  },

  // 10. I Am Fine
  {
    id: 'guide_i_am_fine',
    phrase: 'I Am Fine',
    category: 'Conversations',
    badge: 'Conversational Response',
    imageFile: 'Indian Sign Language_ I Am Fine.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('Indian Sign Language_ I Am Fine.png'),
    altText: 'Illustrated guide on signing I Am Fine in Indian Sign Language.',
    description: 'Friendly response guide demonstrating handshape and upbeat facial expression when responding to greetings in ISL.',
    connectedSignId: null,
    tags: ['i am fine', 'fine', 'good', 'reply', 'feeling', 'conversation']
  },

  // 11. Nice to Meet You
  {
    id: 'guide_nice_to_meet_you',
    phrase: 'Nice to Meet You',
    category: 'Conversations',
    badge: 'Introduction & Greeting',
    imageFile: 'Nice to Meet You_ ISL Sign Guide.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('Nice to Meet You_ ISL Sign Guide.png'),
    altText: 'Illustrated steps for signing Nice to Meet You in Indian Sign Language.',
    description: 'Visual demonstration of combining the signs for "Nice", "Meet", and "You" to introduce oneself warmly in ISL.',
    connectedSignId: 'you',
    tags: ['nice to meet you', 'meet', 'greeting', 'introduction', 'welcome']
  },

  // 12. I Don’t Understand
  {
    id: 'guide_i_dont_understand',
    phrase: "I Don't Understand",
    category: 'Conversations',
    badge: 'Classroom & Clarification',
    imageFile: 'ISL Lesson_ I Don’t Understand.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('ISL Lesson_ I Don’t Understand.png'),
    altText: 'Illustrated guide on how to sign I Don’t Understand in Indian Sign Language.',
    description: 'Essential clarification phrase for learners to signal when they need a sentence or sign repeated or explained.',
    connectedSignId: null,
    tags: ['understand', 'repeat', 'learning', 'clarification', 'questions']
  },

  // 13. What Is Your Name?
  {
    id: 'guide_what_is_your_name',
    phrase: 'What Is Your Name?',
    category: 'Questions',
    badge: 'Personal Introduction',
    imageFile: 'Indian Sign Language_ What Is Your Name_.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('Indian Sign Language_ What Is Your Name_.png'),
    altText: 'Illustrated steps for asking What Is Your Name in Indian Sign Language.',
    description: 'Standard introduction question combining the signs for YOUR, NAME, and WHAT with an inquisitive eyebrow raise.',
    connectedSignId: 'what',
    tags: ['what', 'name', 'introduction', 'question', 'identity']
  },

  // 14. What Is This?
  {
    id: 'guide_what_is_this',
    phrase: 'What Is This?',
    category: 'Questions',
    badge: 'Inquiry & Learning',
    imageFile: 'Indian Sign Language_ What Is This_.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('Indian Sign Language_ What Is This_.png'),
    altText: 'Illustrated infographic for signing What Is This in Indian Sign Language.',
    description: 'Practical object-inquiry gesture combining pointing to an object with the questioning WHAT sign.',
    connectedSignId: 'what',
    tags: ['what', 'this', 'question', 'object', 'inquiry', 'learn']
  },

  // 15. What Is Your Age?
  {
    id: 'guide_what_is_your_age',
    phrase: 'What Is Your Age?',
    category: 'Questions',
    badge: 'Social Inquiry',
    imageFile: 'Indian Sign Language_ What Is Your Age_.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('Indian Sign Language_ What Is Your Age_.png'),
    altText: 'Illustrated tutorial for signing What Is Your Age in Indian Sign Language.',
    description: 'Clear illustrated steps explaining the chin-touch AGE sign combined with the question marker.',
    connectedSignId: 'what',
    tags: ['age', 'years', 'old', 'question', 'what', 'birthday']
  },

  // 16. Where Is the Washroom?
  {
    id: 'guide_where_is_washroom',
    phrase: 'Where Is the Washroom?',
    category: 'Questions',
    badge: 'Essential Facility Question',
    imageFile: 'ISL Guide_ Where Is the Washroom_.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('ISL Guide_ Where Is the Washroom_.png'),
    altText: 'Illustrated steps for signing Where Is the Washroom in Indian Sign Language.',
    description: 'Crucial everyday navigational sign combining the "W" washroom handshape with the palm-up questioning WHERE gesture.',
    connectedSignId: 'where',
    tags: ['washroom', 'toilet', 'restroom', 'where', 'location', 'facility']
  },

  // 17. Where Are You From?
  {
    id: 'guide_where_are_you_from',
    phrase: 'Where Are You From?',
    category: 'Questions',
    badge: 'Social & Geographical Inquiry',
    imageFile: 'Where Are You From_ in ISL.png',
    imagePath: '/assets/isl-guides/' + encodeURIComponent('Where Are You From_ in ISL.png'),
    altText: 'Step-by-step visual guide for signing Where Are You From in Indian Sign Language.',
    description: 'Conversational sentence combining YOU + PLACE/FROM + WHERE to ask about a communication partner’s hometown or country.',
    connectedSignId: 'where',
    tags: ['where', 'from', 'city', 'place', 'origin', 'conversation']
  }
];

export const guideService = {
  getAllGuides() {
    return [...SIGN_GUIDES];
  },

  getCategories() {
    return [...GUIDE_CATEGORIES];
  },

  getGuideById(id) {
    if (!id) return null;
    return SIGN_GUIDES.find((g) => g.id === id) || null;
  },

  getGuidesBySignId(signId) {
    if (!signId) return [];
    return SIGN_GUIDES.filter((g) => g.connectedSignId === signId);
  },

  searchGuides(query = '', category = 'All') {
    let list = this.getAllGuides();
    if (category && category !== 'All') {
      list = list.filter((g) => g.category === category);
    }
    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter((g) => {
      const matchPhrase = g.phrase.toLowerCase().includes(q);
      const matchDesc = g.description.toLowerCase().includes(q);
      const matchBadge = g.badge && g.badge.toLowerCase().includes(q);
      const matchTags = g.tags && g.tags.some((t) => t.toLowerCase().includes(q));
      return matchPhrase || matchDesc || matchBadge || matchTags;
    });
  }
};
