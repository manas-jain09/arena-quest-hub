
// Sample data for learning paths and questions
export const learningPaths = [
  {
    id: "rookie-rumble",
    title: "Rookie Rumble",
    description: "Perfect for beginners. Master the fundamentals and build a strong foundation.",
    difficulty: "easy" as const,
    topicsCount: 3,
    questionsCount: 9
  },
  {
    id: "warriors-way",
    title: "Warrior's Way",
    description: "Intermediate challenges to sharpen your skills and expand your knowledge.",
    difficulty: "medium" as const,
    topicsCount: 3,
    questionsCount: 9
  },
  {
    id: "veterans-vault",
    title: "Veteran's Vault",
    description: "Advanced problems that will push your limits and prepare you for anything.",
    difficulty: "hard" as const,
    topicsCount: 3,
    questionsCount: 9
  }
];

// Sample topics and questions
export const topicsAndQuestions = {
  "rookie-rumble": [
    {
      id: "rr-topic-1",
      name: "Data Types and Variables",
      questions: [
        {
          id: "rr-q1",
          title: "Working with primitive data types",
          practiceLink: "https://quiz.arenahq-mitwpu.in/rookie/q1",
          solutionLink: "https://quiz.arenahq-mitwpu.in/rookie/sol1",
          difficulty: "easy" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "rr-q2",
          title: "String operations and methods",
          practiceLink: "https://quiz.arenahq-mitwpu.in/rookie/q2",
          solutionLink: "https://quiz.arenahq-mitwpu.in/rookie/sol2",
          difficulty: "easy" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "rr-q3",
          title: "Type conversions",
          practiceLink: "https://quiz.arenahq-mitwpu.in/rookie/q3",
          solutionLink: "https://quiz.arenahq-mitwpu.in/rookie/sol3",
          difficulty: "easy" as const,
          isCompleted: false,
          isMarkedForRevision: false
        }
      ]
    },
    {
      id: "rr-topic-2",
      name: "Control Structures",
      questions: [
        {
          id: "rr-q4",
          title: "If-else statements",
          practiceLink: "https://quiz.arenahq-mitwpu.in/rookie/q4",
          solutionLink: "https://quiz.arenahq-mitwpu.in/rookie/sol4",
          difficulty: "easy" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "rr-q5",
          title: "For loops",
          practiceLink: "https://quiz.arenahq-mitwpu.in/rookie/q5",
          solutionLink: "https://quiz.arenahq-mitwpu.in/rookie/sol5",
          difficulty: "easy" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "rr-q6",
          title: "While and do-while loops",
          practiceLink: "https://quiz.arenahq-mitwpu.in/rookie/q6",
          solutionLink: "https://quiz.arenahq-mitwpu.in/rookie/sol6",
          difficulty: "easy" as const,
          isCompleted: false,
          isMarkedForRevision: false
        }
      ]
    },
    {
      id: "rr-topic-3",
      name: "Functions",
      questions: [
        {
          id: "rr-q7",
          title: "Function declaration and invocation",
          practiceLink: "https://quiz.arenahq-mitwpu.in/rookie/q7",
          solutionLink: "https://quiz.arenahq-mitwpu.in/rookie/sol7",
          difficulty: "easy" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "rr-q8",
          title: "Function parameters and return values",
          practiceLink: "https://quiz.arenahq-mitwpu.in/rookie/q8",
          solutionLink: "https://quiz.arenahq-mitwpu.in/rookie/sol8",
          difficulty: "easy" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "rr-q9",
          title: "Scope and closures",
          practiceLink: "https://quiz.arenahq-mitwpu.in/rookie/q9",
          solutionLink: "https://quiz.arenahq-mitwpu.in/rookie/sol9",
          difficulty: "easy" as const,
          isCompleted: false,
          isMarkedForRevision: false
        }
      ]
    }
  ],
  "warriors-way": [
    {
      id: "ww-topic-1",
      name: "Arrays and Objects",
      questions: [
        {
          id: "ww-q1",
          title: "Array methods and operations",
          practiceLink: "https://quiz.arenahq-mitwpu.in/warrior/q1",
          solutionLink: "https://quiz.arenahq-mitwpu.in/warrior/sol1",
          difficulty: "medium" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "ww-q2",
          title: "Working with object properties",
          practiceLink: "https://quiz.arenahq-mitwpu.in/warrior/q2",
          solutionLink: "https://quiz.arenahq-mitwpu.in/warrior/sol2",
          difficulty: "medium" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "ww-q3",
          title: "Nested data structures",
          practiceLink: "https://quiz.arenahq-mitwpu.in/warrior/q3",
          solutionLink: "https://quiz.arenahq-mitwpu.in/warrior/sol3",
          difficulty: "medium" as const,
          isCompleted: false,
          isMarkedForRevision: false
        }
      ]
    },
    {
      id: "ww-topic-2",
      name: "Error Handling and Debugging",
      questions: [
        {
          id: "ww-q4",
          title: "Try-catch blocks",
          practiceLink: "https://quiz.arenahq-mitwpu.in/warrior/q4",
          solutionLink: "https://quiz.arenahq-mitwpu.in/warrior/sol4",
          difficulty: "medium" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "ww-q5",
          title: "Debugging tools and techniques",
          practiceLink: "https://quiz.arenahq-mitwpu.in/warrior/q5",
          solutionLink: "https://quiz.arenahq-mitwpu.in/warrior/sol5",
          difficulty: "medium" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "ww-q6",
          title: "Error propagation",
          practiceLink: "https://quiz.arenahq-mitwpu.in/warrior/q6",
          solutionLink: "https://quiz.arenahq-mitwpu.in/warrior/sol6",
          difficulty: "medium" as const,
          isCompleted: false,
          isMarkedForRevision: false
        }
      ]
    },
    {
      id: "ww-topic-3",
      name: "Asynchronous Programming",
      questions: [
        {
          id: "ww-q7",
          title: "Callback functions",
          practiceLink: "https://quiz.arenahq-mitwpu.in/warrior/q7",
          solutionLink: "https://quiz.arenahq-mitwpu.in/warrior/sol7",
          difficulty: "medium" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "ww-q8",
          title: "Promises",
          practiceLink: "https://quiz.arenahq-mitwpu.in/warrior/q8",
          solutionLink: "https://quiz.arenahq-mitwpu.in/warrior/sol8",
          difficulty: "medium" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "ww-q9",
          title: "Async/Await syntax",
          practiceLink: "https://quiz.arenahq-mitwpu.in/warrior/q9",
          solutionLink: "https://quiz.arenahq-mitwpu.in/warrior/sol9",
          difficulty: "medium" as const,
          isCompleted: false,
          isMarkedForRevision: false
        }
      ]
    }
  ],
  "veterans-vault": [
    {
      id: "vv-topic-1",
      name: "Design Patterns",
      questions: [
        {
          id: "vv-q1",
          title: "Singleton pattern",
          practiceLink: "https://quiz.arenahq-mitwpu.in/veteran/q1",
          solutionLink: "https://quiz.arenahq-mitwpu.in/veteran/sol1",
          difficulty: "hard" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "vv-q2",
          title: "Factory pattern",
          practiceLink: "https://quiz.arenahq-mitwpu.in/veteran/q2",
          solutionLink: "https://quiz.arenahq-mitwpu.in/veteran/sol2",
          difficulty: "hard" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "vv-q3",
          title: "Observer pattern",
          practiceLink: "https://quiz.arenahq-mitwpu.in/veteran/q3",
          solutionLink: "https://quiz.arenahq-mitwpu.in/veteran/sol3",
          difficulty: "hard" as const,
          isCompleted: false,
          isMarkedForRevision: false
        }
      ]
    },
    {
      id: "vv-topic-2",
      name: "Advanced Algorithms",
      questions: [
        {
          id: "vv-q4",
          title: "Recursion and dynamic programming",
          practiceLink: "https://quiz.arenahq-mitwpu.in/veteran/q4",
          solutionLink: "https://quiz.arenahq-mitwpu.in/veteran/sol4",
          difficulty: "hard" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "vv-q5",
          title: "Graph algorithms",
          practiceLink: "https://quiz.arenahq-mitwpu.in/veteran/q5",
          solutionLink: "https://quiz.arenahq-mitwpu.in/veteran/sol5",
          difficulty: "hard" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "vv-q6",
          title: "Sorting and searching algorithms",
          practiceLink: "https://quiz.arenahq-mitwpu.in/veteran/q6",
          solutionLink: "https://quiz.arenahq-mitwpu.in/veteran/sol6",
          difficulty: "hard" as const,
          isCompleted: false,
          isMarkedForRevision: false
        }
      ]
    },
    {
      id: "vv-topic-3",
      name: "Performance Optimization",
      questions: [
        {
          id: "vv-q7",
          title: "Memory management",
          practiceLink: "https://quiz.arenahq-mitwpu.in/veteran/q7",
          solutionLink: "https://quiz.arenahq-mitwpu.in/veteran/sol7",
          difficulty: "hard" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "vv-q8",
          title: "Code profiling",
          practiceLink: "https://quiz.arenahq-mitwpu.in/veteran/q8",
          solutionLink: "https://quiz.arenahq-mitwpu.in/veteran/sol8",
          difficulty: "hard" as const,
          isCompleted: false,
          isMarkedForRevision: false
        },
        {
          id: "vv-q9",
          title: "Optimization techniques",
          practiceLink: "https://quiz.arenahq-mitwpu.in/veteran/q9",
          solutionLink: "https://quiz.arenahq-mitwpu.in/veteran/sol9",
          difficulty: "hard" as const,
          isCompleted: false,
          isMarkedForRevision: false
        }
      ]
    }
  ]
};
