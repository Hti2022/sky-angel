import objects from "./objects.js"

const {gameChunk} = objects
const overflow = target => {
  if (target.offsetTop < -target.offsetHeight ||
    target.offsetTop > gameChunk.self.offsetHeight ||
    target.offsetLeft < -target.offsetWidth ||
    target.offsetLeft > gameChunk.self.offsetWidth
  ) {
    // 超出可视区域就移除元素
    target.remove()
  }
}

export default overflow
