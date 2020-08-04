const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
    age: { type: Number }, 
    name: { type: String, required: true },
    email: { 
        type: String, 
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 
        required: true, 
        unique: true 
    },
    password: { type: String, minlength: 6, required: true },
    profilepic: { type: String, default: '/images/icon-userdefault.png' },
    instructor: { type: Boolean, default: false },
    creatAct: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    reservAct: [{ type: Schema.Types.ObjectId, ref: 'Activity' }]
    
});

const User = mongoose.model("User", userSchema);

module.exports = User;
