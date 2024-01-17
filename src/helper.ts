import p5 from 'p5'

export function text(p: p5, text: string, x: number, y: number) {
    p.fill(255)
    p.noStroke()
    p.textSize(14)
    p.text(text, x, y)
}
