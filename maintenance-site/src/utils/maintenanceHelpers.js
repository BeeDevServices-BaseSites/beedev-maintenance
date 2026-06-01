export function getPageKey(mode, slug, slugOverride) {
  if (slugOverride) return slugOverride;

  if (mode === "emergency") {
    return `${slug}-emergency`;
  }

  if (mode === "custom" && slug === "default") {
    return "custom-default";
  }

  return slug;
}

export function buildInactivePage(page, inactiveDefault) {
  return {
    ...inactiveDefault,
    siteName: page.siteName,
    siteUrl: page.siteUrl,
    themeSlug: page.themeSlug,
    returnButtonText: page.returnButtonText,
    showLogo: page.showLogo
  };
}

export function applyTheme(theme) {
  const root = document.documentElement;

  root.style.setProperty("--bg-color", theme.backgroundColor);
  root.style.setProperty("--card-color", theme.cardColor);
  root.style.setProperty("--primary-color", theme.primaryColor);
  root.style.setProperty("--secondary-color", theme.secondaryColor);
  root.style.setProperty("--accent-color", theme.accentColor);
  root.style.setProperty("--text-color", theme.textColor);
  root.style.setProperty("--muted-text-color", theme.mutedTextColor);
  root.style.setProperty("--button-bg-color", theme.buttonBackgroundColor);
  root.style.setProperty("--button-text-color", theme.buttonTextColor);
}

export function applyFavicon(faviconUrl) {
  const defaultFavicon =
    "https://images.thehive-services.com/beeDevServices/Logo_2.png";

  let link = document.querySelector("link[rel='icon']");

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.href = faviconUrl || defaultFavicon;
}