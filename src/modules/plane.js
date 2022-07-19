import AnimationFrame from "../classes/AnimationFrame.js"
import objects from "../libs/objects.js"
import collision from "../libs/collision.js"
import entity from "./entity.js"
import status from "./status.js"

const {gameChunk} = objects
let keysState = {
  up: false,
  left: false,
  right: false,
  down: false,
  space: false,
}
let canFireBullet = true
let fireBulletTimer = null
const step = 5
const toggleKeys = (code, res) => {
  if (code === "ArrowUp") {
    keysState.up = res
  }
  if (code === "ArrowLeft") {
    keysState.left = res
  }
  if (code === "ArrowRight") {
    keysState.right = res
  }
  if (code === "ArrowDown") {
    keysState.down = res
  }
  if (code === "Space") {
    keysState.space = res
  }
}
const planeAnimation = new AnimationFrame(() => {
  const {plane} = gameChunk
  const {offsetTop, offsetLeft} = plane

  if (keysState.up) {
    plane.style.top = `${offsetTop - step}px`
    if (offsetTop <= 0) {
      plane.style.top = "0"
    }
  }
  if (keysState.left) {
    plane.style.left = `${offsetLeft - step}px`
    if (offsetLeft <= 0) {
      plane.style.left = "0"
    }
  }
  if (keysState.right) {
    plane.style.left = `${offsetLeft + step}px`
    if (offsetLeft >= gameChunk.self.offsetWidth - plane.offsetWidth) {
      plane.style.left = `${gameChunk.self.offsetWidth - plane.offsetWidth}px`
    }
  }
  if (keysState.down) {
    plane.style.top = `${offsetTop + step}px`
    if (offsetTop >= gameChunk.self.offsetHeight - plane.offsetHeight) {
      plane.style.top = `${gameChunk.self.offsetHeight - plane.offsetHeight}px`
    }
  }
  if (keysState.space && canFireBullet) {
    canFireBullet = !canFireBullet
    entity.fireBullet()
    clearTimeout(fireBulletTimer)
    fireBulletTimer = setTimeout(() => {
      canFireBullet = !canFireBullet
    }, 200)
  }

  collision(
    plane,
    [
      ...gameChunk.getFuelEntities(),
      ...gameChunk.getStarEntities(),
      ...gameChunk.getBirdEntities()
    ],
    (target, entity) => {
      entity.colliedFn(target, entity)
    })
  gameChunk.getBulletEntities().forEach(bullet => {
    collision(bullet, gameChunk.getBirdEntities(), (target, entity) => {
      target.remove()
      status.killedBirdCount++
      entity.colliedFn(target, entity)
    })
  })
})
const plane = {
  initKeyboardEvent() {
    document.onkeydown = ev => {
      toggleKeys(ev.code, true)
    }
    document.onkeyup = ev => {
      toggleKeys(ev.code, false)
    }
  },
  load() {
    this.initKeyboardEvent()
    planeAnimation.start()
  },
  unload() {
    planeAnimation.cancel(() => {
      document.onkeydown = null
      document.onkeyup = null
      keysState = {
        up: false,
        left: false,
        right: false,
        down: false
      }
      gameChunk.plane.removeAttribute("style")
    })
  }
}

export default plane
