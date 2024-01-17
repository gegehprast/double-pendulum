import p5 from 'p5'
import Pendulum from './Pendulum'
import { text } from './helper'

const WIDTH = 1200
const HEIGHT = 600
const CENTER_X = WIDTH / 2
const CENTER_Y = 100
const G = 1
const FRICTION = 0.001

// arm lengths
const UPPER_L = 200
const LOWER_L = 200

// masses
const UPPER_M = 10
const LOWER_M = 10

const world = {
    center: new p5.Vector(CENTER_X, CENTER_Y),
    gravity: G,
    friction: FRICTION,
}
let upper: Pendulum
let lower: Pendulum
let pauseButton: p5.Element
let trail: p5.Graphics
const trails: p5.Vector[] = []
let hue = 0

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT)
        p.colorMode(p.HSB, 255)

        trail = p.createGraphics(p.width, p.height)
        trail.colorMode(p.HSB, 255)
        trail.background(0)
        trail.translate(CENTER_X, CENTER_Y)

        upper = new Pendulum(p, world, UPPER_L, UPPER_M)
        lower = new Pendulum(p, world, LOWER_L, LOWER_M)
        
        // set the other pendulums
        upper.setOther(lower, true)
        lower.setOther(upper, false)

        // set the initial angle
        upper.setAngle(p.PI / 2)
        lower.setAngle(p.PI / 2)

        // pause button in the bottom left corner
        pauseButton = p.createButton('Pause')
        pauseButton.position(10, p.height - 50)
        pauseButton.mousePressed(() => {
            if (p.isLooping()) {
                p.noLoop()
                pauseButton.html('Play')
            } else {
                p.loop()
                pauseButton.html('Pause')
            }
        })
    }

    p.mousePressed = () => {
        // Check if mouse is over the object
        const d1 = p.dist(p.mouseX, p.mouseY, world.center.x + upper.position.x, world.center.y + upper.position.y)
        const d2 = p.dist(p.mouseX, p.mouseY, world.center.x + lower.position.x, world.center.y + lower.position.y)

        if (d1 < upper.radius / 2) {
            pauseButton.html('Pause')
            upper.setDragging(true)
        }

        if (d2 < lower.radius / 2) {
            pauseButton.html('Pause')
            lower.setDragging(true)
        }
    }

    p.mouseReleased = () => {
        upper.setDragging(false)
        lower.setDragging(false)
    }

    p.draw = () => {
        hue = (hue + 1) % 255
        p.image(trail, 0, 0)
        p.stroke(255)
        p.strokeWeight(2)
        p.translate(CENTER_X, CENTER_Y)

        upper.update()
        lower.update()

        upper.renderArm(p.createVector(255, 0, 255))
        lower.renderArm(p.createVector(255, 0, 255))

        upper.renderBall(p.createVector(255, 0, 255))
        lower.renderBall(p.createVector(hue, 255, 255))

        trails.push(p.createVector(lower.position.x, lower.position.y))

        if (trails.length > 50) {
            trails.shift()
        }
        
        // draw the trail
        trail.background(0)
        trail.strokeWeight(1)
        

        let opacity = 0
        for (let i = 0; i < trails.length - 1; i++) {
            opacity += 255 / trails.length
            trail.stroke(hue, 255, 255, opacity)
            trail.line(trails[i].x, trails[i].y, trails[i + 1].x, trails[i + 1].y)
        }

        text(p, `Mouse Position: ${p.mouseX}, ${p.mouseY}`, -CENTER_X + 10, -CENTER_Y + 20)
        text(p, `Upper position: ${upper.position.x.toFixed()}, ${upper.position.y.toFixed()}`, -CENTER_X + 10, -CENTER_Y + 35)
        text(p, `Lower position: ${lower.position.x.toFixed()}, ${lower.position.y.toFixed()}`, -CENTER_X + 10, -CENTER_Y + 50)
        text(p, `Upper angle: ${upper.angle.toFixed(8)}`, -CENTER_X + 10, -CENTER_Y + 65)
        text(p, `Lower angle: ${lower.angle.toFixed(8)}`, -CENTER_X + 10, -CENTER_Y + 80)
        text(p, `Upper angular velocity: ${upper.aVelocity.toFixed(8)}`, -CENTER_X + 10, -CENTER_Y + 95)
        text(p, `Lower angular velocity: ${lower.aVelocity.toFixed(8)}`, -CENTER_X + 10, -CENTER_Y + 110)
        text(p, `Upper angular acceleration: ${upper.aAcceleration.toFixed(8)}`, -CENTER_X + 10, -CENTER_Y + 125)
        text(p, `Lower angular acceleration: ${lower.aAcceleration.toFixed(8)}`, -CENTER_X + 10, -CENTER_Y + 140)
        text(p, `Friction: ${world.friction}`, -CENTER_X + 10, -CENTER_Y + 155)
        text(p, `Gravity: ${world.gravity}`, -CENTER_X + 10, -CENTER_Y + 170)
        text(p, `FPS: ${p.frameRate().toFixed(2)}`, -CENTER_X + 10, -CENTER_Y + 185)
    }
}

new p5(sketch)
