class AnimationFrame {
  // 动画框架唯一ID
  #rafID
  // 回调处理程序
  #handler
  // 动画是否被取消
  #canceled = false
  // 动画取消后的回调
  #canceledCallback
  // 所有框架实例的暂停选项
  static #paused = false

  // 暂停
  static pause() {
    this.#paused = true
  }

  // 继续
  static play() {
    this.#paused = false
  }

  constructor(handler) {
    this.#handler = handler
  }

  // 运行框架
  start(ms = 0) {
    let lastTime = Date.now()

    // 每次运行前重置暂停状态
    AnimationFrame.paused = false
    this.#canceled = false
    const animeEngine = () => {
      const now = Date.now()

      if (!this.#canceled) {
        this.#rafID = window.requestAnimationFrame(animeEngine)
      } else {
        window.cancelAnimationFrame(this.#rafID)
        this.#canceledCallback?.(this)
      }
      if (now > lastTime + ms && !AnimationFrame.paused) {
        this.#handler(this)
        lastTime = now
      }
    }

    // 初始化动画引擎
    animeEngine()
  }

  // 取消框架
  cancel(canceledCallback) {
    this.#canceled = true
    this.#canceledCallback = canceledCallback
  }
}

export default AnimationFrame
