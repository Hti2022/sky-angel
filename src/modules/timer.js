import AnimationFrame from "../classes/AnimationFrame.js"
import objects from "../libs/objects.js"
import convert from "../libs/convert.js"
import status from "./status.js"

const {gameChunk} = objects
const timerAnimation = new AnimationFrame(() => {
  timer.update()
})
const timer = {
  counts: 0,
  update() {
    // 每秒减少一点燃料
    status.fuelCount--
    gameChunk.duration.innerHTML = convert(++this.counts)
  },
  load() {
    timerAnimation.start(1000)
  },
  unload() {
    timerAnimation.cancel(() => {
      // 重置计数
      this.counts = 0
      gameChunk.duration.innerHTML = "00:00"
    })
  }
}

export default timer
