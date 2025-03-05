import mongoose, {Schema, model} from 'mongoose';

export interface postType{
    _id: mongoose.Types.ObjectId;
    title: String,
    content: String,
    thumbnail: {
        url: String,
        public_id: String,
    },
    slug: String,
    author: String,
    tags: String[],
    meta: String,
    timeStamp: Date,
}

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true

    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    thumbnail: {
        type: Object,
        url: {
            type: URL,
            // required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    author: {
        type: String,
        default: "Admin",
        ref: 'Auth'
    },
    tags: [String],

    meta: {
        type: String,
        trim: true,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }

});
// postSchema.index({title: 'text'});

export default model<postType>('Post', postSchema);