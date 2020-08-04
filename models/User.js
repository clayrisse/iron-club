const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
    age: Number, 
    name: { type: String, required: true },
    email: { 
        type: String, 
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 
        required: true, 
        unique: true 
    },
    password: { type: String, minlength: 6, required: true },
    profilepic: { type: String, default: '#' },
    instructor: { type: Boolean, default: false },
    activities: {
        creatAct: { type: Schema.Types.ObjectId, ref: 'CreatAct' },
        reservAct: { type: Schema.Types.ObjectId, ref: 'CreatAct' }// es reservAct?
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;