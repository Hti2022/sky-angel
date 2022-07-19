import objects from "../libs/objects.js"
import start from "./start.js"
import convert from "../libs/convert.js"
import timer from "./timer.js"
import status from "./status.js"
import saves from "../libs/saves.js"
import AudioStream from "../classes/AudioStream.js"

const {gameEnding} = objects
const ending = {
  finishAudio: new AudioStream("finish.mp3"),
  load() {
    this.show()
    start.bgAudio.stop()
    this.finishAudio.play()
    gameEnding.replay.onclick = () => {
      gameEnding.replay.onclick = null
      this.hide()
      this.finishAudio.stop()
      start.load()
    }
  },
  show() {
    gameEnding.self.classList.remove("hidden")
    // 统计信息
    gameEnding.statTime.innerHTML = `Time: ${convert(timer.counts)}`
    gameEnding.statStars.innerHTML = `Stars: ${status.starCount}`
    gameEnding.statKilled.innerHTML = `Killed birds: ${status.killedBirdCount}`
    // 将此次游戏的数据保存到localStorage
    saves({
      date: new Date().getTime(),
      times: timer.counts,
      stars: status.starCount,
      killedBirds: status.killedBirdCount
    })
  },
  hide() {
    gameEnding.self.classList.add("hidden")
  },
}

export default ending
