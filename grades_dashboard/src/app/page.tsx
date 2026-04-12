import ClassCard from "@/components/ClassCard";

const CLASSES = [
  {
    id: 6,
    title: "Class 6: Logic Basics",
    description: "Learn the foundation of coding: algorithms, loops, and sequences.",
    colorClass: "bg-blue-500",
  },
  {
    id: 7,
    title: "Class 7: Coding Ninja",
    description: "Master conditions, debugging, and intermediate logic.",
    colorClass: "bg-indigo-500",
  },
  {
    id: 8,
    title: "Class 8: Web Apprentice",
    description: "Start building real interactive web components.",
    colorClass: "bg-purple-500",
  },
  {
    id: 9,
    title: "Class 9: Game Developer",
    description: "Create your own arcade games from scratch.",
    colorClass: "bg-pink-500",
  },
  {
    id: 10,
    title: "Class 10: App Creator",
    description: "Build logic for mobile apps and tools.",
    colorClass: "bg-rose-500",
  },
  {
    id: 11,
    title: "Class 11: Data Master",
    description: "Dive deep into data structures and AI basics.",
    colorClass: "bg-orange-500",
  },
  {
    id: 12,
    title: "Class 12: Pro Engineer",
    description: "Prepare for the real world with advanced algorithms.",
    colorClass: "bg-amber-500",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24 relative overflow-hidden">

      {/* 3D Background takes care of decor */}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-start mb-8">
          <a href="/games" className="px-6 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white transition-all text-sm font-bold flex items-center gap-2">
            <span>←</span> BACK TO LOBBY
          </a>
        </div>
        <header className="mb-16 text-center">
          <div className="inline-block py-1 pr-4 pl-1 rounded-full glass-panel mb-6 flex items-center gap-3 w-fit mx-auto">
            <span className="bg-[#8A2BE2] shadow-[0_0_10px_rgba(138,43,226,0.6)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">NEW</span>
            {/* <span className="text-sm font-medium text-slate-300">Welcome to Grade Quests V1.0</span> */}
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-gradient neon-text leading-tight">
            Grade Quests
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-medium">
            Learn to code by playing games. Select your class to begin the journey!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CLASSES.map((cls) => (
            <ClassCard
              key={cls.id}
              id={cls.id}
              title={cls.title}
              description={cls.description}
              colorClass={cls.colorClass}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
