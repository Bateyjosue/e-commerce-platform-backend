import mongoose, { mongo } from "mongoose";

const connectDB = (url: string):Promise<typeof mongoose> => {
    return mongoose.connect(url)
}

export default connectDB