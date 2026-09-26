/**
 * Search types and matching logic.
 *
 * This module must stay free of `node:fs` — the search dialog is a client
 * component and imports it. Index *construction* lives in `search-index.ts`,
 * which is server-only.
 */

export type SearchKind = "writing" | "project" | "resource";

export type SearchDoc = {
  kind: SearchKind;
  /** Route to open when the result is chosen. */
  href: string;
  title: string;
  summary: string;
  /** Right-hand mono metadata — category, status, group. */
  meta: string;
  tags: string[];
  /** Plain text, used for full-text matching and snippet extraction. */
  body: string;
};

export const SEARCH_KIND_LABEL: Record<SearchKind, string> = {
  writing: "文章",
  project: "项目",
  resource: "资源",
};

export type SearchHit = {
  doc: SearchDoc;
  score: number;
  /** Body excerpt around the first match, when the hit came from the body. */
  snippet?: string;
};

const FIELD_WEIGHT = {
  title: 100,
  tag: 45,
  summary: 25,
  meta: 12,
  body: 6,
} as const;

function normalize(s: string): string {
  return s.toLowerCase();
}

/**
 * Split a query into terms. CJK has no word boundaries, so a CJK run stays a
 * single term and matches by substring; Latin runs are split on punctuation
 * and whitespace. Every term must match somewhere (AND), which keeps "mcp 工具"
 * from returning every MCP article regardless of topic.
 */
export function queryTerms(query: string): string[] {
  return normalize(query)
    .split(/[\s,，、/|]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Take a readable window around the first match. */
function excerpt(text: string, term: string, radius = 44): string | undefined {
  const i = normalize(text).indexOf(term);
  if (i === -1) return undefined;
  const start = Math.max(0, i - radius);
  const end = Math.min(text.length, i + term.length + radius);
  return (
    (start > 0 ? "…" : "") +
    text.slice(start, end).trim() +
    (end < text.length ? "…" : "")
  );
}

export function searchDocs(
  docs: SearchDoc[],
  query: string,
  limit = 24,
): SearchHit[] {
  const ts = queryTerms(query);
  if (!ts.length) return [];

  const hits: SearchHit[] = [];

  for (const doc of docs) {
    const title = normalize(doc.title);
    const summary = normalize(doc.summary);
    const meta = normalize(doc.meta);
    const tags = doc.tags.map(normalize);
    const body = normalize(doc.body);

    let score = 0;
    let firstBodyTerm: string | undefined;
    let matchedAll = true;

    for (const t of ts) {
      let termScore = 0;

      if (title.includes(t)) {
        termScore += FIELD_WEIGHT.title;
        // A title that *starts* with the query is almost certainly the intent.
        if (title.startsWith(t)) termScore += 60;
      }
      if (tags.some((tag) => tag.includes(t))) termScore += FIELD_WEIGHT.tag;
      if (summary.includes(t)) termScore += FIELD_WEIGHT.summary;
      if (meta.includes(t)) termScore += FIELD_WEIGHT.meta;
      if (body.includes(t)) {
        termScore += FIELD_WEIGHT.body;
        if (!firstBodyTerm) firstBodyTerm = t;
      }

      if (termScore === 0) {
        matchedAll = false;
        break;
      }
      score += termScore;
    }

    if (!matchedAll) continue;

    // Titles are short and precise; nudge them ahead of body-only matches.
    score += Math.max(0, 40 - doc.title.length) / 4;

    hits.push({
      doc,
      score,
      snippet: firstBodyTerm ? excerpt(doc.body, firstBodyTerm) : undefined,
    });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Counts per kind, for the empty-state hint in the dialog. */
export function indexScope(docs: SearchDoc[]): Record<SearchKind, number> {
  return {
    writing: docs.filter((d) => d.kind === "writing").length,
    project: docs.filter((d) => d.kind === "project").length,
    resource: docs.filter((d) => d.kind === "resource").length,
  };
}

/**
 * Split a string into alternating plain/matched segments so the UI can wrap the
 * matched parts in <mark> without dangerouslySetInnerHTML.
 */
export function highlight(
  text: string,
  query: string,
): { text: string; hit: boolean }[] {
  const ts = queryTerms(query).filter((t) => t.length > 0);
  if (!ts.length) return [{ text, hit: false }];

  const lower = normalize(text);
  const ranges: [number, number][] = [];

  for (const t of ts) {
    let from = 0;
    for (;;) {
      const i = lower.indexOf(t, from);
      if (i === -1) break;
      ranges.push([i, i + t.length]);
      from = i + t.length;
    }
  }
  if (!ranges.length) return [{ text, hit: false }];

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([...r]);
  }

  const out: { text: string; hit: boolean }[] = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) out.push({ text: text.slice(cursor, start), hit: false });
    out.push({ text: text.slice(start, end), hit: true });
    cursor = end;
  }
  if (cursor < text.length) out.push({ text: text.slice(cursor), hit: false });
  return out;
}
