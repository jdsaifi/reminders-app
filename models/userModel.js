const mongoose = require('mongoose');
const config = require('../config');
const jwt = require('jsonwebtoken');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = mongoose.Schema({
    auth_provider: {
        type: String,
        default: 'self'
    },
    auth_provider_id: {
        type: String,
        default: null
    },
    auth_provider_access_token: {
        type: String,
        default: null
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type:String,
        required: true,
        unique: true,
        lowercase: true
    },
    dc: String,
    mn: String,
    uin: String,
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    display_name: String,
    first_name: String,
    last_name: String,
    dp: {
        type: String,
        default: null
    },
    access_token: String,
    timezone: String,
    can_friend_set_reminder: {
        type: Boolean,
        default: true
    },
    friends: [{
        type: ObjectId,
        ref: "users"
    }],
    friend_requests_in: [{
        type: ObjectId,
        ref: "users"
    }],
    friend_requests_out: [{
        type: ObjectId,
        ref: "users"
    }],
    blocked: [{
        type: ObjectId,
        ref: "users"
    }]
}, {
    timestamps:true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

userSchema.methods.getJWT = async function() {
    const user = this;
    let { _id: id } = user;
    const token = jwt.sign({id}, config.JWTSKEY);
    user.access_token = token;
    await user.save();
    return token;
}

userSchema.methods.toProfile = function() {
    const { _id:id, username, uin, email, display_name } = this;
    return {id, username, uin, email, display_name};
}

const Users = mongoose.model('users', userSchema);

module.exports = Users;