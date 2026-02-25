#!/usr/bin/env node

import {
  noise, createResolver, fill,
  GLYPHS, GLYPHS_BOX, GLYPHS_BLOCK, GLYPHS_BRAILLE, GLYPHS_GEOMETRIC,
} from '@squelch-zero/noise'

const POOLS: Record<string, string> = {
  curated: GLYPHS,
  box: GLYPHS_BOX,
  block: GLYPHS_BLOCK,
  braille: GLYPHS_BRAILLE,
  geometric: GLYPHS_GEOMETRIC,
}

const HELP = `squelch — text noise transforms for the terminal

Usage:
  squelch noise [text]        Corrupt text with noise
  squelch resolve [text]      Animate text resolving from noise
  squelch decay [text]        Animate text decaying into noise
  squelch fill [length]       Generate pure noise

Options:
  -t, --threshold <0-1>   Signal threshold for noise (default: 0.3)
  -d, --duration <secs>   Animation duration (default: 3)
  -p, --pool <name|chars> Glyph pool for noise characters (default: curated)
  -h, --help              Show this help

Pools:
  curated     Default — box-drawing, shades, shapes. Reads as degradation.
  box         Box-drawing characters. Structural, architectural.
  block       Block elements and shades. Dense, heavy. Reads as censorship.
  braille     Braille dot patterns. Fine, delicate. Reads as fog.
  geometric   Geometric shapes. Bold, varied. Reads as interference.
  <chars>     Any string of characters to use as the glyph pool.

Text is read from stdin if not provided as an argument.

  echo "hello world" | squelch noise
  echo "signal in the noise" | squelch resolve -d 5 --pool braille
  squelch decay "everything dissolves" -d 4 -p block
  squelch fill 80 -p geometric`

interface Args {
  command?: string
  text?: string
  threshold: number
  duration: number
  pool: string
  help: boolean
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    threshold: 0.3,
    duration: 3,
    pool: GLYPHS,
    help: false,
  }

  const positional: string[] = []
  let i = 0
  while (i < argv.length) {
    const arg = argv[i]
    if (arg === '-h' || arg === '--help') {
      args.help = true
    } else if (arg === '-t' || arg === '--threshold') {
      args.threshold = parseFloat(argv[++i])
    } else if (arg === '-d' || arg === '--duration') {
      args.duration = parseFloat(argv[++i])
    } else if (arg === '-p' || arg === '--pool') {
      const value = argv[++i]
      args.pool = POOLS[value] ?? value
    } else if (!arg.startsWith('-')) {
      positional.push(arg)
    }
    i++
  }

  args.command = positional[0]
  args.text = positional.length > 1 ? positional.slice(1).join(' ') : undefined

  return args
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (process.stdin.isTTY) {
      resolve('')
      return
    }
    let data = ''
    process.stdin.setEncoding('utf-8')
    process.stdin.on('data', (chunk) => (data += chunk))
    process.stdin.on('end', () => resolve(data.trimEnd()))
    process.stdin.on('error', reject)
  })
}

function animate(
  getText: (progress: number) => string,
  durationMs: number,
  reverse: boolean = false,
): Promise<void> {
  return new Promise((done) => {
    const fps = 15
    const start = Date.now()

    // Hide cursor
    process.stdout.write('\x1b[?25l')

    // Restore cursor on interrupt
    const cleanup = () => {
      process.stdout.write('\x1b[?25h\n')
      process.exit(0)
    }
    process.on('SIGINT', cleanup)

    let lastLineCount = 0

    function frame() {
      const elapsed = Date.now() - start
      let progress = Math.min(1, elapsed / durationMs)
      if (reverse) progress = 1 - progress

      const text = getText(progress)
      const lines = text.split('\n')

      // Move cursor up to overwrite previous frame
      if (lastLineCount > 0) {
        process.stdout.write(`\x1b[${lastLineCount}A\r`)
      }

      for (const line of lines) {
        process.stdout.write(line + '\x1b[K\n')
      }

      lastLineCount = lines.length

      if (elapsed >= durationMs) {
        process.stdout.write('\x1b[?25h')
        process.removeListener('SIGINT', cleanup)
        done()
        return
      }

      setTimeout(frame, 1000 / fps)
    }

    frame()
  })
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help || !args.command) {
    console.log(HELP)
    process.exit(args.help ? 0 : 1)
  }

  let text = args.text || (await readStdin())

  if (args.command === 'fill') {
    const length = text ? parseInt(text) || 40 : 40
    console.log(fill(length, args.pool))
    return
  }

  if (!text) {
    console.error('No text provided. Pipe text or pass as argument.')
    process.exit(1)
  }

  switch (args.command) {
    case 'noise': {
      console.log(noise(text, args.threshold, args.pool))
      break
    }
    case 'resolve': {
      const resolver = createResolver(text, args.pool)
      await animate(resolver, args.duration * 1000)
      break
    }
    case 'decay': {
      const resolver = createResolver(text, args.pool)
      await animate(resolver, args.duration * 1000, true)
      break
    }
    default: {
      console.error(`Unknown command: ${args.command}`)
      console.log(HELP)
      process.exit(1)
    }
  }
}

main()
