import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure for user data
interface UserData {
  token: string;
  userId: string; // Or appropriate type
  isAdmin: boolean;
}

// Define the state structure
interface UserState {
  token: string | null;
  userId: string | null; // Or appropriate type
  isAdmin: boolean | null;
}

// Initialize state from localStorage if available, otherwise null
const loadInitialState = (): UserState => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user"); // Assuming user info is stored separately

  if (token && userString) {
    try {
      const user = JSON.parse(userString);
      // Basic validation to ensure stored data has expected fields
      if (user && typeof user.userId !== 'undefined' && typeof user.isAdmin !== 'undefined') {
        console.log("📦 Hydrating Redux state from localStorage");
        return {
          token: token,
          userId: user.userId,
          isAdmin: user.isAdmin,
        };
      }
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
      // Clear potentially corrupted storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
  // Default initial state if nothing valid in localStorage
  return {
    token: null,
    userId: null,
    isAdmin: null,
  };
};


const initialState: UserState = loadInitialState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set user data on login
    setUser: (state, action: PayloadAction<UserData>) => {
      console.log("📦 setUser reducer fired!");
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isAdmin = action.payload.isAdmin;
      // Also update localStorage for persistence
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify({ userId: action.payload.userId, isAdmin: action.payload.isAdmin }));
    },
    // Action to clear user data on logout
    clearUser: (state) => {
      console.log("📦 clearUser reducer fired!");
      state.token = null;
      state.userId = null;
      state.isAdmin = null;
      // Also clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

// Optional: Selector for convenience
export const selectUser = (state: { user: UserState }) => state.user;

