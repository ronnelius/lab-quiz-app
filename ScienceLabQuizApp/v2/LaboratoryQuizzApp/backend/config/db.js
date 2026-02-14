import dns from "node:dns/promises"; 
// Force DNS servers (Cloudflare + Google) 
dns.setServers(["1.1.1.1", "8.8.8.8"]);


import mongoose from "mongoose";


export const connectDB = async() => { 
    await mongoose.connect('mongodb+srv://mesiaronnel_db_user:labquizapp@cluster0.0ef4azm.mongodb.net/LaboratoryQuizApp?retryWrites=true&w=majority')
    .then(()=> {console.log('DB Connected')})   
    console.log('DB Connected to', mongoose.connection.name);
}
