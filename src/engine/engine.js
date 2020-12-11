import { canvas, context, scene, bulletsPool, screen, mouse } from '../store/store';
import { skirmish } from '../scene/scenes';
import { startMouseEvent, setEvent } from '../utilis/mouse.service';
import { TYPE } from '../clans/Clans';

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
                    this._elements[i] = this._type;
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

    var screenWidth;
    var screenHeight;
    var doublePI = Math.PI;

    var bulletPool;

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
        context.set(can.getContext('2d'));
        window.onresize();
        keyboardInit();
        startMouseEvent();
        bulletInit();
        sceneInit();
        
        loop();

        setEvent("mousedown", (e) => {
            const _x = mouse.getX();
            const _y = mouse.getY();
            const _scene = scene.get();
            const playerClan = Array.from(_scene.clans).find(c => c.player === TYPE.PLAYER);
            
            switch (e.which) {
                case 1:
                    if (playerClan) {
                        Array.from(playerClan.units).forEach(_unit => {
                            const isinRangeX = Math.abs(_x - _unit.pos.getX()) < _unit.width;
                            const isInRangeY = Math.abs(_y - _unit.pos.getY()) < _unit.height;
                            _unit.isSelected = false;
                            playerClan.selectedUnits = [];
                            if (isinRangeX && isInRangeY) {
                                _unit.isSelected = true;
                            }
                        });
                    }
                    break;
                case 2:
                    alert('Middle Mouse button pressed.');
                    break;
                case 3:
                    if(playerClan){
                        Array.from(playerClan.units).forEach(_unit=>{
                            if(_unit.isSelected)
                            _unit.goTo(_x,_y);  
                        });
                    }
                    break;
                default:
                    alert('You have a strange Mouse!');
            }

        });
    };

    window.onresize = function () {
        const can = canvas.get();
        if (!can) return;

        screenWidth = can.clientWidth;
        screenHeight = can.clientHeight;

        screen.setHeight(screenHeight);
        screen.setWidth(screenWidth);


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
        bulletPool = Pool.create(null, 40);
    }


    function sceneInit() {
        const _scene = skirmish();
        scene.set(_scene);
    }

    function loop() {
        
        updateUnit();
        updateBullets();
        render();
        getAnimationFrame(loop);
        
    }

    function updateUnit() {
       
        const _scene = scene.get();
        Array.from(_scene.clans).forEach(_clan => {
            Array.from(_clan.units).forEach(_unit => {
                _unit.update();
                const curX = _unit.pos.getX();
                const curY = _unit.pos.getY();
                // _unit.pos.setX( _unit.pos.getX()+1);
                if (_unit.angle < _unit.destAngle)
                    _unit.angle +=  5;
                    else
                    _unit.angle -= 5;

                if (keySpace) _unit.shoot(generateShot);
            
                if(_unit.moveX && _unit.moveX < curX){
                    _unit.x -= _unit.xStep;
                    _unit.pos.setX(_unit.x); 
                        
                }else if(_unit.moveX){
                    _unit.x += _unit.xStep;
                    _unit.pos.setX(_unit.x);   
                }
                if(_unit.moveY && _unit.moveY < curY){
                    _unit.y -= _unit.yStep;
                    _unit.pos.setY(_unit.y); 
                }else if(_unit.moveX){
                    _unit.y += _unit.yStep;
                    _unit.pos.setY(_unit.y); 
                }
           
            });
        });
    }

    function updateBullets() {
        const bullets = bulletsPool.get();
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
        const _scene = scene.get();
        ctx.fillStyle = '#262626';
        ctx.globalAlpha = 0.4;
        ctx.fillRect(0, 0, screenWidth, screenHeight);
        ctx.globalAlpha = 1;

        renderUnit(ctx,_scene);
        renderBullets(ctx);
    }

    function renderUnit(ctx,_scene) {

        Array.from(_scene.clans).forEach(_clan => {
            Array.from(_clan.units).forEach(_unit => {

                ctx.save();
                ctx.translate(_unit.pos.getX() >> 0, _unit.pos.getY() >> 0);
                ctx.rotate((_unit.angle) * (Math.PI/180)) ;

                ctx.strokeStyle = '#FFF';
                ctx.lineWidth = (Math.random() > 0.9) ? 2 : 1;
                ctx.beginPath();
                ctx.moveTo(-10, 0);
                ctx.lineTo(10, 10);
                ctx.lineTo(10, -10);
                ctx.lineTo(-10, 0);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
                if(_unit.isSelected){
                    ctx.beginPath();
                    ctx.arc(_unit.pos.getX(), _unit.pos.getY(), 20, 0, 20);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.restore();

                }
            });
        });

    }

    function renderBullets(ctx) {
        const bullets = bulletsPool.get();
        var i = bullets.length - 1;

        for (i; i > -1; --i) {
            var b = bullets[i];

            ctx.beginPath();
            ctx.strokeStyle = b.color;

            ctx.arc(b.pos.getX() >> 0, b.pos.getY() >> 0, b.radius, 0, doublePI);
            if (Math.random() > .4) ctx.stroke();
            ctx.closePath();
        }
    }

    function generateShot(_unit) {
        
        const bullets = bulletsPool.get();
        Array.from(_unit.weapon.bullets).forEach(_bullet => {
            const rad = _unit.angle * (Math.PI/180);
            const b = _bullet;
            b.radius = 1;
            b.pos.setX(_unit.pos.getX() + Math.cos(rad) * 14);
            b.pos.setY(_unit.pos.getY() + Math.sin(rad) * 14);
            b.vel.setLength(10);
            b.vel.setAngle(rad+3.2);
            bullets[bullets.length] = b;
        });
        // Array.from(_scene.clans).forEach(_clan => {
        //     Array.from(_clan.units).forEach(_unit => {
        //         Array.from(_unit.weapon.bullets).forEach(_bullet => {
        //             const rad = _unit.angle * (Math.PI/180);
        //             const b = _bullet;
        //             b.radius = 1;
        //             b.pos.setX(_unit.pos.getX() + Math.cos(rad) * 14);
        //             b.pos.setY(_unit.pos.getY() + Math.sin(rad) * 14);
        //             b.vel.setLength(10);
        //             b.vel.setAngle(rad);
        //             bullets[bullets.length] = b;
        //         });
        //     }); 
        // });


    }
}

