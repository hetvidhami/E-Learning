import mongoose from "mongoose";

const { Schema } = mongoose;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    popularity: {
        type: Number,
        default: 4
    },
    thumbnail: {
        type: String
    }
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
