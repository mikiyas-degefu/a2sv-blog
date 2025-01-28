const mongoose = require('mongoose')

const blogRatingSchema = mongoose.Schema({
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
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }

})

module.exports = mongoose.model("BlogRating", blogRatingSchema);