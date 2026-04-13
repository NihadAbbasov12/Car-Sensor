import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10212b",
        accent: "#d97706",
        sand: "#f7f3ea",
      },
    },
  },
  plugins: [],
};

export default config;
