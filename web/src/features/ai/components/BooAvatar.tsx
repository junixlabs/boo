import type { BooExpression } from '../types'

const expressions: Record<BooExpression, { eyes: string; mouth: string }> = {
  default: { eyes: '• •', mouth: '‿' },
  happy: { eyes: '✦ ✦', mouth: '▽' },
  sad: { eyes: '• •', mouth: '︵' },
  angry: { eyes: '▸ ◂', mouth: '︵' },
  dramatic: { eyes: '◉ ◉', mouth: 'O' },
  spooky: { eyes: '◉ ◉', mouth: '‿' },
}

interface BooAvatarProps {
  size?: number
  expression?: BooExpression
  className?: string
}

export function BooAvatar({ size = 32, expression = 'default', className }: BooAvatarProps) {
  const expr = expressions[expression]
  const fontSize = size * 0.3
  const eyeY = size * 0.38
  const mouthY = size * 0.58

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      {/* Ghost body */}
      <path
        d={`M${size * 0.15},${size * 0.55}
            Q${size * 0.15},${size * 0.15} ${size * 0.5},${size * 0.12}
            Q${size * 0.85},${size * 0.15} ${size * 0.85},${size * 0.55}
            L${size * 0.85},${size * 0.78}
            Q${size * 0.75},${size * 0.7} ${size * 0.68},${size * 0.82}
            Q${size * 0.6},${size * 0.7} ${size * 0.5},${size * 0.85}
            Q${size * 0.4},${size * 0.7} ${size * 0.32},${size * 0.82}
            Q${size * 0.25},${size * 0.7} ${size * 0.15},${size * 0.78}
            Z`}
        fill="var(--boo-avatar-bg)"
        opacity="0.9"
      />
      {/* Eyes */}
      <text
        x={size * 0.5}
        y={eyeY}
        textAnchor="middle"
        fontSize={fontSize}
        fill="white"
        dominantBaseline="central"
      >
        {expr.eyes}
      </text>
      {/* Mouth */}
      <text
        x={size * 0.5}
        y={mouthY}
        textAnchor="middle"
        fontSize={fontSize * 0.8}
        fill="white"
        dominantBaseline="central"
      >
        {expr.mouth}
      </text>
    </svg>
  )
}
