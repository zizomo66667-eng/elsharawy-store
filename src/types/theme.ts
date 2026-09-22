// src/types/theme.ts
// Theme Schema & Design Tokens

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    border: string;
    success: string;
    error: string;
    warning: string;
  };
  typography: {
    fontFamily: string;
    fontFamilyHeading: string;
    fontSizeBase: string;
    fontSizeSm: string;
    fontSizeLg: string;
    fontSizeXl: string;
    fontSize2xl: string;
    fontWeightNormal: number;
    fontWeightMedium: number;
    fontWeightBold: number;
    lineHeight: number;
  };
  spacing: {
    sectionSpacing: string;
    containerMaxWidth: string;
    containerPadding: string;
  };
  borders: {
    radiusSm: string;
    radiusMd: string;
    radiusLg: string;
    radiusFull: string;
  };
  buttons: {
    borderRadius: string;
    paddingX: string;
    paddingY: string;
    fontWeight: number;
  };
  cards: {
    borderRadius: string;
    shadow: string;
    padding: string;
  };
  header: {
    height: string;
    sticky: boolean;
    background: string;
  };
  footer: {
    background: string;
    textColor: string;
  };
}

export interface ThemeConfig {
  name: string;
  tokens: DesignTokens;
  layout: {
    productCardStyle: "minimal" | "bordered" | "elevated";
    productGridColumns: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    headerStyle: "simple" | "centered" | "split";
    footerStyle: "simple" | "multi-column";
  };
}

// Default Theme (Luxury - Black + Cream)
export const defaultTheme: ThemeConfig = {
  name: "Luxury",
  tokens: {
    colors: {
      primary: "#1a1a1a",
      secondary: "#f5f0e8",
      accent: "#c9a87c",
      background: "#ffffff",
      surface: "#faf8f5",
      text: "#1a1a1a",
      mutedText: "#6b6b6b",
      border: "#e5e0d8",
      success: "#16a34a",
      error: "#dc2626",
      warning: "#d97706",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontFamilyHeading: "Playfair Display, serif",
      fontSizeBase: "16px",
      fontSizeSm: "14px",
      fontSizeLg: "18px",
      fontSizeXl: "20px",
      fontSize2xl: "24px",
      fontWeightNormal: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      lineHeight: 1.6,
    },
    spacing: {
      sectionSpacing: "4rem",
      containerMaxWidth: "1280px",
      containerPadding: "1rem",
    },
    borders: {
      radiusSm: "4px",
      radiusMd: "8px",
      radiusLg: "12px",
      radiusFull: "9999px",
    },
    buttons: {
      borderRadius: "8px",
      paddingX: "1.5rem",
      paddingY: "0.75rem",
      fontWeight: 500,
    },
    cards: {
      borderRadius: "12px",
      shadow: "0 1px 3px rgba(0,0,0,0.08)",
      padding: "1rem",
    },
    header: {
      height: "64px",
      sticky: true,
      background: "#ffffff",
    },
    footer: {
      background: "#1a1a1a",
      textColor: "#f5f0e8",
    },
  },
  layout: {
    productCardStyle: "minimal",
    productGridColumns: {
      mobile: 2,
      tablet: 3,
      desktop: 4,
    },
    headerStyle: "simple",
    footerStyle: "multi-column",
  },
};
