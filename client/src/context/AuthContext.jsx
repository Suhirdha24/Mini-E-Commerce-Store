import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("nova_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    const savedUser = localStorage.getItem(`nova_account_${email}`);

    if (!savedUser) {
      throw new Error("Account not found. Please create an account first.");
    }

    const account = JSON.parse(savedUser);

    if (account.password !== password) {
      throw new Error("Incorrect email or password.");
    }

    const loggedInUser = {
      name: account.name,
      email: account.email,
    };

    localStorage.setItem("nova_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return loggedInUser;
  };

  const register = async (name, email, password) => {
    const existingUser = localStorage.getItem(`nova_account_${email}`);

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const account = {
      name,
      email,
      password,
    };

    localStorage.setItem(
      `nova_account_${email}`,
      JSON.stringify(account)
    );

    const loggedInUser = {
      name,
      email,
    };

    localStorage.setItem(
      "nova_user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);

    return loggedInUser;
  };

  const logout = () => {
    localStorage.removeItem("nova_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}