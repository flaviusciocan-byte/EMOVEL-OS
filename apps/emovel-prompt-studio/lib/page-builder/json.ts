// EMOVEL Page Builder Core — tolerant JSON object extraction.
//
// AI models often wrap JSON in code fences or surround it with commentary.
// This helper recovers a single root JSON OBJECT from such output without any
// dependency. It does NOT parse — it only isolates the object text so the
// caller can JSON.parse it. Arrays/other roots are intentionally not extracted:
// a PageBuilderDocument root must be an object.

export type ExtractJsonObjectResult =
  | { ok: true; json: string }
  | { ok: false; errors: string[] };

export function extractJsonObject(input: string): ExtractJsonObjectResult {
  if (typeof input !== "string") {
    return { ok: false, errors: ["Input must be a string."] };
  }

  let text = input.trim();
  if (text.length === 0) {
    return { ok: false, errors: ["Input is empty."] };
  }

  // Unwrap a fenced block (```json ... ``` or ``` ... ```) if a closed fence
  // exists; otherwise keep the full text and rely on brace scanning.
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence && fence[1].trim().length > 0) {
    text = fence[1].trim();
  }

  const start = text.indexOf("{");
  if (start === -1) {
    return { ok: false, errors: ["No JSON object found (missing '{')."] };
  }

  // Walk from the first '{' to its matching '}', respecting string literals and
  // escapes so braces inside strings do not affect the depth count.
  let depth = 0;
  let inString = false;
  let escaped = false;
  let end = -1;

  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (depth !== 0 || end === -1) {
    return { ok: false, errors: ["Unbalanced braces: no matching '}' for the JSON object."] };
  }

  return { ok: true, json: text.slice(start, end + 1) };
}
