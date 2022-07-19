import objects from "../libs/objects.js"
import start from "./start.js"
import convert from "../libs/convert.js"

const {gameGuide, gameHistory} = objects
const history = {
  initEvent() {
    gameGuide.history.onclick = () => {
      gameGuide.history.onclick = null
      start.hide()
      this.show()
    }
  },
  destroyEvent() {
    gameGuide.history.onclick = null
  },
  show() {
    gameHistory.self.classList.remove("hidden")
    gameHistory.close.onclick = () => {
      gameHistory.close.onclick = null
      this.initEvent()
      this.hide()
      start.show()
    }
  },
  hide() {
    gameHistory.self.classList.add("hidden")
  },
  render() {
    // 解析历史记录，如果没有则返回空数组
    const saves = JSON.parse(localStorage.getItem("history")) || []

    gameHistory.list.innerHTML = ""
    saves.forEach(({date, killedBirds, stars, times}) => {
      const elem = document.createElement("li")
      const fillFirstChar = (x) => x < 10 ? `0${x}` : x

      const timestamp = new Date(date)
      const yyyy = timestamp.getFullYear()
      let MM = timestamp.getMonth() + 1
      const dd = timestamp.getDate()
      const hh = timestamp.getHours()
      const mm = timestamp.getMinutes()

      const transDate = `${yyyy}/${fillFirstChar(MM)}/${fillFirstChar(dd)}`
      const transTime = `${fillFirstChar(hh)}:${fillFirstChar(mm)}`

      const dateElem = `<p>Date: ${transDate} ${transTime}</p>`
      const killedElem = `<p>Killed birds: ${killedBirds}</p>`
      const starsElem = `<p>Stars: ${stars}</p>`
      const durationElem = `<p>Duration: ${convert(times)}</p>`

      elem.innerHTML = `${dateElem}${killedElem}${starsElem}${durationElem}`
      gameHistory.list.appendChild(elem)
    })
  },
}

export default history
