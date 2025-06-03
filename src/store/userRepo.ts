import { create } from 'zustand';

interface UserRepo {
  name: string;
  description: string;
  stargazers_count:number
}

interface UserRepoStore {
  userRepo: UserRepo[];
  setUserRepo: (users: UserRepo[]) => void;
  clearUserRepo: () => void;
}

export const useUserRepoStore = create<UserRepoStore>((set) => ({
  userRepo: [],
  setUserRepo: (userRepo) => set({ userRepo }),
  clearUserRepo: () => set({ userRepo: [] }),
}));
