const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const activitySchema = new Schema({
    title: String,
    img: { type: String, default: '#' },
    description: String,
    sport: { type: String, enum: ['tennis', 'football', 'swimming'] },
    participants: Number,
    date: Date, 
    instructor:  { type: Schema.Types.ObjectId, ref: 'User' },
    asisted: { type: Boolean, default: false },
    coments: String,
    rating: { type: Number, min: 1, max: 5 }
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;