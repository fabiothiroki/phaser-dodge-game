import Phaser from "phaser";
import { movePlayer } from "./movement";

class MainScene extends Phaser.Scene {
  constructor() {
    super("main");
  }

  create() {
    const { width, height } = this.scale;
    this.player = this.add.circle(width / 2, height / 2, 20, 0x4fc3f7);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    movePlayer(this.player, this.cursors, delta, 200, 50, this.scale);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 800,
  height: 600,
  backgroundColor: "#111111",
  scene: MainScene
};

new Phaser.Game(config);
