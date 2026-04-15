import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Signature } from '../lib/jyotish';

interface ProfileState {
  hasProfile: boolean;
  name: string;
  dob: string;
  time: string;
  place: string;
  signature: Signature | null;
  lifePath: number | null;
  expression: number | null;
  soulUrge: number | null;
  setProfile: (data: Partial<ProfileState>) => void;
  clearProfile: () => void;
  currentStage: number;
  setStage: (stage: number) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      hasProfile: false,
      name: '',
      dob: '',
      time: '',
      place: '',
      signature: null,
      lifePath: null,
      expression: null,
      soulUrge: null,
      setProfile: (data) => set((state) => ({ ...state, ...data, hasProfile: true })),
      clearProfile: () => set({ hasProfile: false, name: '', dob: '', time: '', place: '', signature: null, lifePath: null, expression: null, soulUrge: null, currentStage: 1 }),
      currentStage: 1,
      setStage: (currentStage) => set({ currentStage }),
    }),
    {
      name: 'cosmos-profile',
    }
  )
);
