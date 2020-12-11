export function createVec2D() {

    return (function () {
        var create = function (x = 0, y = 0) {
            var obj = {
                _x: 1,
                _y: 0,

                getX: function () {
                    return this._x;
                },

                setX: function (value) {
                    this._x = value;
                },

                getY: function () {
                    return this._y;
                },

                setY: function (value) {
                    this._y = value;
                },

                getLength: function () {
                    return Math.sqrt(this._x * this._x + this._y * this._y);
                },

                setLength: function (length) {
                    var angle = this.getAngle();
                    this._x = Math.cos(angle) * length;
                    this._y = Math.sin(angle) * length;
                },

                getAngle: function () {
                    return Math.atan2(this._y, this._x);
                },

                setAngle: function (angle) {
                    var length = this.getLength();
                    this._x = Math.cos(angle) * length;
                    this._y = Math.sin(angle) * length;
                },

                add: function (vector) {
                    this._x += vector.getX();
                    this._y += vector.getY();
                },
            };
            obj.setX(x);
            obj.setY(y);
            return obj;
        };

        return { create: create };
    }());
}
