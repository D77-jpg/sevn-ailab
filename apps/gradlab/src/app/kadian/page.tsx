import type { Metadata } from "next";

import { PageHero } from "@sevn/ui";

import { KadianList } from "@/components/kadian-list";
import { getKadianIndex } from "@/lib/kadian";

export const metadata: Metadata = {
  title: "卡点：AI 毕设每个阶段最容易卡住的地方",
  description: "选题、开题、开发、论文、答辩，一篇只解决一个卡点。",
  alternates: { canonical: "/kadian/" },
};

export default function KadianIndexPage() {
  const { published, planned } = getKadianIndex();
  return (
    <>
      <PageHero
        eyebrow="卡点"
        title="一篇只解决一个卡点。"
        lead="按毕设阶段写：选题、开题、开发、论文、答辩。每篇都从一个具体的问题出发，给出能照着做的办法。"
      />
      <section className="section pt-0">
        <div className="shell">
          <KadianList published={published} planned={planned} />
        </div>
      </section>
    </>
  );
}
