const saves = (save) => {
  if (!localStorage.getItem("history")) {
    localStorage.setItem("history", JSON.stringify([save]))
  } else {
    const getHistory = JSON.parse(localStorage.getItem("history"))

    localStorage.setItem("history", JSON.stringify([save, ...getHistory]))
  }
}

export default saves
