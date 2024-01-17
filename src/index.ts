import p5 from 'p5'

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(400, 400)
    }

    p.draw = () => {
        p.background(0)
        p.fill(255)
        p.rect(100, 100, 200, 200)
    }
}

new p5(sketch)
