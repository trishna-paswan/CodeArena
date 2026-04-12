export const LEVEL_DATA: Record<string, {
  classId: string;
  title: string;
  explanation: string;
  example: string;
  gameInfo: string;
}> = {
  "6-1": {
    classId: "6",
    title: "Algorithm: Tea Making",
    explanation: "An algorithm is like a recipe! It is a set of step-by-step instructions to complete a task. Let's practice by making tea in the correct order.",
    example: "1. Boil Water\n2. Add Tea Leaves\n3. Add Sugar and Milk\n4. Serve",
    gameInfo: "ExternalAlgorithm"
  },
  "6-2": {
    classId: "6",
    title: "Sequence: Daily Routine",
    explanation: "Execution order matters. If you put on your shoes before your socks, that's a bug! Arrange your daily actions sequentially.",
    example: "wake_up()\nbrush_teeth()\neat_breakfast()\ngo_to_school()",
    gameInfo: "RoutineGame"
  },
  "6-3": {
    classId: "6",
    title: "Instructions: Direction",
    explanation: "Computers only do exactly what you tell them. Guide the character to the goal using precise directional commands.",
    example: "move_forward(2)\nturn_left()\nmove_forward(1)",
    gameInfo: "ExternalDirection"
  },
  "6-4": {
    classId: "6",
    title: "Repetition: Loops",
    explanation: "Don't repeat yourself! Use a loop to perform the same action multiple times to form a pattern.",
    example: "for i in range(4):\n   draw_square()",
    gameInfo: "ExternalPattern"
  },
  "6-5": {
    classId: "6",
    title: "Conditionals: Froggy's Jump",
    explanation: "Sometimes we need to make choices based on rules. This is called a conditional (If-Else statement).",
    example: "if (number > 5) {\n   jump();\n} else {\n   wait();\n}",
    gameInfo: "ExternalFrog"
  },
  "7-1": {
    classId: "7",
    title: "Variables: Core Lab",
    explanation: "Learn how computers store and update data using variables.",
    example: "let X = 5;\nX = X + 3;",
    gameInfo: "ExternalVariableLab"
  },
  "7-2": {
    classId: "7",
    title: "Conditionals: Traffic",
    explanation: "If-Else statements help computers make decisions based on conditions.",
    example: "if (light == 'red') {\n  stop();\n} else {\n  go();\n}",
    gameInfo: "TrafficGame"
  },
  "7-3": {
    classId: "7",
    title: "Debugging",
    explanation: "Bugs are errors in logic. Find and fix the broken code to make the machine work.",
    example: "// Expected outcome: 10\nlet x = 5;\n// BUG: x = x - 5;\nx = x + 5; // FIX",
    gameInfo: "DebugGame"
  },
  "7-4": {
    classId: "7",
    title: "While Loops: Robot Factory",
    explanation: "While loops continue to run as long as a condition is true.",
    example: "while (battery > 0) {\n  work();\n}",
    gameInfo: "FactoryGame"
  },
  "7-5": {
    classId: "7",
    title: "Path Finding: Treasure Hunt",
    explanation: "Use conditions and loops to create a search algorithm to find the hidden treasure.",
    example: "if(pathClear) move();\nelse turn();",
    gameInfo: "TreasureGame"
  }
};
