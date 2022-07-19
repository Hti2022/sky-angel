import AnimationFrame from "../classes/AnimationFrame.js"
import objects from "../libs/objects.js"
import chunk from "./chunk.js"

const {gameChunk} = objects
const statusAnimation = new AnimationFrame(() => {
  status.update()
})
const status = {
  fuelCount: 10,
  starCount: 0,
  killedBirdCount: 0,
  update() {
    if (this.fuelCount > 30) {
      this.fuelCount = 30
    } else if (this.fuelCount <= 0) {
      chunk.unload()
    }
    gameChunk.fuels.innerHTML = this.fuelCount
    gameChunk.stars.innerHTML = this.starCount
  },
  load() {
    statusAnimation.start()
  },
  unload() {
    statusAnimation.cancel(() => {
      gameChunk.fuels.innerHTML = "0"
      gameChunk.stars.innerHTML = "0"
      // 重置计数
      this.fuelCount = 10
      this.starCount = 0
      this.killedBirdCount = 0
    })
  }
}

export default status
