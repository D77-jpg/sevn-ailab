import type { MDXComponents } from "mdx/types";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { CodeFrame } from "@/components/code-frame";

const prettyCodeOptions: PrettyCodeOptions = {
  // Dual themes: both are emitted as CSS custom properties so the palette
  // can switch with `data-theme` without re-rendering anything.
  // `vitesse-dark` reads beautifully but its punctuation colour sits around
  // 3.2:1 on the code surface; github-dark keeps every token above AA.
  theme: {
    light: "vitesse-light",
    dark: "github-dark-high-contrast",
  },
  // The frame supplies its own background from the design system.
  keepBackground: false,
  defaultLang: { block: "text", inline: "text" },
};

const components: MDXComponents = {
  pre: CodeFrame,
  a: ({ href = "", children, ...rest }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  },
  // Tables scroll horizontally on narrow screens instead of overflowing.
  table: ({ children, ...rest }) => (
    <div className="overflow-x-auto">
      <table {...rest}>{children}</table>
    </div>
  ),
};

/** Compiles a post body into React. Called from the article route. */
export async function renderMarkdown(body: string) {
  const { content } = await compileMDX({
    source: body,
    components,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                className: ["heading-anchor"],
                ariaLabel: "本节锚点",
                tabIndex: -1,
              },
              content: { type: "text", value: "#" },
            },
          ],
          [rehypePrettyCode, prettyCodeOptions],
        ],
      },
    },
  });

  return content;
}
