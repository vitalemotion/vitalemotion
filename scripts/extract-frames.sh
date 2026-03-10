#!/bin/bash
# extract-frames.sh
#
# Extracts a sequence of WebP frames from an MP4 video using FFmpeg.
#
# Usage:
#   ./extract-frames.sh <input.mp4> <output_dir> [frame_count]
#
# Example:
#   ./extract-frames.sh scripts/temp/hero.mp4 public/frames/hero 192

set -euo pipefail

INPUT="${1:?Usage: $0 <input.mp4> <output_dir> [frame_count]}"
OUTPUT_DIR="${2:?Usage: $0 <input.mp4> <output_dir> [frame_count]}"
FRAME_COUNT="${3:-192}"

if ! command -v ffmpeg &>/dev/null; then
  echo "ERROR: ffmpeg is not installed or not in PATH."
  echo "On NixOS, try:  nix-shell -p ffmpeg --run '$0 $*'"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "Input:       $INPUT"
echo "Output dir:  $OUTPUT_DIR"
echo "Frame count: $FRAME_COUNT"
echo ""

ffmpeg -y -i "$INPUT" \
  -vframes "$FRAME_COUNT" \
  -vf "scale=1920:-1" \
  -c:v libwebp \
  -quality 80 \
  "$OUTPUT_DIR/frame_%04d.webp"

ACTUAL=$(ls -1 "$OUTPUT_DIR"/frame_*.webp 2>/dev/null | wc -l)
echo ""
echo "Extracted $ACTUAL frames to $OUTPUT_DIR"
