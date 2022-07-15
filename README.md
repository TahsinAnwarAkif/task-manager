# Task Manager API

> Backend API for Task Manager application, where users can CRUD over their tasks and admins can also manage all the tasks and the users.

> Live URL: http://188.166.97.45/

This project is created while doing this course: [The Complete Node.js Developer Course (3rd Edition)](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) course.

### Env Variables

To run the app locally, create a .env file in then root and add the following

```
NODE_ENV = development | production
PORT = <PORT>
MONGO_URI=<YOUR_MONGODB_URI>
JWT_SECRET=<JWT_SECRET>
JWT_EXPIRE=<JWT_EXPIRE_TIME>
JWT_COOKIE_EXPIRE=<JWT_COOKIE_EXPIRE_TIME>

SMTP_HOST=<SMTP_HOST>
SMTP_PORT=<2525>
SMTP_EMAIL=<SMTP_EMAIL>
SMTP_PASSWORD=<SMTP_PASSWORD>
FROM_EMAIL=<FROM_EMAIL>
FROM_NAME=<FROM_NAME>
```

### Install Dependencies & Run

```
npm install
npm run dev
```

### Seed Database

You can use the following commands to seed the database with some sample users/tasks as well as destroy all data

```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```

### Task Functionalities

- List logged in users tasks, all users' all the tasks (i.e. by admin)

  - Pagination
  - Filtering (i.e. with NoSQL standard querying)
  - Selecting specific fields in result
  - Sorting by single/multi params

- Save a new task for the logged in user, or for other user (i.e. by admin)
- Update/Delete a task for the logged in user, or for other user (i.e. by admin)

### User Functionalities

- List all users w/ proper auth
  - Pagination
  - Filtering (i.e. with NoSQL standard querying)
  - Selecting specific fields in result
  - Sorting by single/multi params
- Create/Update/Delete a user w/ proper auth
- View/Upload a user's profile photo, save it in bytes

### Auth Functionalities

- User Login/Logout and Registration (w/ "user" role)
- Preview/Update my profile
- Update/Forget/Reset password using token
- View/Upload profile photo, save it in bytes

## Misc Functionalities

- Proper authentication/authorization w/ JWT
- Owner cases implementation wherever applicable
- Passwor hashing
- Mongoose / other validations
- Proper error status code / message handling
- Taking only specific fields wherever saving/updating an entity, in order to prevent inputting system generated fields
- Database seeders
- Prevent NoSQL injections
- Add extra headers for security
- Prevent cross site scripting - XSS
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param polution
- Use cors to make API public (for now)
- API Documentation in Postman as well as by Docgen

### Documentation

> Postman API Documentation: [here](https://documenter.getpostman.com/view/2647947/UzQuR6nt)

> Docgen API Documentation: [here](http://188.166.97.45/)
