import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import SetupWrapper from "./features/Setup/SetupWrapper";
import ErrorBoundary from "./components/ErrorBoundary";

const lightTheme = createTheme({
    type: "light",
    theme: {
      colors: {
        background: "#F4F4F4",
        backgroundAlpha: "rgba(244, 244, 244, 0.7)",
        codeLight: "transparent",
        primaryLight: "#B7CFED",
        primaryLightHover: "#C5D9F1",
        primaryLightActive: "#9EBFE7",
        primaryLightContrast: "#081F3E",
        primary: "#081F3E",
        primaryBorder: "red",
        primarySolid: "#134A92",
        primarySolidHover: "#134A92",
        primarySolidContrast: "#FFFFFF",
        secondary: "linear-gradient(120deg, #68ABF8, #53E492)",
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
        background: "#212121",
        backgroundAlpha: "rgba(33, 33, 33, 0.3)",
        backgroundContrast: "#292929",
        codeLight: "transparent",
        primaryLight: "#17365D",
        primaryLightHover: "#0E2746",
        primaryLightActive: "#1E3D64",
        primaryLightContrast: "#D0E5FF",
        primary: "#9AB8E0",
        primarySolid: "#0E4184",
        primarySolidContrast: "#1053AB",
        secondaryLight: "#354F78",
        secondaryLightHover: "#12A5B2",
        secondaryLightActive: "#0F8089",
        secondaryLightContrast: "#FFFFFF",
        secondary: "linear-gradient(120deg, #68ABF8, #53E492)",
        warning: "#e8ae24",
        error: "#8E1A4A",
        errorLight: "#992857",
        errorLightContrast: "#FEAFD0",
        errorLightHover: "#B54373",
        errorLightActive: "#AB2E63",
        success: "#599B44",
      },
      space: {
        "span.code-line": 0,
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
    <ErrorBoundary>
      <NextThemesProvider
        defaultTheme="system"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          <SetupWrapper>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </SetupWrapper>
        </NextUIProvider>
      </NextThemesProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
