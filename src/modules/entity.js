import objects from "../libs/objects.js"
import AnimationFrame from "../classes/AnimationFrame.js"
import overflow from "../libs/overflow.js"
import status from "./status.js"
import AudioStream from "../classes/AudioStream.js"

const {gameChunk} = objects

const starAudio = new AudioStream("star.mp3")
const hitAudio = new AudioStream("hit.mp3")

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomDirection = () => ["-", ""][random(0, 1)]

const moveToIcon = (entity, moveTo, animationEndCallback) => {
  // 设置自定义CSS属性，CSS Animation根据--to-x 和--to-y 进行移动
  entity.setAttribute("style", `left:${entity.offsetLeft}px;top:${entity.offsetTop}px;--to-x:${moveTo.offsetLeft}px;--to-y:${moveTo.offsetTop}px`)
  // 标记这是一个由CSS Animation控制的动画轨迹
  entity.classList.add("move-to-icon")
  // 添加CSS动画结束事件
  entity.addEventListener("animationend", () => {
    animationEndCallback(entity)
  })
}

const entityAnimation = new AnimationFrame(() => {
  entity.spawner()
})
const trackAnimation = new AnimationFrame(() => {
  const entities = gameChunk.getEntities()

  entities.forEach(entity => {
    const {offsetTop, offsetLeft, tracks} = entity

    if (entity.collied) {
      if (entity.classList.contains("birds")) {
        const {x, y} = entity.colliedTracks
        entity.style.transform = `rotate(${entity.state.rotate += 7}deg)`
        entity.style.left = `${offsetLeft + x}px`
        entity.style.top = `${offsetTop + y}px`
      }
    } else {
      if (tracks.x !== 0) {
        entity.style.left = `${offsetLeft + tracks.x}px`
      }
      if (tracks.y !== 0) {
        entity.style.top = `${offsetTop + tracks.y}px`
      }
    }

    overflow(entity)
  })
})

const entity = {
  spawnConfig: [
    {
      type: "fuels",
      defs: {
        x(elem) {
          return random(0, gameChunk.self.offsetWidth - elem.offsetWidth)
        },
        y(elem) {
          return -elem.offsetHeight
        }
      },
      tracks: {
        x() {
          const y = random(0, 2)

          return y === 0 ? 0 : parseFloat(randomDirection() + y)
        },
        y() {
          return random(1, 2)
        }
      },
      colliedFn(_target, entity) {
        entity.collied = true
        status.fuelCount++
        // 移动到指定地点
        moveToIcon(entity, gameChunk.fuels.parentElement, () => {
          entity.remove()
        })
      }
    },
    {
      type: "stars",
      defs: {
        x(elem) {
          return random(0, gameChunk.self.offsetWidth - elem.offsetWidth)
        },
        y(elem) {
          return -elem.offsetHeight
        }
      },
      tracks: {
        x() {
          const y = random(0, 2)

          return y === 0 ? 0 : parseFloat(randomDirection() + y)
        },
        y() {
          return random(1, 2)
        }
      },
      colliedFn(_target, entity) {
        entity.collied = true
        status.starCount++
        starAudio.play(true)
        // 移动到指定地点
        moveToIcon(entity, gameChunk.stars.parentElement, () => {
          entity.remove()
        })
      }
    },
    {
      type: "clouds",
      defs: {
        x() {
          return gameChunk.self.offsetWidth
        },
        y(elem) {
          return random(0, gameChunk.self.offsetHeight - elem.offsetHeight)
        }
      },
      tracks: {
        x() {
          return -random(100, 500) / 100
        },
        y: 0
      },
      styles(elem) {
        elem.style.background = `url(./src/assets/icons/clouds/cloud${random(1, 5)}.png)`
        elem.style.opacity = random(35, 70) / 100 + ''
      }
    },
    {
      type: "birds",
      defs: {
        x() {
          return gameChunk.self.offsetWidth
        },
        y(elem) {
          return random(0, gameChunk.self.offsetHeight - elem.offsetHeight)
        }
      },
      tracks: {
        x() {
          return -random(100, 400) / 100
        },
        y() {
          const y = random(0, 3)

          return y === 0 ? 0 : parseFloat(randomDirection() + y)
        }
      },
      colliedTracks: {
        x() {
          return parseFloat(randomDirection() + random(2, 5))
        },
        y() {
          return parseFloat(randomDirection() + random(2, 5))
        }
      },
      state: {
        rotate: 0,
      },
      styles(elem) {
        elem.style.background = `url(./src/assets/icons/birds/bird${random(1, 4)}.gif)`
      },
      colliedFn(target, entity) {
        entity.collied = true
        if (target === gameChunk.plane) {
          status.fuelCount -= 10
          hitAudio.play(true)
        }
      }
    }
  ],
  spawner() {
    const entityConfig = this.spawnConfig[random(0, this.spawnConfig.length - 1)]
    const elem = document.createElement("span")
    const isFn = obj => {
      return typeof obj === "function" ? obj(elem) : obj
    }

    elem.classList.add(entityConfig.type)
    gameChunk.container.appendChild(elem)
    elem.style.left = `${isFn(entityConfig.defs.x)}px`
    elem.style.top = `${isFn(entityConfig.defs.y)}px`
    elem.tracks = {
      x: isFn(entityConfig.tracks.x),
      y: isFn(entityConfig.tracks.y)
    }
    if (entityConfig.colliedTracks) {
      elem.colliedTracks = {
        x: isFn(entityConfig.colliedTracks.x),
        y: isFn(entityConfig.colliedTracks.y)
      }
    }
    if (entityConfig.state) {
      elem.state = {...entityConfig.state}
    }
    if (entityConfig.styles) {
      entityConfig.styles?.(elem)
    }
    if (entityConfig.colliedFn) {
      elem.colliedFn = entityConfig.colliedFn
    }
  },
  bulletConfig: {
    type: "bullets",
    defs: {
      x() {
        return gameChunk.plane.offsetLeft
      },
      y(elem) {
        return gameChunk.plane.offsetTop + gameChunk.plane.offsetHeight / 2 - elem.offsetHeight / 2
      }
    },
    tracks: {
      x: 11,
      y: 0
    }
  },
  fireBullet() {
    const elem = document.createElement("span")
    const {type, defs, tracks} = this.bulletConfig

    elem.classList.add(type)
    gameChunk.container.appendChild(elem)
    elem.style.left = `${defs.x(elem)}px`
    elem.style.top = `${defs.y(elem)}px`
    elem.tracks = {
      x: tracks.x,
      y: tracks.y
    }
  },
  load() {
    // 每秒随机生成6个实体
    entityAnimation.start(1000 / 6)
    trackAnimation.start()
  },
  unload() {
    // 清空所有实体
    gameChunk.container.innerHTML = ""
    entityAnimation.cancel(() => {
      trackAnimation.cancel()
    })
  }
}

export default entity
