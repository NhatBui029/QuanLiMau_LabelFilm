class Frame{
    constructor(name, image1, image2, data){
        this.name = name;
        this.image1 = image1; 
        this.image2 = image2; 
        this.data = data;
    }

    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    setImage1(image1){
        this.image1 = image1;
    }

    getImage1(){
        return this.image1;
    }

    setImage2(image2){
        this.image2 = image2;
    }

    getImage2(){
        return this.image2;
    }

    setData(data){
        this.data = data;
    }

    getData(){
        return this.data;
    }
}

module.exports = Frame;