const select = selector => document.querySelector(selector)
const selectAll = selector => document.querySelectorAll(selector)
const objects = {
  gameGuide: {
    self: select("#game-guide"),
    start: select("#start"),
    history: select("#history"),
  },
  gameChunk: {
    self: select("#game-chunk"),
    plane: select("#plane"),
    duration: select("#duration"),
    fuels: select("#fuels"),
    stars: select("#stars"),
    controls: {
      sizeDecrement: select("#size-decrement"),
      sizeIncrement: select("#size-increment"),
      toggleMuteState: select("#toggle-mute"),
      toggleRunState: select("#toggle-running"),
    },
    container: select("#container"),
    getEntities: () => [...selectAll("#container>span")],
    getFuelEntities: () => [...selectAll("#container>.fuels")],
    getStarEntities: () => [...selectAll("#container>.stars")],
    getBirdEntities: () => [...selectAll("#container>.birds")],
    getBulletEntities: () => [...selectAll("#container>.bullets")],
  },
  gameEnding: {
    self: select("#game-ending"),
    replay: select("#replay"),
    statTime: select("#stat-time"),
    statStars: select("#stat-stars"),
    statKilled: select("#stat-killed"),
  },
  gameHistory: {
    self: select("#game-history"),
    list: select("#history-list"),
    close: select("#close-history"),
  }
}

export default objects
