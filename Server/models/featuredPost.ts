import {model, Schema, Types} from 'mongoose';
export interface featuredPostType {
    post:Types.ObjectId,
    timeStamp:Date,

}

const featuredPostSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }

});

export default model<featuredPostType>('FeaturedPost', featuredPostSchema);