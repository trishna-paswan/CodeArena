function enterGame() {
  window.location.href = "/games";
}

function selectGame(gameName) {
  if (gameName === 'algorithm') {
    window.location.href = "/game/algorithm";
  }
  // Add more games here in the future
}