const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb://127.0.0.1/pt-httm',{});
        console.log('connect db successful');
    }catch(error){
        console.log("failed")
    }
}

module.exports = {connect}