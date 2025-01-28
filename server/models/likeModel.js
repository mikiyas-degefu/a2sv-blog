const mongoose = require('mongoose')

const likeSchema = mongoose.Schema({
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
})

module.exports = mongoose.model("Like", likeSchema);