const convert = x => {
  let mm = Math.floor(x / 60)
  let ss = x % 60

  mm = mm < 10 ? `0${mm}` : mm
  ss = ss < 10 ? `0${ss}` : ss

  return `${mm}:${ss}`
}

export default convert
