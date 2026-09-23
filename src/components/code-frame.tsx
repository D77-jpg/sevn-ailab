"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";

/** Flattens a rendered code tree back into plain text for the clipboard. */
function toText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");

  const el = node as { props?: { children?: ReactNode } };
  return el.props?.children === undefined ? "" : toText(el.props.children);
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }

  // Legacy fallback for non-secure contexts (e.g. plain-http LAN previews).
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

type PreProps = React.ComponentPropsWithoutRef<"pre"> & {
  "data-language"?: string;
  "data-theme"?: string;
};

/**
 * Wraps every fenced code block with a language label and a copy control.
 * The `<pre>` itself is rendered untouched so Shiki's markup and inline
 * dual-theme variables pass straight through.
 */
export function CodeFrame({ children, ...rest }: PreProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const raw = useMemo(() => toText(children).replace(/\n+$/, ""), [children]);
  const language = rest["data-language"];

  const onCopy = useCallback(async () => {
    const ok = await copyText(raw);
    setState(ok ? "copied" : "failed");
    window.setTimeout(() => setState("idle"), 1600);
  }, [raw]);

  return (
    <div className="code-frame">
      <div className="code-frame__bar">
        <span className="mono-xs">{language ?? "text"}</span>
        <button
          type="button"
          onClick={onCopy}
          className="mono-xs -mr-1 rounded-xs px-2 py-1 transition-colors duration-200 hover:bg-paper-deep hover:text-ink"
          aria-label="复制代码"
        >
          {state === "copied"
            ? "已复制"
            : state === "failed"
              ? "复制失败"
              : "复制"}
        </button>
      </div>
      <pre {...rest}>{children}</pre>
    </div>
  );
}
