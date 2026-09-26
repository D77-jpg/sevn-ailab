"use client";

import { useMemo, useState } from "react";

import { track } from "@/lib/track";

type Option = { value: string; label: string };

const DIRECTIONS: Option[] = [
  { value: "RAG 知识库问答", label: "RAG 知识库" },
  { value: "Agent / 工具调用", label: "Agent / 工具调用" },
  { value: "AIGC 生成", label: "AIGC 生成" },
  { value: "大模型应用，还没定具体方向", label: "还没想好" },
  { value: "other", label: "不是 AI 方向" },
];

const STAGES: Option[] = [
  { value: "还没选题", label: "还没选题" },
  { value: "有题目了，还没开题", label: "有题目，没开题" },
  { value: "开题完成，正在开发", label: "开题完，在开发" },
  { value: "开发卡住了", label: "开发卡住了" },
  { value: "准备答辩", label: "准备答辩" },
];

const WEEKS: Option[] = [
  { value: "不到 4 周", label: "< 4 周" },
  { value: "4–8 周", label: "4–8 周" },
  { value: "8–12 周", label: "8–12 周" },
  { value: "12 周以上", label: "> 12 周" },
];

/**
 * The consult section's "message builder".
 *
 * Instead of a form with a backend, the student picks three answers and the
 * page composes the first message for them to paste into WeChat (or send by
 * email). Zero backend, same as the rest of the site — and the first message
 * already contains the three things needed to answer "can this be done in
 * time?", which is always the first question.
 */
export function ConsultBuilder({
  wechat,
  email,
  topicTitle,
  referral,
}: {
  wechat: string;
  email: string;
  /** Pre-fills the message when the builder sits on a topic page. */
  topicTitle?: string;
  referral: { name: string; url: string; note: string } | null;
}) {
  const [direction, setDirection] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  const [weeks, setWeeks] = useState<string>("");
  const [copied, setCopied] = useState<"" | "message" | "wechat">("");

  const notAi = direction === "other";
  const tight = weeks === "不到 4 周" && (stage === "还没选题" || stage === "有题目了，还没开题");

  const message = useMemo(() => {
    const lines = ["你好，我是在 SEVN GRADLAB 看到你的。"];
    if (topicTitle) lines.push(`我对「${topicTitle}」这个题目感兴趣。`);
    if (direction && !notAi) lines.push(`方向：${direction}`);
    if (stage) lines.push(`进度：${stage}`);
    if (weeks) lines.push(`距离答辩：${weeks}`);
    lines.push("学校 / 专业：");
    lines.push("想先聊的问题：");
    return lines.join("\n");
  }, [direction, stage, weeks, topicTitle, notAi]);

  async function copy(text: string, what: "message" | "wechat") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      track(what === "message" ? "copy_message" : "copy_wechat");
      window.setTimeout(() => setCopied(""), 2200);
    } catch {
      /* Clipboard blocked: the text is visible and selectable anyway. */
    }
  }

  const mailto = `mailto:${email}?subject=${encodeURIComponent(
    "毕设咨询",
  )}&body=${encodeURIComponent(message)}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <div className="space-y-8">
        <Choice label="方向" options={DIRECTIONS} value={direction} onChange={setDirection} />
        <Choice label="现在的进度" options={STAGES} value={stage} onChange={setStage} />
        <Choice label="距离答辩还有" options={WEEKS} value={weeks} onChange={setWeeks} />
      </div>

      <div aria-live="polite">
        {notAi && referral ? (
          <div className="border border-line bg-surface p-6 md:p-7" style={{ borderRadius: "var(--radius-md)" }}>
            <p className="mono-xs">建议</p>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink">
              这里只做 AI 方向。{referral.note}
            </p>
            <a
              href={referral.url}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => track("referral_click", referral.name)}
              className="btn btn-secondary mt-6"
            >
              去看看{referral.name} ↗
            </a>
          </div>
        ) : (
          <div className="border border-line bg-surface" style={{ borderRadius: "var(--radius-md)" }}>
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <p className="mono-xs">第一条消息</p>
              <p className="mono-xs">可以直接改</p>
            </div>
            <pre className="px-5 py-5 font-sans text-[15px] leading-[1.8] whitespace-pre-wrap text-ink-2">
              {message}
            </pre>

            {tight && (
              <p className="mx-5 mb-5 border-l-2 border-build pl-4 text-[14px] leading-relaxed text-muted">
                时间很紧。少于 4 周从零开始，我会先如实告诉你能做到哪一步，再决定要不要开始。
              </p>
            )}

            <div className="flex flex-wrap gap-3 border-t border-line px-5 py-5">
              <button type="button" className="btn btn-primary" onClick={() => copy(message, "message")}>
                {copied === "message" ? "已复制消息" : "复制消息"}
              </button>
              {wechat ? (
                <button type="button" className="btn btn-secondary" onClick={() => copy(wechat, "wechat")}>
                  {copied === "wechat" ? "已复制微信号" : `复制微信号 ${wechat}`}
                </button>
              ) : null}
              <a href={mailto} onClick={() => track("open_mail")} className="btn btn-ghost">
                用邮件发送
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Choice({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mono-xs">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? "" : o.value)}
              className={`min-h-10 rounded-full border px-4 py-2 text-[14px] transition-colors duration-200 ${
                selected
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line text-ink-2 hover:border-line-strong hover:text-ink"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
