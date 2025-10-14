import { persist, createJSONStorage } from 'zustand/middleware';
import type { Problem } from '@/entities/models/problem';
import { create } from 'zustand';

export const useProblemStore = create<{
    problem: Problem | null;
    setProblem: (p: Problem) => void;
}>()(
    persist(
        (set) => ({
            problem: null,
            setProblem: (p) => set({ problem: p }),
        }),
        {
            name: 'problem-storage', // unique name for localStorage key
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
