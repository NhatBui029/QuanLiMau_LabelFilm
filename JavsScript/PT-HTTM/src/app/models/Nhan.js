class Nhan{
    constructor(name,x_left,y_left,x_right,y_right){
        this.name = name;
        this.x_left = x_left;
        this.y_left = y_left;
        this.x_right = x_right;
        this.y_right = y_right;
    }

    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    setX_left(x_left){
        this.x_left = x_left;
    }

    getX_left(){
        return this.x_left;
    }

    setY_left(y_left){
        this.y_left = y_left;
    }

    getY_left(){
        return this.y_left;
    }

    setX_right(x_right){
        this.x_right = x_right;
    }

    getX_right(){
        return this.x_right;
    }

    setY_right(y_right){
        this.y_right = y_right;
    }

    getY_right(){
        return this.y_right;
    }   
}

module.exports = Nhan;