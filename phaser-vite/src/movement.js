export function movePlayer(
  player,
  cursors,
  delta,
  speed = 200,
  maxDelta = 50,
  bounds
) {
  if (!player || !cursors) return;
  if (!Number.isFinite(delta) || delta <= 0) return;

  const clampedDelta = Math.min(delta, maxDelta);
  const dt = clampedDelta / 1000;

  const horizontal =
    (cursors.right?.isDown ? 1 : 0) - (cursors.left?.isDown ? 1 : 0);
  const vertical = (cursors.down?.isDown ? 1 : 0) - (cursors.up?.isDown ? 1 : 0);

  if (horizontal === 0 && vertical === 0) return;

  const length = Math.hypot(horizontal, vertical);
  const vx = horizontal / length;
  const vy = vertical / length;

  player.x += vx * speed * dt;
  player.y += vy * speed * dt;

  if (!bounds) return;

  const radius = Number.isFinite(player.radius) ? player.radius : 0;
  const minX = radius;
  const maxX = bounds.width - radius;
  const minY = radius;
  const maxY = bounds.height - radius;

  player.x = Math.max(minX, Math.min(maxX, player.x));
  player.y = Math.max(minY, Math.min(maxY, player.y));
}
