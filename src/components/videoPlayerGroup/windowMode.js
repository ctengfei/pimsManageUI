export const WindowMode = {
  "One": 1,
  "Four": 4,
  "NINE": 9,
}

export const WindowModeScreenNum = {
  [WindowMode.One]: 1,
  [WindowMode.Four]: 4,
  [WindowMode.NINE]: 9
}


// 通过窗口位置找到某一个窗口播放器
export function findPlayerByPosition(playerList, position) {
  return playerList.find(item => item.position === position)
}

// 窗口播放模式常规模式为 1*1， 2*2， 3*3， 4*4， 5*5
export function updateCommonWindow(windowMode, playerList) {
  const windowScreen = WindowModeScreenNum[windowMode]
  const row = Math.sqrt(windowScreen)

  const wrap = document.querySelector(".video-player-group")
  const width  = wrap.clientWidth / row
  const height = wrap.clientHeight / row

  for (let i = 0; i < playerList.length; i++) {
    let player = playerList[i]
    if (player.position < windowScreen) {
      let top = Math.floor(player.position / row)
      let left = (player.position % row)
      player.show = true
      player.top = top * height
      player.left = left * width
      player.width = width
      player.height = height
    } else {
      player.show = false
      player.top = 0
      player.left = 0
      player.width = 0
      player.height = 0
    }
  }
}