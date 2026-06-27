/**
 * Parses an uptime string in the "0d 0h 0m 0s" format into total seconds.
 * Ported from e2e-tests/helpers/uptime-parser.js, fixing its latent bug
 * (it iterated with `uptimeSubstrings.count`, which is `undefined` on an
 * array — the original loop never ran).
 */
const MULTIPLIERS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60
};

export default function parseUptimeSeconds(uptime: string): number {
  let total = 0;
  for (const part of uptime.trim().split(/\s+/)) {
    if (!part) continue;
    const unit = part.slice(-1);
    const value = parseInt(part.slice(0, -1), 10);
    if (!Number.isNaN(value) && unit in MULTIPLIERS) {
      total += value * MULTIPLIERS[unit];
    }
  }
  return total;
}
