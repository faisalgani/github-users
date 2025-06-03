import { create } from 'zustand';

interface User {
  login: string;
  id: number;
}

interface UserStore {
  users: User[];
  setUsers: (users: User[]) => void;
  clearUsers: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  clearUsers: () => set({ users: [] }),
}));
