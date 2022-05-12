import { Game_Object } from "../game_object/base.js";

class Control extends Game_Object {
    constructor($canvas) {
        super();
        this.$canvas = $canvas;
        this.press_key = new Set();        // 用set存储当前按下哪些键，用set可以自动判重并且避免出现按键连续按住当角色反应不过来的情况
    }

    start() {
        let outer = this;
        this.$canvas.on("keydown", function (e) {
            outer.press_key.add(e.key);
        });
        this.$canvas.on("keyup", function (e) {
            outer.press_key.delete(e.key);
        })
    }
}
export {
    Control
}