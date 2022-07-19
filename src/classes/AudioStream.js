// 全局音频上下文
const aCtx = new AudioContext()
// 控制音频的整体增益（音量）。
const gainNode = aCtx.createGain()
// 默认音量
gainNode.gain.value = 0.5
// 节点的输出连接到目标
// aCtx.destination 表示上下文中所有音频的最终目的地
gainNode.connect(aCtx.destination)

class AudioStream {
  // 文件传输状态
  #transfer
  // 创建缓冲区源
  #source = aCtx.createBufferSource()
  // 临时缓冲器
  #tempSource
  #extraConfig

  static setVolume(value = 0.5) {
    gainNode.gain.value = value
  }

  constructor(filename, extraConfig) {
    this.#extraConfig = extraConfig
    this.#transfer = window.fetch(`./src/assets/audio/${filename}`)
      .then(response => response.arrayBuffer())
      .then(buffer => aCtx.decodeAudioData(buffer))
      .then(decoded => {
          this.#source.buffer = this.#tempSource = decoded
          this.#source.connect(gainNode)
          this.#extraConfig?.(this.#source)
        }
      )
  }

  // 重新创建缓冲区源
  #createBuffer() {
    this.#source = aCtx.createBufferSource()
    this.#source.buffer = this.#tempSource
    this.#source.connect(gainNode)
    this.#extraConfig?.(this.#source)
  }

  play(looping) {
    // 加载完成后播放
    this.#transfer.then(() => {
      this.#source.start() // start后将破坏缓冲区源，无法再次调用start
      // 如果启用单次循环播放，则每次start后重新创建缓冲区源
      if (looping) {
        this.#createBuffer()
      }
    })
  }

  stop() {
    this.#transfer.then(() => {
      this.#source.stop()
      // 重新创建一个缓冲区源，
      // 用于执行stop后可以再次执行start
      this.#createBuffer()
    })
  }
}

export default AudioStream
