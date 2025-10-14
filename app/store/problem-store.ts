import type { Problem } from '@/entities/models/problem';
import { create } from 'zustand';

export const useProblemStore = create<{
    problem: Problem | null;
    setProblem: (p: Problem) => void;
}>((set) => ({
    problem: null,
    setProblem: (p) => set({ problem: p }),
}));
