import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const lightTheme = createTheme({
    type: "light",
    theme: {
      colors: {
        background: "#EDF0F2",
        backgroundAlpha: "rgba(237, 240, 242, 0.7)",
        codeLight: "transparent",
        primaryLight: "#B7CFED",
        primaryLightHover: "#C5D9F1",
        primaryLightActive: "#9EBFE7",
        primaryLightContrast: "#081F3E",
        primary: "#081F3E",
        primaryBorder: "red",
        primaryBorderHover: "red",
        primarySolid: "#134A92",
        primarySolidHover: "#134A92",
        primarySolidContrast: "#FFFFFF",
        primaryShadow: "$green500",
        secondaryLight: "#354F78",
        secondaryLightHover: "#12A5B2",
        secondaryLightActive: "#0F8089",
        secondaryLightContrast: "#FFFFFF",
        secondary: "#50AE32",
        secondaryBorder: "red",
        secondaryBorderHover: "blue",
        secondarySolidHover: "yellow",
        secondarySolidContrast: "#FFFFFF",
        secondaryShadow: "orange",
        error: "#BF4C30",
        errorLight: "#EFC9C0",
        errorLightContrast: "#BF4C30",
        errorLightHover: "#F2D2CB",
        errorLightActive: "#E7AC9E",
        success: "#50AE32",
        successLight: "#D8F1D0",
        successLightContrast: "#50AE32",
        successLightHover: "#E5F6DF",
        successLightActive: "#AFE29F",
      },
      space: {
        "span.code-line": 0,
      },
    },
  }),
  darkTheme = createTheme({
    type: "dark",
    theme: {
      colors: {
        background: "#081F3E",
        backgroundAlpha: "rgba(23, 28, 46, 0.7)",
        codeLight: "transparent",
        primaryLight: "#c7d8ed",
        primaryLightHover: "#d8e1ed",
        primaryLightActive: "#c2d5ed",
        primaryLightContrast: "#385d8f",
        primary: "#385d8f",
        primaryBorder: "red",
        primaryBorderHover: "red",
        primarySolid: "orange",
        primarySolidHover: "orange",
        primarySolidContrast: "#FFFFFF",
        primaryShadow: "$green500",
        secondaryLight: "#354F78",
        secondaryLightHover: "#12A5B2",
        secondaryLightActive: "#0F8089",
        secondaryLightContrast: "#FFFFFF",
        secondary: "#50AE32",
        secondaryBorder: "red",
        secondaryBorderHover: "blue",
        secondarySolidHover: "yellow",
        secondarySolidContrast: "#FFFFFF",
        secondaryShadow: "orange",
        error: "#db6f63",
        errorLight: "#ffd1cc",
        errorLightContrast: "#db6f63",
        errorLightHover: "#ffe3e0",
        errorLightActive: "#ffc8c2",
        success: "#50AE32",
        successLight: "#c0ebb2",
        successLightContrast: "#50AE32",
        successLightHover: "#d9f5d0",
        successLightActive: "#b9eda8",
      },
    },
  });

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

root.render(
  <React.StrictMode>
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </NextUIProvider>
    </NextThemesProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
