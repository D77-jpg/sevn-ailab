"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  SEARCH_KIND_LABEL,
  highlight,
  indexScope,
  searchDocs,
  type SearchDoc,
  type SearchHit,
  type SearchKind,
} from "@/lib/search";

const KIND_ORDER: SearchKind[] = ["writing", "project", "resource"];

function Highlight({ text, query }: { text: string; query: string }) {
  const parts = highlight(text, query);
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark
            key={i}
            className="rounded-[2px] bg-accent-soft px-0.5 text-accent"
          >
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [active, setActive] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results: SearchHit[] = useMemo(
    () => (docs && query.trim() ? searchDocs(docs, query) : []),
    [docs, query],
  );

  /**
   * The list renders grouped by kind, but relevance ranks *across* kinds — and
   * those two orders disagree. Indexing the highlight by relevance rank put it
   * on whichever row held the best match, which is not the top row: searching
   * "Cursor" highlighted the second row, and ArrowDown then moved the highlight
   * *up* the screen.
   *
   * So the highlight is indexed by display position. This is the single source
   * of truth for the render order, the option ids, the arrow keys and Enter.
   */
  const groups = useMemo(() => {
    // Keep each hit's relevance rank so groups can be ordered by their best one.
    const byKind = new Map<SearchKind, { hit: SearchHit; rank: number }[]>();
    results.forEach((hit, rank) => {
      const list = byKind.get(hit.doc.kind) ?? [];
      list.push({ hit, rank });
      byKind.set(hit.doc.kind, list);
    });

    const bestRank = (kind: SearchKind) =>
      Math.min(...(byKind.get(kind) ?? []).map((x) => x.rank));

    let cursor = 0;
    return KIND_ORDER.filter((kind) => byKind.has(kind))
      // The group holding the best match leads, so the row the highlight starts
      // on is also the best answer. A fixed kind order would instead let the
      // *kind* decide: searching "Cursor" put an article that mentions Cursor
      // above the Cursor record, and Enter opened the article.
      .sort((a, b) => bestRank(a) - bestRank(b))
      .map((kind) => ({
        kind,
        items: (byKind.get(kind) ?? []).map(({ hit }) => ({
          hit,
          index: cursor++,
        })),
      }));
  }, [results]);

  /** Display order, flattened. `active` indexes into this. */
  const ordered = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  /** Ids in display order, so `aria-activedescendant` names the visible row. */
  const optionIds = useMemo(
    () => ordered.map((_, i) => `search-option-${i}`),
    [ordered],
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  // ── Global shortcut ──────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // "/" opens too, but not while typing into a field.
      if (e.key === "/" && !open) {
        const t = e.target as HTMLElement | null;
        const typing =
          t &&
          (t.tagName === "INPUT" ||
            t.tagName === "TEXTAREA" ||
            t.isContentEditable);
        if (!typing) {
          e.preventDefault();
          setOpen(true);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // ── Fetch the index on first open ────────────────────────────────────────
  useEffect(() => {
    if (!open || docs) return;
    let cancelled = false;
    fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: SearchDoc[]) => {
        if (!cancelled) setDocs(data);
      })
      .catch(() => {
        if (!cancelled) setDocs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, docs]);

  // ── Focus + scroll lock while open ───────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Read the ref now: by cleanup time it may point at a different node.
    const trigger = triggerRef.current;
    inputRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
      // Return focus to wherever the user was, so the dialog doesn't strand them.
      (previouslyFocused ?? trigger)?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep the highlighted row in view during keyboard navigation.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `#${optionIds[active]}`,
    );
    el?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open, ordered.length]);

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (ordered.length ? (i + 1) % ordered.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) =>
        ordered.length ? (i - 1 + ordered.length) % ordered.length : 0,
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = ordered[active];
      if (item) go(item.hit.doc.href);
      return;
    }
    // Tab would otherwise escape the dialog into the page behind it.
    if (e.key === "Tab") {
      e.preventDefault();
    }
  }

  const scope = docs ? indexScope(docs) : null;
  const total = scope ? scope.writing + scope.project + scope.resource : 0;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="搜索"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="group inline-flex h-8 items-center gap-2 rounded-full border border-line bg-surface px-3 text-muted transition-colors duration-200 hover:border-line-strong hover:text-ink"
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="h-[14px] w-[14px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <circle cx="7" cy="7" r="4.4" />
          <path d="M10.4 10.4 14 14" strokeLinecap="round" />
        </svg>
        <span className="hidden text-[13px] text-faint transition-colors duration-200 group-hover:text-muted sm:inline">
          搜索
        </span>
        <kbd className="mono-xs hidden items-center gap-0.5 px-1 text-faint md:inline-flex">
          ⌘K
        </kbd>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh] pb-8"
            role="presentation"
          >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="关闭搜索"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-[2px]"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="站内搜索"
            className="relative flex max-h-[70vh] w-full max-w-[38rem] flex-col overflow-hidden rounded-md border border-line bg-surface"
            style={{ boxShadow: "var(--shadow-3)" }}
          >
            {/* Input row */}
            <div className="flex items-center gap-3 border-b border-line px-4">
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="h-4 w-4 shrink-0 text-faint"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <circle cx="7" cy="7" r="4.4" />
                <path d="M10.4 10.4 14 14" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-results"
                aria-activedescendant={
                  ordered.length ? optionIds[active] : undefined
                }
                aria-autocomplete="list"
                aria-label="搜索文章、项目与资源"
                autoComplete="off"
                spellCheck={false}
                placeholder="搜索文章、项目、资源…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                className="h-14 w-full min-w-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
              />
              <button
                type="button"
                onClick={close}
                className="mono-xs shrink-0 rounded-[3px] border border-line px-1.5 py-1 text-faint transition-colors duration-200 hover:border-line-strong hover:text-ink"
              >
                Esc
              </button>
            </div>

            {/* Results */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {!docs ? (
                <p className="mono-xs px-4 py-8 text-center">正在载入索引…</p>
              ) : !query.trim() ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-[14px] text-muted">
                    输入关键词开始搜索。
                  </p>
                  <p className="mono-xs mt-2">
                    覆盖 {total} 条记录 · 文章 {scope?.writing} · 项目{" "}
                    {scope?.project} · 资源 {scope?.resource}
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-[14px] text-ink-2">
                    没有匹配「{query.trim()}」的内容。
                  </p>
                  <p className="mono-xs mt-2">
                    试试更短的关键词，或者去
                    <Link
                      href="/writing"
                      onClick={close}
                      className="ml-1 underline decoration-line-strong underline-offset-2 hover:text-accent"
                    >
                      文章列表
                    </Link>
                    翻一翻。
                  </p>
                </div>
              ) : (
                <ul ref={listRef} id="search-results" role="listbox" className="py-1">
                  {groups.map((group) => {
                    return (
                      // `group` is the only non-option child a listbox allows,
                      // and it carries the section name so the visible label
                      // can stay aria-hidden instead of becoming a stray
                      // paragraph node inside the listbox.
                      <li
                        key={group.kind}
                        role="group"
                        aria-label={SEARCH_KIND_LABEL[group.kind]}
                      >
                        <p aria-hidden className="eyebrow px-4 pt-3 pb-1.5">
                          {SEARCH_KIND_LABEL[group.kind]}
                        </p>
                        <ul role="presentation">
                          {group.items.map(({ hit, index }) => {
                            const selected = index === active;
                            return (
                              <li
                                key={hit.doc.href + hit.doc.title}
                                id={optionIds[index]}
                                role="option"
                                aria-selected={selected}
                                onClick={() => go(hit.doc.href)}
                                onMouseEnter={() => setActive(index)}
                                className="relative cursor-pointer px-4 py-2.5"
                                style={
                                  selected
                                    ? { background: "var(--accent-soft)" }
                                    : undefined
                                }
                              >
                                {selected && (
                                  <span
                                    aria-hidden
                                    className="absolute top-0 bottom-0 left-0 w-[2px]"
                                    style={{ background: "var(--accent)" }}
                                  />
                                )}
                                <div className="flex items-baseline justify-between gap-4">
                                  <span className="min-w-0 text-[14px] leading-snug font-medium text-ink">
                                    <Highlight
                                      text={hit.doc.title}
                                      query={query}
                                    />
                                  </span>
                                  <span className="mono-xs shrink-0">
                                    {hit.doc.meta}
                                  </span>
                                </div>
                                <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted">
                                  <Highlight
                                    text={hit.snippet ?? hit.doc.summary}
                                    query={query}
                                  />
                                </p>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer legend */}
            <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5">
              <p className="mono-xs flex items-center gap-3">
                <span>
                  <kbd className="text-ink-2">↑↓</kbd> 选择
                </span>
                <span>
                  <kbd className="text-ink-2">↵</kbd> 打开
                </span>
              </p>
              <p className="mono-xs" role="status" aria-live="polite">
                {query.trim() && docs
                  ? `${results.length} 条结果`
                  : ""}
              </p>
            </div>
          </div>
          </div>,
          // Portalled to <body>: the header sets backdrop-filter, which makes it
          // a containing block for fixed-position descendants — inside the
          // header, `fixed inset-0` would be clipped to the header box.
          document.body,
        )}
    </>
  );
}
