import { createVec2D } from '../engine/createVec2D';
import { Bullet } from '../bullets/Bullet';
export class Marine {


    constructor(x, y) {
        const Vec2D = createVec2D();
        this.angle = 0;
        this.pos = Vec2D.create(x, y);
        this.vel = Vec2D.create();
        this.thrust = Vec2D.create();
        this.width = 10;
        this.height = 10;
        this.idle = false;
        this.radius = 8;
        this.idleDelay = 0;
        this.bulletDelay = 1;
        this.moveY = 0;
        this.moveX = 0; 
        this.xStep = 0;
        this.yStep = 0;
        this.x = x;
        this.y = y;
        this.destAngle = 0;
        this.weapon = {
            type: "MG-56",
            bullets: [new Bullet()]
        }

        this.update = () => {
            this.pos.add(this.vel);

            if (this.vel.getLength() > 5) this.vel.setLength(5);

            ++this.bulletDelay;

            if (this.idle) {
                if (++this.idleDelay > 120) {
                    this.idleDelay = 0;
                    this.idle = false;

                }
            }
        }
        this.goTo = (x,y) =>{
            // // move
             this.moveX = x;
             this.moveY = y;
             const xDistance = Math.abs(this.pos.getX()-x);
             const yDistance = Math.abs(this.pos.getY()-y);
            if (yDistance > xDistance){
                this.yStep = 1;
                this.xStep = xDistance / yDistance;
            } else {
                this.yStep = yDistance / xDistance;
                this.xStep = 1;
            }
            //console.log("Steps", this.xStep,this.yStep);

            //Turn
            const opp = this.pos.getY()-y;
            const adj = this.pos.getX()-x;
            const angle = Math.atan2(opp,adj) * (180 / Math.PI) ;
            this.destAngle = angle;

        }
        this.shoot = (generateShot) => {
            if (this.bulletDelay > 8) {
                generateShot(this);
                this.bulletDelay = 0;
            }
        }
    }
}