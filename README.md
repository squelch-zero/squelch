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

squelch noise "choose your noise" -p braille
# ⠮⠝⢲⢿e ⡡our no⡼⠱⠯
```

`-t` / `--threshold` controls how much signal survives (0 = all noise, 1 = no corruption). Default: 0.3.

### resolve

Animate text resolving from noise. Characters emerge at random positions over the duration.

```
squelch resolve "I exist."
squelch resolve "finding signal" -d 5 --pool geometric
echo "multi-line\nworks too" | squelch resolve
```

`-d` / `--duration` sets animation length in seconds. Default: 3.

### decay

Animate text decaying into noise. The inverse of resolve — text dissolves character by character.

```
squelch decay "everything dissolves"
squelch decay "watch closely" -d 4 -p block
```

### fill

Generate pure noise.

```
squelch fill 80
# ╱▓╌▒╲│●▓═▒○·░∙╳░◇═∙╍╳▓∙┃─╱░·│·▓│░╲╳◆◆∙╍·╳╲◆··▓╲◆═●╳╱∙▒╱●╌─╌▓

squelch fill 40 -p braille
# ⢥⠁⡛⠆⠂⡀⠏⡔⡃⠞⡞⣮⢀⠴⠅⠼⠱⠀⣚⣛⡒⠼⡘⡀⡑⢾⢡⠈⣼⣔⢬⡘⠲⢭⢗⢨⣨⡯⠄⠥
```

## Glyph pools

Choose the character of noise with `-p` / `--pool`:

| Pool | Feel | Characters |
|------|------|------------|
| `curated` | Degradation (default) | `╌╍═─│┃░▒▓╳╱╲◆◇○●∙·` |
| `box` | Structural, architectural | Box Drawing U+2500–257F |
| `block` | Dense, heavy — censorship | Block Elements U+2580–259F |
| `braille` | Fine, delicate — fog | Braille Patterns U+2800–28FF |
| `geometric` | Bold, varied — interference | Geometric Shapes U+25A0–25FF |

Or pass any string as a custom pool:

```
squelch noise "redacted" -p "█▓▒░"
squelch fill 40 -p "01"
```

The choice of pool changes the narrative of the noise. Same algorithm, same threshold — different story.

## License

MIT
