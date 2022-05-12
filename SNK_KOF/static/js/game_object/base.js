let Arr_Game_Object = [];

class Game_Object {
    constructor() {
        Arr_Game_Object.push(this);

        this.has_start = false;
        this.timedelta = 0;         //记录每一帧的时间间隔，用于处理角色操作移动

    }

    start() { //开始前执行一次

    }

    update() {   //开始后一直更新

    }

    destory() {      //删除元素
        for (let i = 0; i < Arr_Game_Object.length; i++)
            if (Arr_Game_Object[i] === this) {
                Arr_Game_Object.splice(i, 1);
                break;
            }
    }
}

let laststamp;

let Game_Object_Frame = function (timestamp) {
    for (let key of Arr_Game_Object) {
        if (key.has_start === false) {
            key.has_start = true;
            key.start();
        } else {
            key.timedelta = timestamp - laststamp;
            key.update();
        }
    }
    laststamp = timestamp;
    requestAnimationFrame(Game_Object_Frame);
}

requestAnimationFrame(Game_Object_Frame);


export {
    Game_Object
}