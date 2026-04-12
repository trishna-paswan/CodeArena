"use client";

import { useState, useEffect } from "react";

function normalizeProgress(rawProgress = {}) {
  const unlocked = Array.isArray(rawProgress.unlockedLevels) ? rawProgress.unlockedLevels : [];
  const completed = Array.isArray(rawProgress.completedLevels) ? rawProgress.completedLevels : [];
  const stars = Number.isFinite(rawProgress.stars) ? rawProgress.stars : 0;

  return {
    unlockedLevels: [...new Set(unlocked.map((id) => String(id)))],
    completedLevels: [...new Set(completed.map((id) => String(id)))],
    stars,
  };
}

function getNextLevelId(levelId) {
  const [classId, step] = String(levelId).split("-");
  const nextStep = Number(step);

  if (!classId || Number.isNaN(nextStep)) {
    return null;
  }

  return `${classId}-${nextStep + 1}`;
}

export function useProgress() {
  const [progress, setProgress] = useState({
    unlockedLevels: ["1", "6-1", "7-1"],
    completedLevels: [],
    stars: 0,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    let parsed = { unlockedLevels: [], completedLevels: [], stars: 0 };

    try {
      const saved = localStorage.getItem("codeArena_progress");
      parsed = saved ? normalizeProgress(JSON.parse(saved)) : parsed;
    } catch {
      parsed = { unlockedLevels: [], completedLevels: [], stars: 0 };
    }

    const defaultUnlocks = ["1", "6-1", "6-2", "6-3", "6-4", "6-5", "7-1", "7-2", "7-3"];
    defaultUnlocks.forEach((id) => {
      if (!parsed.unlockedLevels.includes(id)) parsed.unlockedLevels.push(id);
    });

    setProgress(normalizeProgress(parsed));
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
      const safeLevelId = String(levelId);
      const nextLevelId = getNextLevelId(safeLevelId);
      const newCompleted = [...new Set([...prev.completedLevels, safeLevelId])];
      const newUnlocked = [...new Set([
        ...prev.unlockedLevels,
        safeLevelId,
        ...(nextLevelId ? [nextLevelId] : []),
      ])];

      const isNewlyCompleted = !prev.completedLevels.includes(safeLevelId);
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
