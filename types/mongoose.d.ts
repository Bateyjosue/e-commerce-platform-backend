import mongoose from 'mongoose'

declare module "mongoose"{
    interface Document {
        model(name: string): mongoose.Model<any>;
        calculateAverageRating(productId: any): Promise<void>
    }
}