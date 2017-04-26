const conn = require('./connection')

/**
 * Recursive function that broadcasts current turn and initiates next turn
 */
function notifyTurn() {
  setTimeout(() => {
    const currentTurnId = conn.dequeueTurn()
    conn.wss.broadcast({ action: 'TURN', data: { userId: currentTurnId } })
    notifyTurn()
  }, 3000)
}

notifyTurn()
