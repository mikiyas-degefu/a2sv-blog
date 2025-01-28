const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required!'],
    },
    title: {
        type: String,
        required: [true, 'Title is required!'],
        minlength: [3, "title must be at least 2 characters long!"],
        maxlength: [300, "title cannot exceed 300 characters!"]
    },
    content: {
        type: String,
        required: [true, 'Content is required!'],
        minlength: [10, "Content must be at least 2 characters long!"],
    },
},
    { timestamps: true }
)

module.exports = mongoose.model("Blog", blogSchema);