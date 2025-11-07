// import { create } from "zustand";
// import Cookies from "js-cookie";
// import type { User } from "@/types";

// interface AuthState {
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   updateUser: (userData: Partial<User>) => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null,
//   isLoading: false,

//   login: async (email, password) => {
//     set({ isLoading: true });
//     try {
//       const res = await fetch("http://localhost:5000/me/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       if (!res.ok) return false;

//       const data: { user: User; token: string } = await res.json();
//       Cookies.set("token", data.token, { expires: 7 });
//       Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
//       set({ user: data.user, isLoading: false });
//       return true;
//     } catch {
//       set({ isLoading: false });
//       return false;
//     }
//   },

//   logout: () => {
//     Cookies.remove("token");
//     Cookies.remove("user");
//     set({ user: null });
//   },

//   updateUser: (userData) => {
//     set((state) => {
//       const updatedUser = { ...state.user, ...userData } as User;
//       Cookies.set("user", JSON.stringify(updatedUser), { expires: 7 });
//       return { user: updatedUser };
//     });
//   },
// }));
