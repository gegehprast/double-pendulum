import p5 from 'p5'

interface WorldSettings {
    center: p5.Vector
    gravity: number
    friction: number
}

class Pendulum {
    p: p5

    world: WorldSettings

    length: number

    mass: number

    angle: number = 0

    aVelocity: number = 0

    aAcceleration: number = 0

    position: p5.Vector

    radius: number

    other?: Pendulum

    asAnchor?: boolean

    dragging: boolean = false

    looping: boolean = true

    constructor(p: p5, world: WorldSettings, length: number, mass: number) {
        this.p = p
        this.world = world

        this.length = length
        this.mass = mass

        this.position = p.createVector()
        this.radius = mass * 2
    }

    setOther(other: Pendulum, asAchor: boolean) {
        this.other = other
        this.asAnchor = asAchor
    }

    setAngle(angle: number) {
        this.angle = angle
    }

    setDragging(dragging: boolean) {
        this.dragging = dragging

        if (this.dragging) {
            this.p.loop()
        }
    }

    drag() {
        let dx: number, dy: number

        if (this.asAnchor) {
            dx = this.p.mouseX - this.world.center.x
            dy = this.p.mouseY - this.world.center.y
        } else {
            if (!this.other) throw new Error('Other pendulum is not set')

            dx = this.p.mouseX - this.world.center.x - this.other.position.x
            dy = this.p.mouseY - this.world.center.y - this.other.position.y

            this.other.stop()
        }

        const angle = Math.atan2(dy, dx)
        this.angle = (angle - Math.PI / 2) * -1

        this.stop()
    }

    stop() {
        this.aVelocity = 0
        this.aAcceleration = 0
    }

    reset() {
        this.stop()
        this.angle = 0
    }

    update() {
        this.angle += this.aVelocity
        this.position.x = this.length * this.p.sin(this.angle)
        this.position.y = this.length * this.p.cos(this.angle)

        if (!this.asAnchor) {
            if (!this.other) throw new Error('Other pendulum is not set')

            this.position.x += this.other.position.x
            this.position.y += this.other.position.y
        }

        if (this.dragging) {
            this.drag()
            return
        }
        
        this.calcAcceleration()

        this.aVelocity += this.aAcceleration
        this.aVelocity *= 1 - this.world.friction

        // stop the pendulum when it's almost still
        if (this.p.abs(this.aVelocity) < 0.0002 && this.p.abs(this.angle) < 0.0002) {
            this.aVelocity = 0
            this.angle = 0
        }
    }

    calcAcceleration() {
        if (!this.other) throw new Error('Other pendulum is not set')

        if (this.asAnchor) {
            const num1 = -this.world.gravity * (2 * this.mass + this.other.mass) * this.p.sin(this.angle)
            const num2 = -this.other.mass * this.world.gravity * this.p.sin(this.angle - 2 * this.other.angle)
            const num3 = -2 * this.p.sin(this.angle - this.other.angle) * this.other.mass
            const num4 = this.other.aVelocity * this.other.aVelocity * this.other.length + this.aVelocity * this.aVelocity * this.length * this.p.cos(this.angle - this.other.angle)
            const den = this.length * (2 * this.mass + this.other.mass - this.other.mass * this.p.cos(2 * this.angle - 2 * this.other.angle))

            this.aAcceleration = (num1 + num2 + num3 * num4) / den
        } else {
            const num5 = 2 * this.p.sin(this.other.angle - this.angle)
            const num6 = this.other.aVelocity * this.other.aVelocity * this.other.length * (this.other.mass + this.mass)
            const num7 = this.world.gravity * (this.other.mass + this.mass) * this.p.cos(this.other.angle)
            const num8 = this.aVelocity * this.aVelocity * this.length * this.mass * this.p.cos(this.other.angle - this.angle)
            const den2 = this.length * (2 * this.other.mass + this.mass - this.other.mass * this.p.cos(2 * this.other.angle - 2 * this.angle))

            this.aAcceleration = (num5 * (num6 + num7 + num8)) / den2
        }
    }

    renderArm(color: p5.Vector) {
        this.p.strokeWeight(2)
        this.p.stroke(color.x, color.y, color.z)

        if (this.asAnchor) {
            this.p.line(0, 0, this.position.x, this.position.y)
        } else {
            if (!this.other) throw new Error('Other pendulum is not set')

            this.p.line(this.other.position.x, this.other.position.y, this.position.x, this.position.y)
        }
    }

    renderBall(color: p5.Vector) {
        this.p.fill(color.x, color.y, color.z)
        this.p.noStroke()
        this.p.ellipse(this.position.x, this.position.y, this.radius, this.radius)
    }
}

export default Pendulum
