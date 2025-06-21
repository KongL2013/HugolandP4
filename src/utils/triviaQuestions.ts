export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const triviaQuestions: TriviaQuestion[] = [
  // Easy Questions
  {
    id: '1',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    category: 'Geography',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'How many legs does a spider have?',
    options: ['6', '8', '10', '12'],
    correctAnswer: 1,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '3',
    question: 'What color do you get when you mix red and blue?',
    options: ['Green', 'Yellow', 'Purple', 'Orange'],
    correctAnswer: 2,
    category: 'Art',
    difficulty: 'easy'
  },
  {
    id: '4',
    question: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Earth', 'Mercury', 'Mars'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '5',
    question: 'What is 5 + 7?',
    options: ['11', '12', '13', '14'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'easy'
  },

  // Medium Questions
  {
    id: '6',
    question: 'Who wrote "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correctAnswer: 1,
    category: 'Literature',
    difficulty: 'medium'
  },
  {
    id: '7',
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'medium'
  },
  {
    id: '8',
    question: 'In which year did World War II end?',
    options: ['1944', '1945', '1946', '1947'],
    correctAnswer: 1,
    category: 'History',
    difficulty: 'medium'
  },
  {
    id: '9',
    question: 'What is the square root of 64?',
    options: ['6', '7', '8', '9'],
    correctAnswer: 2,
    category: 'Math',
    difficulty: 'medium'
  },
  {
    id: '10',
    question: 'Which ocean is the largest?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctAnswer: 3,
    category: 'Geography',
    difficulty: 'medium'
  },

  // Hard Questions
  {
    id: '11',
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Endoplasmic Reticulum'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'hard'
  },
  {
    id: '12',
    question: 'Who painted "The Starry Night"?',
    options: ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Claude Monet'],
    correctAnswer: 1,
    category: 'Art',
    difficulty: 'hard'
  },
  {
    id: '13',
    question: 'What is the derivative of x²?',
    options: ['x', '2x', 'x²', '2x²'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'hard'
  },
  {
    id: '14',
    question: 'Which programming language was created by Brendan Eich?',
    options: ['Python', 'Java', 'JavaScript', 'C++'],
    correctAnswer: 2,
    category: 'Technology',
    difficulty: 'hard'
  },
  {
    id: '15',
    question: 'What is the longest river in the world?',
    options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
    correctAnswer: 1,
    category: 'Geography',
    difficulty: 'hard'
  },

  // Additional questions for variety
  {
    id: '16',
    question: 'How many minutes are in a full day?',
    options: ['1440', '1400', '1480', '1420'],
    correctAnswer: 0,
    category: 'Math',
    difficulty: 'medium'
  },
  {
    id: '17',
    question: 'What gas do plants absorb from the atmosphere?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '18',
    question: 'Which country invented pizza?',
    options: ['France', 'Italy', 'Greece', 'Spain'],
    correctAnswer: 1,
    category: 'Culture',
    difficulty: 'easy'
  },
  {
    id: '19',
    question: 'What is the hardest natural substance on Earth?',
    options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'medium'
  },
  {
    id: '20',
    question: 'Who developed the theory of relativity?',
    options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Stephen Hawking'],
    correctAnswer: 1,
    category: 'Science',
    difficulty: 'hard'
  }
];

export const getRandomQuestion = (difficulty?: 'easy' | 'medium' | 'hard'): TriviaQuestion => {
  let filteredQuestions = triviaQuestions;
  
  if (difficulty) {
    filteredQuestions = triviaQuestions.filter(q => q.difficulty === difficulty);
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  return filteredQuestions[randomIndex];
};

export const getQuestionByZone = (zone: number): TriviaQuestion => {
  // Easy questions for zones 1-3
  if (zone <= 3) {
    return getRandomQuestion('easy');
  }
  // Medium questions for zones 4-7
  else if (zone <= 7) {
    return getRandomQuestion('medium');
  }
  // Hard questions for zones 8+
  else {
    return getRandomQuestion('hard');
  }
};