class Mau{
    constructor(name, video, data){
        this.name = name;
        this.data = data;
        this.video = video;
    }

    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    setData(data){
        this.data = data;
    }

    getData(){
        return this.data;
    }

    getVideo(){
        return this.video;
    }

    setVideo(Video){
        this.video = Video;
    }
}

module.exports = Mau;