#!/bin/bash

set -euo pipefail

# Check dependencies
for cmd in ffmpeg ffprobe; do
    if ! command -v "$cmd" &>/dev/null; then
        echo "Error: $cmd is not installed."
        exit 1
    fi
done

# Validate input
if [ $# -lt 1 ]; then
    echo "Usage: $0 <video_file>"
    exit 1
fi

INPUT="$1"
if [ ! -f "$INPUT" ]; then
    echo "Error: File '$INPUT' not found."
    exit 1
fi

# Extract video name without extension
VIDEO_NAME=$(basename "$INPUT" | sed 's/\.[^.]*$//')
OUTPUT_DIR="./output/${VIDEO_NAME}"

# Detect source resolution
SOURCE_HEIGHT=$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=height -of csv=p=0 "$INPUT")

if [ -z "$SOURCE_HEIGHT" ]; then
    echo "Error: Could not detect video resolution."
    exit 1
fi

echo "Source resolution height: ${SOURCE_HEIGHT}p"

# Define renditions: height:width:video_bitrate:audio_bitrate
RENDITIONS=(
    "360:640:800k:96k"
    "480:854:1400k:128k"
    "720:1280:2800k:128k"
    "1080:1920:5000k:192k"
)

# Filter renditions that exceed source resolution
ACTIVE_RENDITIONS=()
for rendition in "${RENDITIONS[@]}"; do
    IFS=':' read -r height width vbitrate abitrate <<< "$rendition"
    if [ "$height" -le "$SOURCE_HEIGHT" ]; then
        ACTIVE_RENDITIONS+=("$rendition")
    fi
done

if [ ${#ACTIVE_RENDITIONS[@]} -eq 0 ]; then
    echo "Error: Source resolution (${SOURCE_HEIGHT}p) is too low for any rendition."
    exit 1
fi

echo "Generating ${#ACTIVE_RENDITIONS[@]} rendition(s)..."

# Create output directories
mkdir -p "$OUTPUT_DIR"
for rendition in "${ACTIVE_RENDITIONS[@]}"; do
    IFS=':' read -r height width vbitrate abitrate <<< "$rendition"
    mkdir -p "${OUTPUT_DIR}/${height}p"
done

# Build ffmpeg command
CMD="ffmpeg -i \"$INPUT\" -hide_banner"

FILTER_IDX=0
MAP_ARGS=""
OUTPUT_ARGS=""

for rendition in "${ACTIVE_RENDITIONS[@]}"; do
    IFS=':' read -r height width vbitrate abitrate <<< "$rendition"

    CMD+=" -map 0:v:0 -map 0:a:0"

    OUTPUT_ARGS+=" -c:v:${FILTER_IDX} libx264 -preset medium"
    OUTPUT_ARGS+=" -b:v:${FILTER_IDX} ${vbitrate} -maxrate:v:${FILTER_IDX} ${vbitrate} -bufsize:v:${FILTER_IDX} $((${vbitrate%k} * 2))k"
    OUTPUT_ARGS+=" -filter:v:${FILTER_IDX} scale=${width}:${height}"
    OUTPUT_ARGS+=" -c:a:${FILTER_IDX} aac -b:a:${FILTER_IDX} ${abitrate} -ac:a:${FILTER_IDX} 2"

    FILTER_IDX=$((FILTER_IDX + 1))
done

# HLS settings
SEGMENT_DURATION=6

CMD+=" ${OUTPUT_ARGS}"
CMD+=" -f hls"
CMD+=" -hls_time ${SEGMENT_DURATION}"
CMD+=" -hls_list_size 0"
CMD+=" -hls_segment_type mpegts"
CMD+=" -hls_segment_filename \"${OUTPUT_DIR}/%v/segment%03d.ts\""
CMD+=" -master_pl_name master.m3u8"
CMD+=" -var_stream_map \""

STREAM_MAP=""
for i in $(seq 0 $((FILTER_IDX - 1))); do
    [ -n "$STREAM_MAP" ] && STREAM_MAP+=" "
    STREAM_MAP+="v:${i},a:${i}"
done

CMD+="${STREAM_MAP}\""
CMD+=" \"${OUTPUT_DIR}/%v/stream.m3u8\""

# Replace %v placeholders with actual directory names
# ffmpeg uses stream indices for %v, we need to rename after
echo "Running transcode..."
echo "$CMD"
eval "$CMD"

# Rename numbered directories to resolution names
for i in "${!ACTIVE_RENDITIONS[@]}"; do
    IFS=':' read -r height width vbitrate abitrate <<< "${ACTIVE_RENDITIONS[$i]}"
    SRC_DIR="${OUTPUT_DIR}/${i}"
    DST_DIR="${OUTPUT_DIR}/${height}p"
    if [ -d "$SRC_DIR" ] && [ "$SRC_DIR" != "$DST_DIR" ]; then
        # Move contents from numbered dir to named dir
        mv "${SRC_DIR}"/* "${DST_DIR}/" 2>/dev/null || true
        rmdir "$SRC_DIR" 2>/dev/null || true
    fi
done

# Fix master playlist to use resolution directory names
MASTER="${OUTPUT_DIR}/master.m3u8"
if [ -f "$MASTER" ]; then
    for i in "${!ACTIVE_RENDITIONS[@]}"; do
        IFS=':' read -r height width vbitrate abitrate <<< "${ACTIVE_RENDITIONS[$i]}"
        sed -i "s|${i}/stream.m3u8|${height}p/stream.m3u8|g" "$MASTER"
    done
fi

echo ""
echo "Done! Output written to: ${OUTPUT_DIR}/"
echo "Master playlist: ${OUTPUT_DIR}/master.m3u8"
echo ""
echo "Renditions created:"
for rendition in "${ACTIVE_RENDITIONS[@]}"; do
    IFS=':' read -r height width vbitrate abitrate <<< "$rendition"
    echo "  - ${height}p (${width}x${height}, video: ${vbitrate}, audio: ${abitrate})"
done
