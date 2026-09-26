import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">404</p>
        <h1 className="mt-5 max-w-[20ch] font-serif text-h1 text-ink">这个页面不存在。</h1>
        <p className="mt-6 max-w-[52ch] text-lead text-muted">可能是链接写错了，或者这篇卡点还在撰写中。</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">回到首页</Link>
          <Link href="/kadian/" className="btn btn-secondary">看全部卡点</Link>
        </div>
      </div>
    </section>
  );
}
