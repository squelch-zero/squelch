# squelch

Text noise transforms for the terminal.

Corrupt, resolve, and decay text — character by character — using the same glyph set as [squelch-zero.vercel.app](https://squelch-zero.vercel.app).

Built on [@squelch-zero/noise](https://github.com/squelch-zero/noise).

## Install

```
npx squelch --help
```

Or clone and link:

```
git clone https://github.com/squelch-zero/squelch.git
cd squelch
pnpm install
pnpm link --global
```

## Commands

### noise

Corrupt text with noise. Each character has a chance of being replaced by a random glyph.

```
squelch noise "signal in the noise"
# s═╲│al ◇▒ ░╳● n·○s╌

echo "pipe friendly" | squelch noise
# p╌╱e ╲h∙═│h─∙

squelch noise "more signal" -t 0.8
# mor╍ sig·al
```

`-t` / `--threshold` controls how much signal survives (0 = all noise, 1 = no corruption). Default: 0.3.

### resolve

Animate text resolving from noise. Characters emerge at random positions over the duration.

```
squelch resolve "I exist."
squelch resolve "finding signal" -d 5
echo "multi-line\nworks too" | squelch resolve
```

`-d` / `--duration` sets animation length in seconds. Default: 3.

### decay

Animate text decaying into noise. The inverse of resolve — text dissolves character by character.

```
squelch decay "everything dissolves"
squelch decay "watch closely" -d 4
```

### fill

Generate pure noise.

```
squelch fill 80
# ╱▓╌▒╲│●▓═▒○·░∙╳░◇═∙╍╳▓∙┃─╱░·│·▓│░╲╳◆◆∙╍·╳╲◆··▓╲◆═●╳╱∙▒╱●╌─╌▓
```

## Glyphs

`╌╍═─│┃░▒▓╳╱╲◆◇○●∙·`

Box-drawing fragments, shade blocks, geometric shapes. Recognizably "not text" without being distracting.

## License

MIT
