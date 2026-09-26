/**
 * Guards the links between the two sites.
 *
 * Every AILAB article that sets `gradTopic` must point at a topic that exists
 * in GRADLAB, with the same title — otherwise the article CTA becomes a 404
 * or advertises a topic under a stale name. Run by `npm run check`.
 */
import fs from "node:fs";
import path from "node:path";

const topicsSrc = fs.readFileSync("apps/gradlab/src/lib/topics.ts", "utf8");
const topics = new Map(
  [...topicsSrc.matchAll(/slug: "([a-z0-9-]+)",\n\s+title: "([^"]+)"/g)].map((m) => [m[1], m[2]]),
);
if (topics.size === 0) {
  console.error("check-cross-links: could not read any topic from topics.ts");
  process.exit(1);
}

const dir = "apps/sevnai/content/writing";
let errors = 0;
let linked = 0;
for (const file of fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
  const fm = fs.readFileSync(path.join(dir, file), "utf8").split("\n---")[0];
  const slug = fm.match(/^gradTopic: "([^"]+)"/m)?.[1];
  const title = fm.match(/^gradTopicTitle: "([^"]+)"/m)?.[1];
  if (!slug && !title) continue;
  linked++;
  if (!slug || !title) {
    console.error(`${file}: gradTopic 和 gradTopicTitle 必须同时设置`);
    errors++;
  } else if (!topics.has(slug)) {
    console.error(`${file}: gradTopic "${slug}" 在 GRADLAB 选题库里不存在`);
    errors++;
  } else if (topics.get(slug) !== title) {
    console.error(`${file}: 标题与 GRADLAB 不一致\n  文章里: ${title}\n  选题库: ${topics.get(slug)}`);
    errors++;
  }
}
if (errors) process.exit(1);
console.log(`check-cross-links: ${linked} 篇文章链接到 GRADLAB 选题，全部有效`);
