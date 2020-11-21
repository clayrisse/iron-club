# IronClub :swimmer: :tennis: :soccer:

## Description

Platform for creating sports activities in which, in addition, you can reserve your assistance to the activities already created.

## User Sories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault 
- **homepage** - As a user I want to be able to access the homepage to see what the app is about, picture galleries, all the amenities and possible classes. 
- **siup** - As a user I want to sign up on the webpage so that I can join and create classes 
- **login** - As a user I want to be able to log in so that I can get see my classes and schedules 
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account 
- **activities schedule** - As a user I want to see all the events available so that I can choose which ones I prefer. 
- **activities schedule** - As a user I want to see all the events available so that I can choose which ones I prefer. 
- **activity detail** - As a user I want to see the event details and comments of one event so that I can  **join** 
- **activity creator** - As a user /instructor, I want to be able to create a class event so that I can publish in the calendar class 
- **user class listing** - As a user I want to see the listings of past classes and reserved classes. Also be able to delete to sing out of the list. 
- **instructor class listing** - As a user /instructor I want to see the event details and attendee list of one class and be able to edit or cancel them.

## Wireframes
![](public/images/wireframe-ironclub.jpg)

## Back-end

Method | Route |	Description |	Request - Body
------ | ----- | ------------ | --------------
GET    |  /  | Main page route. Renders home index view.             
GET | /login | Renders login form view. 
POST | /login | Sends Login form data to the server. | { email, password }
GET | /signup | Renders signup form view.
POST | /signup | Sends Sign Up info to the server and creates user in the DB. | { username, email, password }
GET | /activity | Renders activities view.
GET | /activity/:id | Renders activity form profile.
GET | /faq | Renders questions Pricing and QnA. 
GET | /amenities | Renders all amenities. 
POST | /amenities | Sends picked id amenity. | { amenetyId }
GET | /amenitie/:id | Renders activity amenity information.

Private Routes
GET | /user/:id | Private route. Renders profile form view.
GET | /user/:id/edit | Private route. Renders edit-profile form view.
POST | /user/:id/edit | Private route. Renders edit-profile form view. | { img, username, age, instructor(y/n), activities }
GET | /user/create-activity | Private route. Renders create-activity form profile.
POST | /user/create-activity | Private route. Renders create-activity form profile. | { img, title, day, time, participants, amenityId, description }
GET | /user/edit-activity | Private route. Renders edit-activity form profile.
POST | /user/edit-activity | Private route. Renders edit-activity form profile. | { img, title, day, time, participants, amenityId, description }
GET | /logout | Redirects to home and signs off


## Models

User Model
```
{
    age: Number, 
    userName: { type: String, required: true },
    email: { type: String, match: /^@/, required: true, unique: true },
    password: { type: String, minlength: 6, required: true },
    imgProfile: { type: String, default: '#' },
    instructor: { type: Boolean, default: false },
    activities: {
        creatAct: { type: Schema.Types.ObjectId, ref: 'CreatAct' },
        reservAct: { type: Schema.Types.ObjectId, ref: 'CreatAct' }
    }
}
```

Activity Model
```
{
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
}
```

## Links

**Trello**

See our [Trello](https://trello.com/b/xgit0IQmzYu/ironclub) board.

**Git**

[Git](https://github.com/clayrisse/iron-club) repository.

**Deploy**

[Deploy](https://new-ironclub.herokuapp.com/).

**Slides**

Presentation [slides]().


