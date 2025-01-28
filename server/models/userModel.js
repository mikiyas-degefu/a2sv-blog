const bcrypt = require('bcrypt');
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'Username already taken!'],
        required: [true, 'Username is required!']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required!'],
        unique: [true, 'Email already taken!'],
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address!']
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    first_name: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [2, "First name must be at least 2 characters long!"],
        maxlength: [50, "First name cannot exceed 50 characters!"]
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [2, "Last name must be at least 2 characters long!"],
        maxlength: [50, "Last name cannot exceed 50 characters!"]
    },
    bio: {
        type: String,
        require: false
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

},
    { timestamps: true }
)

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


module.exports = mongoose.model("User", userSchema);