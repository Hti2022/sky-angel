import objects from "../libs/objects.js"
import AnimationFrame from "../classes/AnimationFrame.js"
import AudioStream from "../classes/AudioStream.js"

const {gameChunk} = objects
const {controls} = gameChunk
// 取消空格的默认事件，在焦点状态下按下空格会调用
for (const control in controls) {
  controls[control].onkeydown = ev => ev.preventDefault()
}
const control = {
  state: {
    size: 18,
    muted: false
  },
  sizeDecrement() {
    controls.sizeDecrement.onclick = () => {
      if (this.state.size <= 18) return
      gameChunk.self.style.fontSize = `${--this.state.size}px`
    }
  },
  sizeIncrement() {
    controls.sizeIncrement.onclick = () => {
      if (this.state.size >= 36) return
      gameChunk.self.style.fontSize = `${++this.state.size}px`
    }
  },
  toggleMuteStatus() {
    controls.toggleMuteState.onclick = () => {
      if (this.state.muted) {
        this.state.muted = !this.state.muted
        controls.toggleMuteState.innerHTML = "Mute"
        AudioStream.setVolume()
      } else {
        this.state.muted = !this.state.muted
        controls.toggleMuteState.innerHTML = "Unmute"
        AudioStream.setVolume(0)
      }
    }
  },
  toggleRunStatus() {
    controls.toggleRunState.onclick = () => {
      // 拥有CSS动画轨迹的实体
      const hasCssAnimationEntities = [...gameChunk.getStarEntities(), ...gameChunk.getFuelEntities()]

      if (AnimationFrame.paused) {
        controls.toggleRunState.innerHTML = "Pause"
        AnimationFrame.play()
        // 继续的时候，实体若拥有【暂停该动画】的标记则移除
        hasCssAnimationEntities
          .filter((entity) => entity.classList.contains("pause-css-animation"))
          .forEach((entity) => {
            entity.classList.remove("pause-css-animation")
          })
      } else {
        controls.toggleRunState.innerHTML = "Play"
        AnimationFrame.pause()
        // 拥有【CSS动画轨迹】类名标记的，暂停的时候添加上【暂停该动画】的标记
        hasCssAnimationEntities
          .filter((entity => entity.classList.contains("move-to-icon")))
          .forEach((entity) => {
            entity.classList.add("pause-css-animation")
          })
      }
    }
  },
  load() {
    this.sizeDecrement()
    this.sizeIncrement()
    this.toggleRunStatus()
    this.toggleMuteStatus()
  },
  unload() {
    // 移除事件
    for (const control in controls) {
      controls[control].onclick = null
    }
  }
}

export default control
