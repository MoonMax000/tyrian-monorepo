import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Add purple for sidebar compatibility
        purple: "#A06AFF",

        // Tyrian Trade design system colors
        tyrian: {
          black: "#000000",
          white: "#FFFFFF",
          purple: {
            primary: "#A06AFF",
            secondary: "#482090",
            background: "#2E2744",
            dark: "#181A20",
          },
          gray: {
            light: "#C2C2C2",
            medium: "#B0B0B0",
            dark: "#313338",
            darker: "#181B22",
          },
          background: {
            primary: "#0B0E11",
            card: "rgba(12, 16, 20, 0.50)",
            glass: "rgba(12, 16, 20, 0.50)",
          },
          red: "#EF454A",
          green: "#2EBD85",
          "green-background": "#1C3430",
          yellow: "#FFA800",
          blue: "#6AA5FF",
          "blue-background": "#1F4886",
          gold: {
            binance: "#EEB00E",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        nunito: ["Nunito Sans", "sans-serif"],
      },
      backdropBlur: {
        "32": "32px",
        "50": "50px",
        "58": "58.333px",
        "120": "120px",
      },
      gradients: {
        "tyrian-primary": "linear-gradient(270deg, #A06AFF 0%, #482090 100%)",
        "tyrian-sidebar":
          "linear-gradient(180deg, rgba(82, 58, 131, 0.00) 0%, #A06AFF 50%, rgba(82, 58, 131, 0.00) 100%)",
      },
      backgroundImage: {
        "tyrian-gradient": "linear-gradient(270deg, #A06AFF 0%, #482090 100%)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss/plugin")(function ({ addUtilities }: any) {
      addUtilities({
        ".custom-bg-blur": {
          "background-color": "rgba(0, 0, 0, 0.68)",
          "backdrop-filter":
            "blur(24px) saturate(140%) contrast(95%) brightness(90%)",
          "-webkit-backdrop-filter":
            "blur(24px) saturate(140%) contrast(95%) brightness(90%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          "box-shadow":
            "inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 8px 32px rgba(0, 0, 0, 0.45)",
        },
      });
    }),
  ],
} satisfies Config;
