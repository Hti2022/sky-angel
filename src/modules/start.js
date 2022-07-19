import AudioStream from "../classes/AudioStream.js"
import objects from "../libs/objects.js"
import chunk from "./chunk.js"
import history from "./history.js"

const {gameGuide} = objects
const start = {
  bgAudio: new AudioStream("background.mp3", (audio) => {
    audio.loop = true
  }),
  load() {
    this.show()
    // 加载History的点击事件
    history.initEvent()
    // 渲染历史记录
    history.render()
    gameGuide.start.onclick = () => {
      gameGuide.start.onclick = null
      this.hide()
      chunk.show()
      // 卸载History的点击事件
      history.destroyEvent()
      // 播放背景音乐
      this.bgAudio.play()
    }
  },
  show() {
    gameGuide.self.classList.remove("hidden")
  },
  hide() {
    gameGuide.self.classList.add("hidden")
  }
}

export default start
