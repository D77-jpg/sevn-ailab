/**
 * Renders a JSON-LD data block.
 *
 * The escaping is the whole point of this file. `JSON.stringify` output is
 * placed inside a `<script>` element, and the HTML parser ends that element at
 * the first `</script` it sees — regardless of JavaScript string quoting. So a
 * post title or summary containing `</script>` would close the block early and
 * spill the rest into the document as markup.
 *
 * Escaping `<` as `\u003c` is still valid JSON, still parses identically, and
 * removes the only sequence the HTML parser can trip on. Same for the two other
 * sequences that can confuse parsers inside a script element: `\u2028` and
 * `\u2029` (line/paragraph separators, which are legal in JSON strings but not
 * in JavaScript ones).
 *
 * Note this is a data block, not executable script — CSP's `script-src` does
 * not apply to `type="application/ld+json"`, so it needs no nonce.
 */
export function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  return (
    <script
      type="application/ld+json"
      // The value is JSON we just produced, with the dangerous sequences
      // escaped above — not user-supplied HTML.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
