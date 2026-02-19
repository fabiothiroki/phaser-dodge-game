import { describe, expect, it } from "vitest";
import { movePlayer } from "./movement";

function makeCursors(overrides = {}) {
  return {
    left: { isDown: false },
    right: { isDown: false },
    up: { isDown: false },
    down: { isDown: false },
    ...overrides
  };
}

describe("movePlayer", () => {
  it("moves left", () => {
    const player = { x: 100, y: 100 };
    const cursors = makeCursors({ left: { isDown: true } });

    movePlayer(player, cursors, 50, 200);

    expect(player.x).toBe(90);
    expect(player.y).toBe(100);
  });

  it("moves down", () => {
    const player = { x: 100, y: 100 };
    const cursors = makeCursors({ down: { isDown: true } });

    movePlayer(player, cursors, 50, 200);

    expect(player.x).toBe(100);
    expect(player.y).toBe(110);
  });

  it("cancels horizontal movement when left and right are both pressed", () => {
    const player = { x: 100, y: 100 };
    const cursors = makeCursors({
      left: { isDown: true },
      right: { isDown: true }
    });

    movePlayer(player, cursors, 1000, 200);

    expect(player.x).toBe(100);
    expect(player.y).toBe(100);
  });

  it("cancels vertical movement when up and down are both pressed", () => {
    const player = { x: 100, y: 100 };
    const cursors = makeCursors({
      up: { isDown: true },
      down: { isDown: true }
    });

    movePlayer(player, cursors, 1000, 200);

    expect(player.x).toBe(100);
    expect(player.y).toBe(100);
  });

  it("normalizes diagonal movement to keep the same overall speed", () => {
    const player = { x: 100, y: 100 };
    const cursors = makeCursors({
      right: { isDown: true },
      down: { isDown: true }
    });

    movePlayer(player, cursors, 50, 200);

    expect(player.x).toBeCloseTo(107.0710678, 5);
    expect(player.y).toBeCloseTo(107.0710678, 5);
  });

  it("caps delta to avoid large jumps on slow frames", () => {
    const player = { x: 100, y: 100 };
    const cursors = makeCursors({ right: { isDown: true } });

    movePlayer(player, cursors, 500, 200);

    expect(player.x).toBe(110);
    expect(player.y).toBe(100);
  });

  it("does nothing for invalid delta", () => {
    const player = { x: 100, y: 100 };
    const cursors = makeCursors({ right: { isDown: true } });

    movePlayer(player, cursors, 0, 200);
    movePlayer(player, cursors, -10, 200);
    movePlayer(player, cursors, Number.NaN, 200);

    expect(player.x).toBe(100);
    expect(player.y).toBe(100);
  });

  it("does not throw when cursors are missing", () => {
    const player = { x: 100, y: 100 };

    expect(() => movePlayer(player, undefined, 16, 200)).not.toThrow();
    expect(player.x).toBe(100);
    expect(player.y).toBe(100);
  });

  it("clamps at left/top edges using player radius", () => {
    const player = { x: 21, y: 21, radius: 20 };
    const cursors = makeCursors({
      left: { isDown: true },
      up: { isDown: true }
    });
    const bounds = { width: 800, height: 600 };

    movePlayer(player, cursors, 50, 200, 50, bounds);

    expect(player.x).toBe(20);
    expect(player.y).toBe(20);
  });

  it("clamps at right edge using player radius", () => {
    const player = { x: 780, y: 100, radius: 20 };
    const cursors = makeCursors({ right: { isDown: true } });
    const bounds = { width: 800, height: 600 };

    movePlayer(player, cursors, 50, 200, 50, bounds);

    expect(player.x).toBe(780);
    expect(player.y).toBe(100);
  });

  it("clamps at bottom edge using player radius", () => {
    const player = { x: 100, y: 580, radius: 20 };
    const cursors = makeCursors({ down: { isDown: true } });
    const bounds = { width: 800, height: 600 };

    movePlayer(player, cursors, 50, 200, 50, bounds);

    expect(player.x).toBe(100);
    expect(player.y).toBe(580);
  });
});
