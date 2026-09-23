import GithubSlugger from "github-slugger";

export type Heading = { depth: number; text: string; id: string };

/**
 * Extracts the table of contents from a Markdown body.
 *
 * Every heading level is fed through the slugger — not just the ones we
 * display — so the generated ids stay byte-identical to what `rehype-slug`
 * produces when the same document is compiled.
 */
export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length;
    const text = match[2]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[`*_~]/g, "")
      .trim();

    const id = slugger.slug(text);
    if (depth === 2 || depth === 3) headings.push({ depth, text, id });
  }

  return headings;
}
