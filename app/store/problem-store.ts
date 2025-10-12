import { Problem } from 'app/types';
import { create } from 'zustand';

export const useProblemStore = create<{
    problem: Problem | null;
    setProblem: (p: Problem) => void;
}>((set) => ({
    problem: null,
    setProblem: (p) => set({ problem: p }),
}));
