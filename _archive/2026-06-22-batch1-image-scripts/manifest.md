# Batch 1 Image Script Archive

Date: 2026-06-22

## Purpose

This archive contains one-off local helper scripts used during the Batch 1 room image normalisation work.

## Archived files

| Original path | Archived path | Reason |
|---|---|---|
| `install-batch1-images-fast.sh` | `_archive/2026-06-22-batch1-image-scripts/files/install-batch1-images-fast.sh` | One-off helper for installing upgraded Batch 1 images from local Downloads. |
| `install-batch1-images.sh` | `_archive/2026-06-22-batch1-image-scripts/files/install-batch1-images.sh` | Interactive one-off helper for installing upgraded Batch 1 images. |
| `remove-nonpng-images.sh` | `_archive/2026-06-22-batch1-image-scripts/files/remove-nonpng-images.sh` | One-off cleanup helper for removing non-PNG images after reference checks. |

## Evidence

These scripts were untracked local helper scripts after the image-normalisation commit. They are not part of the active runtime, parser, room state, save/load system, tests, or visual renderer.

## Restoration

To restore, move the relevant script back to the repository root and review it before execution.

Example:

```bash
mv _archive/2026-06-22-batch1-image-scripts/files/install-batch1-images-fast.sh .
chmod +x install-batch1-images-fast.sh
