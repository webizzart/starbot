import { canvas, context } from '../store/store';
import { createVec2D } from './createVec2D';
import {Marine} from '../marine/marine';
export function startAppManager(component) {
    var Pool = (function () {
        var create = function (type, size) {
            var obj = Object.create(def);
            obj.init(type, size);

            return obj;
        };

        var def =
        {
            _type: null,
            _size: null,
            _pointer: null,
            _elements: null,

            init: function (type, size) {
                this._type = type;
                this._size = size;
                this._pointer = size;
                this._elements = [];

                var i = 0;
                var length = this._size;

                for (i; i < length; ++i) {
                    this._elements[i] = this._type.create();
                }
            },

            getElement: function () {
                if (this._pointer > 0) return this._elements[--this._pointer];

                return null;
            },

            disposeElement: function (obj) {
                this._elements[this._pointer++] = obj;
            }
        };
        return { create: create };
    }());

    var Vec2D = createVec2D();

    var Bullet = (function () {
        var create = function () {
            var obj = Object.create(def);
            obj.radius = 4;
            obj.color = '#FFF';
            obj.pos = Vec2D.create();
            obj.vel = Vec2D.create();
            obj.blacklisted = false;

            return obj;
        };

        var def =
        {
            radius: null,
            color: null,
            pos: null,
            vel: null,
            blacklisted: null,

            update: function () {
                this.pos.add(this.vel);
            },

            reset: function () {
                this.blacklisted = false;
            }
        };

        return { create: create };
    }());
    var Ship = (function () {
        var create = function (x, y) {
            var obj = Object.create(def);
            obj.angle = 0;
            obj.pos = Vec2D.create(x, y);
            obj.vel = Vec2D.create();
            obj.idle = false;
            obj.radius = 8;
            obj.idleDelay = 0;

            return obj;
        };  
        var def =
        {
                angle: null,
                pos: null,
                vel: null,
                bulletDelay: null,
                idle: null,
                radius: null,

                update: function () {
                this.pos.add(this.vel);

                if (this.vel.getLength() > 5) this.vel.setLength(5);

                ++this.bulletDelay;

                if (this.idle) {
                    if (++this.idleDelay > 120) {
                        this.idleDelay = 0;
                        this.idle = false;

                    }
                }
            },

            shoot: function () {
                    if (this.bulletDelay > 8) {
                        generateShot();
                        this.bulletDelay = 0;
                    }
            }
        };

        return { create: create };
    }());

    var screenWidth;
    var screenHeight;
    var doublePI = Math.PI;

    var ship;


    var bulletPool;
    var bullets;

    var keySpace = false;

    window.getAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 16.6);
        };

    window.onload = function () {

        const can = component.querySelector('canvas');
        canvas.set(can);
        const ctx = can.getContext('2d');
        context.set(ctx);
        window.onresize();
        keyboardInit();
        bulletInit();
        shipInit();
        loop();
    };

    window.onresize = function () {
        const can = canvas.get();
        if (!can) return;

        screenWidth = can.clientWidth;
        screenHeight = can.clientHeight;

        can.width = screenWidth;
        can.height = screenHeight;
    };

    function keyboardInit() {
        window.onkeydown = function (e) {
            switch (e.keyCode) {
                case 32:
                case 75:
                    keySpace = true;
                    break;
            }
            e.preventDefault();
        };

        window.onkeyup = function (e) {
            switch (e.keyCode) {
                //key Space
                case 75:
                case 32:
                    keySpace = false;
                    break;
            }

            e.preventDefault();
        };
    }

    function bulletInit() {
        bulletPool = Pool.create(Bullet, 40);
        bullets = [];
    }


    function shipInit() {
        ship = Ship.create(screenWidth >> 1, screenHeight >> 1, this);
    }

    function loop() {
        updateShip();
        updateBullets();
        render();
        getAnimationFrame(loop);
    }

    function updateShip() {
        ship.update();

        if (ship.idle) return;

        if (keySpace) ship.shoot();
        // const gX = ship.pos.getX();
        // ship.pos.setX( gX+1);
        // if (keyLeft) ship.angle -= 0.1;
        // if (keyRight) ship.angle += 0.1;

        if (ship.pos.getX() > screenWidth) ship.pos.setX(0);
        else if (ship.pos.getX() < 0) ship.pos.setX(screenWidth);

        if (ship.pos.getY() > screenHeight) ship.pos.setY(0);
        else if (ship.pos.getY() < 0) ship.pos.setY(screenHeight);
    }




    function updateBullets() {
        var i = bullets.length - 1;

        for (i; i > -1; --i) {
            var b = bullets[i];

            if (b.blacklisted) {
                b.reset();

                bullets.splice(bullets.indexOf(b), 1);
                bulletPool.disposeElement(b);

                continue;
            }

            b.update();

            if (b.pos.getX() > screenWidth) b.blacklisted = true;
            else if (b.pos.getX() < 0) b.blacklisted = true;

            if (b.pos.getY() > screenHeight) b.blacklisted = true;
            else if (b.pos.getY() < 0) b.blacklisted = true;
        }
    }

    function render() {
        const ctx = context.get();
        ctx.fillStyle = '#262626';
        ctx.globalAlpha = 0.4;
        ctx.fillRect(0, 0, screenWidth, screenHeight);
        ctx.globalAlpha = 1;

        renderShip();
        renderBullets();
    }

    function renderShip() {
        if (ship.idle) return;
        const ctx = context.get();
        ctx.save();
        ctx.translate(ship.pos.getX() >> 0, ship.pos.getY() >> 0);
        ctx.rotate(ship.angle);

        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = (Math.random() > 0.9) ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-10, -10);
        ctx.lineTo(-10, 10);
        ctx.lineTo(10, 0);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    function renderBullets() {
        const ctx = context.get();

        var i = bullets.length - 1;

        for (i; i > -1; --i) {
            var b = bullets[i];

            ctx.beginPath();
            ctx.strokeStyle = b.color;

            ctx.arc(b.pos.getX() >> 0, b.pos.getY() >> 0, b.radius, 0, doublePI);
            if (Math.random() > 0.4) ctx.stroke();
            ctx.closePath();
        }
    }

    function generateShot() {
        var b = bulletPool.getElement();

        b.radius = 1;
        b.pos.setX(ship.pos.getX() + Math.cos(ship.angle) * 14);
        b.pos.setY(ship.pos.getY() + Math.sin(ship.angle) * 14);

        b.vel.setLength(10);
        b.vel.setAngle(ship.angle);
        bullets[bullets.length] = b;
    }
}

