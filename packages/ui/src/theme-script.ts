/**
 * Resolves the theme before first paint so there is never a flash of the
 * wrong palette. Runs synchronously in <head>; deliberately tiny.
 *
 * Both sites read the same storage key, so a visitor who picked dark mode on
 * one site gets it on the other too when they share an origin (subdomains
 * don't, which is fine — the OS preference still applies).
 */
export const THEME_STORAGE_KEY = "sevn-theme";

export const themeScript = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;
