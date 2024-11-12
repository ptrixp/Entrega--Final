import mongoose from "mongoose";

mongoose.connect("mongodb+srv://coderhouse:coderhouse@cluster0.pkbm4.mongodb.net/comercio?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conectados a la BD"))
    .catch( (error) => console.log("Tenemos un error ", error ))