import type { ThemeConfig } from "@/types/theme";

/** Injects CSS variables from active theme into the page */
export function ThemeStyle({ theme }: { theme: ThemeConfig }) {
  const c = theme.tokens.colors;
  const t = theme.tokens.typography;
  const b = theme.tokens.borders;
  const btn = theme.tokens.buttons;
  const card = theme.tokens.cards;
  const header = theme.tokens.header;
  const footer = theme.tokens.footer;
  const spacing = theme.tokens.spacing;

  const css = `
:root {
  --color-primary: ${c.primary};
  --color-secondary: ${c.secondary};
  --color-accent: ${c.accent};
  --color-background: ${c.background};
  --color-surface: ${c.surface};
  --color-text: ${c.text};
  --color-muted-text: ${c.mutedText};
  --color-border: ${c.border};
  --color-success: ${c.success};
  --color-error: ${c.error};
  --color-warning: ${c.warning};

  --font-family: ${t.fontFamily};
  --font-family-heading: ${t.fontFamilyHeading};
  --font-size-base: ${t.fontSizeBase};
  --font-size-sm: ${t.fontSizeSm};
  --font-size-lg: ${t.fontSizeLg};
  --font-size-xl: ${t.fontSizeXl};
  --font-size-2xl: ${t.fontSize2xl};

  --section-spacing: ${spacing.sectionSpacing};
  --container-max-width: ${spacing.containerMaxWidth};
  --container-padding: ${spacing.containerPadding};

  --radius-sm: ${b.radiusSm};
  --radius-md: ${b.radiusMd};
  --radius-lg: ${b.radiusLg};
  --radius-full: ${b.radiusFull};

  --btn-radius: ${btn.borderRadius};
  --btn-padding-x: ${btn.paddingX};
  --btn-padding-y: ${btn.paddingY};

  --card-radius: ${card.borderRadius};
  --card-shadow: ${card.shadow};

  --header-height: ${header.height};
  --footer-bg: ${footer.background};
  --footer-text: ${footer.textColor};
}
`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
