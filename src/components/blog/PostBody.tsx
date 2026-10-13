export type Block =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul"; items: string[] };

/**
 * Plain-text body syntax from the API contract:
 * - blocks are separated by one or more blank lines
 * - a block whose first line starts with "## " is an H2, "### " is an H3
 * - a block whose lines all start with "- " is a bulleted list
 * - any other block is a paragraph (its lines are joined with a space)
 * A heading takes only its own line; the lines after it are parsed as a new block.
 */
export function parseBody(body: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of body.replace(/\r\n?/g, "\n").split(/\n\s*\n/)) {
    pushLines(chunk.split("\n").map((l) => l.trim()).filter(Boolean), blocks);
  }
  return blocks;
}

function pushLines(lines: string[], out: Block[]): void {
  if (lines.length === 0) return;
  const [first, ...rest] = lines;
  if (first.startsWith("## ")) {
    out.push({ type: "h2", text: first.slice(3).trim() });
    pushLines(rest, out);
  } else if (first.startsWith("### ")) {
    out.push({ type: "h3", text: first.slice(4).trim() });
    pushLines(rest, out);
  } else if (lines.every((l) => l.startsWith("- "))) {
    out.push({ type: "ul", items: lines.map((l) => l.slice(2).trim()) });
  } else {
    out.push({ type: "p", text: lines.join(" ") });
  }
}

/** Renders a post body as React text and element nodes only (raw HTML in the body is shown as text). */
export default function PostBody({ body }: { body: string }) {
  return (
    <div className="flex flex-col gap-5 text-base leading-8 text-ink">
      {parseBody(body).map((b, i) => {
        if (b.type === "ul") {
          return (
            <ul key={i} className="list-disc space-y-2 ps-6 marker:text-accent">
              {b.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        if (b.type === "h2") {
          return (
            <h2 key={i} className="mt-6 text-xl font-bold text-ink md:text-2xl">
              {b.text}
            </h2>
          );
        }
        if (b.type === "h3") {
          return (
            <h3 key={i} className="mt-2 text-lg font-bold text-ink">
              {b.text}
            </h3>
          );
        }
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}
