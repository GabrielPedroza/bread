import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        greatvibes: ["Great Vibes", "cursive"],
      },
      colors: {
        mainBackground: "rgb(248, 245, 239)",
      },
    },
  },
  plugins: [],
} satisfies Config;
