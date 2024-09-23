let mongoose = require('mongoose');
// // // mongoose aik JS m likhi hui library h jo mongodb server ke saaath interact krwati h

// // mongoose.connect('mongodb://localhost:27017/meri-achi-db').then(function(conne){
    mongoose.connect('mongodb+srv://hammadhabib0890:5oZW6l6Fe1qBx55W@water-plant-db.ritlp.mongodb.net/?retryWrites=true&w=majority&appName=Water-Plant-db').then(function(conne){

console.log(conne)

}).catch(function(err){
    console.log(err);
})