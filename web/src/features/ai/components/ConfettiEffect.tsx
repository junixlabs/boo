import confetti from 'canvas-confetti'

const BOO_COLORS = ['#7c3aed', '#a78bfa', '#c4b5fd', '#8b5cf6', '#6d28d9']

export function fireBooConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.7 },
    colors: BOO_COLORS,
  })
}

export function fireBooConfettiBig() {
  const end = Date.now() + 800
  const frame = () => {
    confetti({ particleCount: 30, angle: 60, spread: 55, origin: { x: 0 }, colors: BOO_COLORS })
    confetti({ particleCount: 30, angle: 120, spread: 55, origin: { x: 1 }, colors: BOO_COLORS })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}
