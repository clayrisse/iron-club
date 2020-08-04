const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const activitySchema = new Schema({
    title: String,
    img: { type: String, default: '#' },
    description: String,
    amenity: { type: String, enum: ['tennis', 'football', 'swimming'] }, 
    participants: Number,
    date: Date, 
    // faltaria hora_?
    //time: time,
    instructor:  { type: Schema.Types.ObjectId, ref: 'User' },
    //asisted: { type: Boolean, default: false },
    coments: String,
    rating: { type: Number, min: 1, max: 5 }
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;


//   ---------------Reubicar

// const amenities = [
//     {
//         amenity: 'Tennis',
//         id: 01
//         courtNumber: '1',
//         schedule: [8:00, 9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00]
//         openDays: ['mon', 'thu', 'wed', 'tue', 'fri', 'sat', 'sun'],
//         capacity: 10,
//         availability: true.
//     },
//     {
//         amenity: 'Tennis',
//         id: 02
//         courtNumber: '2',
//         schedule: [8:00, 9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00]
//         openDays: ['mon', 'thu', 'wed', 'tue', 'fri', 'sat', 'sun'],
//         capacity: 10,
//         availability: true.
//     },
//     {
//         amenity: 'Pool',
//         id: 03
//         courtNumber: '1',
//         schedule: [8:00, 9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00]
//         openDays: ['mon', 'thu', 'wed', 'tue', 'fri', 'sat', 'sun'],
//         capacity: 30,
//         availability: true.
//     },
//     {
//         amenity: 'Futboll',
//         id: 03
//         courtNumber: '1',
//         schedule: [8:00, 9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00]
//         openDays: ['mon', 'thu', 'wed', 'tue', 'fri', 'sat', 'sun'],
//         capacity: 40,
//         availability: true.
//     },
// ]