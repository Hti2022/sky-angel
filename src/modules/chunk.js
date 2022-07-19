import objects from "../libs/objects.js"
import control from "./control.js"
import plane from "./plane.js"
import entity from "./entity.js"
import timer from "./timer.js"
import status from "./status.js"
import ending from "./ending.js"

const {gameChunk} = objects
const chunk = {
  show() {
    gameChunk.self.classList.remove("hidden")
    this.load()
  },
  hide() {
    gameChunk.self.classList.add("hidden")
  },
  load() {
    plane.load()
    control.load()
    entity.load()
    timer.load()
    status.load()
  },
  unload() {
    plane.unload()
    entity.unload()
    control.unload()
    timer.unload()
    status.unload()
    ending.load()
    this.hide()
  }
}


export default chunk
