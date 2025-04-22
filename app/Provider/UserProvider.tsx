import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import { supabase } from "@/app/lib/superbase"; // Ensure correct import path

// Define the context type
type UserType = {
  userId: string | null;
  setUserId: (user: string | null) => void;
};

// Default context value
const defaultValue: UserType = {
  userId: null,
  setUserId: () => {},
};

// Create the context
const UserContext = createContext<UserType>(defaultValue);

const UserProvider = ({ children }: PropsWithChildren) => {
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch authenticated user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        console.log("User ID set from Supabase:", data.user.id);
      } else {
        console.log("No user found:", error?.message);
      }
    };

    getUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        console.log("Auth changed, new user:", session.user.id);
      } else {
        setUserId(null);
        console.log("User logged out");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUser = () => useContext(UserContext);
