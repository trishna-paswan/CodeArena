"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import LevelMap from "@/components/LevelMap";
import { useProgress } from "@/lib/useProgress";
import { ArrowLeft, Star, Award } from "lucide-react";
import Link from "next/link";

// Mock data: In a real app, this would be fetched based on classId
const CLASS_LEVELS = {
  6: [
    { id: "6-1", name: "Level 1: Tea Making", theory: true },
    { id: "6-2", name: "Level 2: Routine", theory: true },
    { id: "6-3", name: "Level 3: Directions", theory: true },
    { id: "6-4", name: "Level 4: Patterns", theory: true },
    { id: "6-5", name: "Level 5: Froggy", theory: true },
  ],
  7: [
    { id: "7-1", name: "Level 1: Variables Lab", theory: true },
    { id: "7-2", name: "Level 2: Traffic", theory: true },
    { id: "7-3", name: "Level 3: Debugging", theory: true },
    { id: "7-4", name: "Level 4: Factory", theory: true },
    { id: "7-5", name: "Level 5: Treasure", theory: true },
  ]
};



export default function ClassPage() {
  const params = useParams();
  const rawClassId = params?.id;
  const classId = Array.isArray(rawClassId) ? rawClassId[0] ?? "" : rawClassId ?? "";
  const router = useRouter();
  const { progress, isLoaded } = useProgress();
  const [levels, setLevels] = useState<any[]>([]);

  if (!classId) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <p>Unable to load class information.</p>
      </main>
    );
  }

  useEffect(() => {
    // Determine the levels for this class
    const classData = (CLASS_LEVELS as any)[classId];
    if (classData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLevels(classData);
    } else {
      // Fallback or empty state for other classes
      // For demo, just auto-gen 5 levels
      setLevels([
        { id: `${classId}-1`, name: `Class ${classId} basics` },
        { id: `${classId}-2`, name: `Conditionals` },
        { id: `${classId}-3`, name: `Loops` },
        { id: `${classId}-4`, name: `Functions` },
        { id: `${classId}-5`, name: `Final Boss` },
      ]);
    }
  }, [classId]);

  const handleLevelSelect = (level: any) => {
    router.push(`/level/${level.id}`);
  };

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center text-white">Loading Progress...</div>;

  return (
    <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start">

        {/* Left Sidebar Info */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <Link href="/">
            <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 py-2 px-4 rounded-full border border-slate-700/50 w-fit">
              <ArrowLeft size={16} /> Back to Classes
            </button>
          </Link>

          <div className="glass-panel p-6 border-indigo-500/30 rounded-3xl">
            <h2 className="text-3xl font-bold text-white mb-2">Class {classId}</h2>
            <p className="text-indigo-300 font-medium mb-8">Your computing journey log.</p>

            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-amber-500/20 p-3 rounded-xl text-amber-500">
                  <Star size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 uppercase font-bold">Total Stars</p>
                  <p className="text-2xl font-black text-white">{progress.stars}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-green-500/20 p-3 rounded-xl text-green-500">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 uppercase font-bold">Levels Cleared</p>
                  <p className="text-2xl font-black text-white">{progress.completedLevels.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Map Canvas */}
        <div className="w-full md:w-2/3">
          {levels.length > 0 && (
            <LevelMap
              levels={levels}
              userProgress={progress}
              onLevelSelect={handleLevelSelect}
            />
          )}
        </div>

      </div>
    </main>
  );
}
