"use client";

import { useState, useEffect } from "react";

export function useProgress() {
  const [progress, setProgress] = useState({
    unlockedLevels: [1], // Level 1 is unlocked by default
    completedLevels: [],
    stars: 0,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("codeArena_progress");
    if (saved) {
      setProgress(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("codeArena_progress", JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  const completeLevel = (levelId, earnedStars = 3) => {
    setProgress((prev) => {
      const newCompleted = [...new Set([...prev.completedLevels, levelId])];
      const newUnlocked = [...new Set([...prev.unlockedLevels, levelId, levelId + 1])];
      
      // Calculate new stars (only add if not previously completed or logic can be complex, 
      // simple logic: add unconditionally for this prototype)
      const isNewlyCompleted = !prev.completedLevels.includes(levelId);
      const newStars = isNewlyCompleted ? prev.stars + earnedStars : prev.stars;

      return {
        ...prev,
        completedLevels: newCompleted,
        unlockedLevels: newUnlocked,
        stars: newStars,
      };
    });
  };

  return { progress, completeLevel, isLoaded };
}
