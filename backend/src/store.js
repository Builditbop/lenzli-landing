// Simple, dependency-free durable store for waitlist signups.
// Persists to backend/data/waitlist.json. Good for an MVP waitlist;
// swap for a real DB later without touching the rest of the app.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

// Serialise writes so concurrent requests can't clobber the file.
let writeChain = Promise.resolve();

async function readAll() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === "ENOENT") return []; // first run, no file yet
    throw err;
  }
}

async function persist(list) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
}

/**
 * Add an email to the waitlist.
 * Returns { added: boolean, alreadyJoined: boolean, total: number }.
 * De-duplicates case-insensitively.
 */
export function addEmail(email, source = "landing_page") {
  const normalized = String(email).trim().toLowerCase();

  // Chain onto the previous write to avoid race conditions.
  const result = writeChain.then(async () => {
    const list = await readAll();
    const exists = list.some((e) => e.email === normalized);
    if (exists) {
      return { added: false, alreadyJoined: true, total: list.length };
    }
    list.push({
      email: normalized,
      source,
      timestamp: new Date().toISOString(),
    });
    await persist(list);
    return { added: true, alreadyJoined: false, total: list.length };
  });

  // Keep the chain alive even if this write rejects.
  writeChain = result.catch(() => {});
  return result;
}

export async function getAll() {
  return readAll();
}

export async function count() {
  const list = await readAll();
  return list.length;
}
