import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to Mongodb database`);
    }
    catch(error){
        console.log(`error occured in mogodb connection ${error}`);
    }
} ;

export default connectDB;

