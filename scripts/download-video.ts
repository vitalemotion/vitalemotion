#!/usr/bin/env npx tsx
/**
 * download-video.ts
 *
 * Downloads two calming stock videos from Pexels for use in the
 * HeroScroll frame-sequence pipeline.
 *
 * Usage:  npx tsx scripts/download-video.ts
 *
 * Requirements:
 *   - Node 18+ (uses built-in fetch)
 *   - No extra npm packages
 */

import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { ReadableStream as NodeReadableStream } from "node:stream/web";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API_KEY = "G20trunMsy5EZcxZ6s4TC0d2Df31dhkFv7kaUoQ46WTAhm6wVbBNEjLu";
const __dirname = import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url));
const TEMP_DIR = path.join(__dirname, "temp");

interface PexelsVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
}

interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  url: string;
  video_files: PexelsVideoFile[];
}

interface PexelsSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  videos: PexelsVideo[];
}

// ── Helpers ──────────────────────────────────────────────────────────

async function searchVideos(query: string): Promise<PexelsSearchResponse> {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Pexels API error ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<PexelsSearchResponse>;
}

function pickBestFile(video: PexelsVideo): PexelsVideoFile | undefined {
  // Prefer HD mp4 files, sorted by width descending
  return video.video_files
    .filter((f) => f.file_type === "video/mp4" && f.width >= 1280)
    .sort((a, b) => b.width - a.width)[0];
}

function pickBestVideo(
  videos: PexelsVideo[],
  minDuration = 6,
): { video: PexelsVideo; file: PexelsVideoFile } | undefined {
  for (const video of videos) {
    if (video.duration < minDuration) continue;
    const file = pickBestFile(video);
    if (file) return { video, file };
  }
  return undefined;
}

async function downloadFile(url: string, dest: string): Promise<void> {
  console.log(`  Downloading → ${dest}`);
  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(`Download failed (${res.status}): ${url}`);
  }

  const ws = createWriteStream(dest);
  if (!res.body) {
    throw new Error(`Download response body missing for ${url}`);
  }
  // Convert ReadableStream to Node Readable
  await pipeline(
    Readable.fromWeb(res.body as unknown as NodeReadableStream<Uint8Array>),
    ws
  );
  console.log("  Done.");
}

// ── Main ─────────────────────────────────────────────────────────────

interface VideoJob {
  name: string;
  queries: string[];
  outputFile: string;
}

const jobs: VideoJob[] = [
  {
    name: "hero",
    queries: [
      "nature calm peaceful forest",
      "sunset ocean meditation",
      "nature therapy wellness",
    ],
    outputFile: path.join(TEMP_DIR, "hero.mp4"),
  },
  {
    name: "servicios",
    queries: [
      "wellness mindfulness",
      "therapy calm interior",
      "nature green peaceful",
    ],
    outputFile: path.join(TEMP_DIR, "servicios.mp4"),
  },
];

async function main() {
  mkdirSync(TEMP_DIR, { recursive: true });

  for (const job of jobs) {
    console.log(`\n=== ${job.name.toUpperCase()} VIDEO ===`);

    if (existsSync(job.outputFile)) {
      console.log(`  Already exists: ${job.outputFile} — skipping.`);
      continue;
    }

    let found: { video: PexelsVideo; file: PexelsVideoFile } | undefined;

    for (const query of job.queries) {
      console.log(`  Searching: "${query}" ...`);
      const data = await searchVideos(query);
      console.log(`  Found ${data.total_results} results (showing ${data.videos.length})`);

      found = pickBestVideo(data.videos);
      if (found) {
        console.log(
          `  Selected video id=${found.video.id}, duration=${found.video.duration}s, ` +
            `resolution=${found.file.width}x${found.file.height}, quality=${found.file.quality}`,
        );
        console.log(`  Pexels page: ${found.video.url}`);
        break;
      }
      console.log("  No suitable video in this batch, trying next query...");
    }

    if (!found) {
      console.error(`  ERROR: Could not find a suitable video for "${job.name}".`);
      process.exit(1);
    }

    await downloadFile(found.file.link, job.outputFile);
  }

  console.log("\nAll downloads complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
