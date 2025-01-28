const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: [true, 'Blog ID is required!'],
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required!'],
    },
    content: {
        type: String,
        required: [true, 'Content is required!'],
        minlength: [1, "Content must be at least 1 characters long!"],
    },

})

module.exports = mongoose.model("Comment", commentSchema);