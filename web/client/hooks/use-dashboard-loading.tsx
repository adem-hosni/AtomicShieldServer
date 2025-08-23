import { useState, useEffect, useCallback } from "react";

export type LoadingStage =
  | "initializing"
  | "stats"
  | "servers"
  | "activity"
  | "complete";

export interface LoadingState {
  stage: LoadingStage;
  progress: number;
  isLoading: boolean;
  error: string | null;
}

interface UseDashboardLoadingReturn {
  loadingState: LoadingState;
  setStage: (stage: LoadingStage) => void;
  setError: (error: string | null) => void;
  setProgress: (progress: number) => void;
  startLoading: () => void;
  completeLoading: () => void;
  resetLoading: () => void;
}

export function useDashboardLoading(): UseDashboardLoadingReturn {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    stage: "initializing",
    progress: 0,
    isLoading: true,
    error: null,
  });

  // Progress mapping for each stage
  const stageProgress: Record<LoadingStage, number> = {
    initializing: 10,
    stats: 30,
    servers: 60,
    activity: 85,
    complete: 100,
  };

  const setStage = useCallback((stage: LoadingStage) => {
    setLoadingState((prev) => ({
      ...prev,
      stage,
      progress: stageProgress[stage],
      isLoading: stage !== "complete",
      error: null,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setLoadingState((prev) => ({
      ...prev,
      error,
      isLoading: false,
    }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setLoadingState((prev) => ({
      ...prev,
      progress: Math.min(Math.max(progress, 0), 100),
    }));
  }, []);

  const startLoading = useCallback(() => {
    setLoadingState({
      stage: "initializing",
      progress: 0,
      isLoading: true,
      error: null,
    });
  }, []);

  const completeLoading = useCallback(() => {
    setLoadingState((prev) => ({
      ...prev,
      stage: "complete",
      progress: 100,
      isLoading: false,
      error: null,
    }));
  }, []);

  const resetLoading = useCallback(() => {
    setLoadingState({
      stage: "initializing",
      progress: 0,
      isLoading: true,
      error: null,
    });
  }, []);

  return {
    loadingState,
    setStage,
    setError,
    setProgress,
    startLoading,
    completeLoading,
    resetLoading,
  };
}

// Enhanced loading messages and descriptions
export const loadingMessages: Record<
  LoadingStage,
  { title: string; description: string }
> = {
  initializing: {
    title: "Initializing Dashboard",
    description: "Setting up your control center...",
  },
  stats: {
    title: "Loading Statistics",
    description: "Gathering system metrics and status...",
  },
  servers: {
    title: "Connecting to Servers",
    description: "Establishing server connections...",
  },
  activity: {
    title: "Fetching Activity",
    description: "Loading recent events and logs...",
  },
  complete: {
    title: "Ready",
    description: "Dashboard loaded successfully",
  },
};

// Utility function to get loading message for current stage
export function getLoadingMessage(stage: LoadingStage) {
  return loadingMessages[stage];
}

// Utility function to check if a stage is active/current/completed
export function getStageStatus(
  currentStage: LoadingStage,
  targetStage: LoadingStage,
) {
  const stageOrder: LoadingStage[] = [
    "initializing",
    "stats",
    "servers",
    "activity",
    "complete",
  ];
  const currentIndex = stageOrder.indexOf(currentStage);
  const targetIndex = stageOrder.indexOf(targetStage);

  if (currentIndex === targetIndex) return "current";
  if (currentIndex > targetIndex) return "completed";
  return "pending";
}
