\# IssueNest   



A full-stack issue tracking and management web application built using React, Node.js, Express.js, and MongoDB.



IssueNest allows authenticated users to create, view, update, and delete issues while providing a simple dashboard and issue management interface.



\---



\## 🚀 Features   



\### Authentication

\- User registration

\- User login

\- Password hashing using bcrypt

\- JWT-based authentication

\- Protected routes

\- Authentication error handling

\- Session management using browser local storage



\### Issue Management

\- Create new issues

\- View all issues

\- View individual issue details

\- Update issues

\- Delete issues

\- View issues created by the logged-in user

\- Ownership-based authorization



\### Issue Information

Each issue supports:



\- Title

\- Description

\- Priority

\- Status

\- Category

\- Created date

\- Updated date

\- Issue creator



\### Dashboard

\- Total issue count

\- Open issue count

\- In-progress issue count

\- Resolved issue count

\- Recent issues

\- Quick access to My Issues

\- Quick access to Create Issue

\- Logout functionality



\### Search \& Filtering

\- Search issues

\- Filter by status

\- Filter by priority

\- Display result count

\- Clear filters

\- Empty-state handling

\- No-search-results handling



\### Validation \& Error Handling

\- Client-side form validation

\- Server-side validation

\- API error handling

\- Centralized backend error middleware

\- Loading states

\- Retry functionality

\- Delete confirmation



\### Responsive UI

The application is designed to work across:



\- Desktop

\- Laptop

\- Tablet

\- Mobile



\---



\# 🛠️ Tech Stack



\## Frontend



\- React.js

\- Vite

\- React Router

\- JavaScript

\- CSS



\## Backend



\- Node.js

\- Express.js

\- JWT

\- bcryptjs

\- CORS

\- dotenv



\## Database



\- MongoDB

\- Mongoose



\## Development Tools



\- Visual Studio Code

\- Git

\- GitHub

\- npm

\- MongoDB

\- MongoDB Shell



\---



\# 📁 Project Structure



```text

IssueNest/

│

├── client/

│   ├── public/

│   │

│   ├── src/

│   │   ├── api/

│   │   │   └── api.js

│   │   │

│   │   ├── assets/

│   │   │

│   │   ├── pages/

│   │   │   ├── CreateIssue.jsx

│   │   │   ├── Dashboard.jsx

│   │   │   ├── EditIssue.jsx

│   │   │   ├── IssueDetails.jsx

│   │   │   ├── Issues.jsx

│   │   │   ├── Landing.jsx

│   │   │   ├── Login.jsx

│   │   │   ├── MyIssues.jsx

│   │   │   └── Register.jsx

│   │   │

│   │   ├── App.jsx

│   │   ├── main.jsx

│   │   ├── ProtectedRoute.jsx

│   │   └── App.css

│   │

│   ├── package.json

│   └── .gitignore

│

├── server/

│   ├── config/

│   │   └── db.js

│   │

│   ├── controllers/

│   │   ├── authController.js

│   │   └── issueController.js

│   │

│   ├── middleware/

│   │   ├── authMiddleware.js

│   │   └── errorMiddleware.js

│   │

│   ├── models/

│   │   ├── Issue.js

│   │   └── User.js

│   │

│   ├── routes/

│   │   ├── authRoutes.js

│   │   └── issueRoutes.js

│   │

│   ├── .env

│   ├── .env.example

│   ├── .gitignore

│   ├── package.json

│   └── server.js

│

├── .gitignore

└── README.md

🏗️ Application Architecture



IssueNest follows a basic full-stack architecture:



&#x20;               ┌─────────────────────┐

&#x20;               │      React UI       │

&#x20;               │      Frontend       │

&#x20;               └──────────┬──────────┘

&#x20;                          │

&#x20;                          │ HTTP Requests

&#x20;                          │ REST API

&#x20;                          ▼

&#x20;               ┌─────────────────────┐

&#x20;               │   Express.js API    │

&#x20;               │      Backend        │

&#x20;               └──────────┬──────────┘

&#x20;                          │

&#x20;                          │ Mongoose

&#x20;                          ▼

&#x20;               ┌─────────────────────┐

&#x20;               │      MongoDB        │

&#x20;               │      Database       │

&#x20;               └─────────────────────┘



Authentication flow:



User

&#x20;│

&#x20;▼

React Login/Register

&#x20;│

&#x20;▼

Express Authentication API

&#x20;│

&#x20;▼

MongoDB User

&#x20;│

&#x20;▼

JWT Token

&#x20;│

&#x20;▼

Protected API Requests

🔐 Authentication



IssueNest uses JWT-based authentication.



Registration



The user provides:



Name

Email

Password



The password is hashed using bcryptjs before being stored in MongoDB.



Login



The user provides:



Email

Password



The backend:



Finds the user.

Compares the password using bcrypt.

Generates a JWT token.

Returns the token to the frontend.



The frontend stores the authentication token in local storage.



🛡️ Protected Routes



Protected frontend routes require an authentication token.



The application uses:



ProtectedRoute.jsx



Protected pages include:



/dashboard

/create-issue

/issues

/my-issues

/issues/:id

/issues/:id/edit



Unauthenticated users are redirected to:



/login

👤 Issue Ownership



IssueNest implements ownership-based authorization.



A logged-in user can:



Create their own issue

View issues

Edit their own issue

Delete their own issue

View their own issues



Users cannot modify or delete issues belonging to another user.



This authorization is enforced on the backend rather than relying only on frontend restrictions.



🔌 REST API



Base backend URL:



http://localhost:5000

Authentication Endpoints

Register

POST /api/auth/register

Login

POST /api/auth/login

Issue Endpoints



All issue endpoints require authentication.



Get All Issues

GET /api/issues

Get My Issues

GET /api/issues/my

Get Single Issue

GET /api/issues/:id

Create Issue

POST /api/issues

Update Issue

PUT /api/issues/:id

Delete Issue

DELETE /api/issues/:id

🗄️ Database



IssueNest uses a local MongoDB database.



Database name:



issuenest



Default MongoDB connection:



mongodb://127.0.0.1:27017/issuenest



Main collections:



users

issues

⚙️ Environment Variables



Backend environment variables are stored in:



server/.env



Example:



PORT=5000

MONGODB\_URI=mongodb://127.0.0.1:27017/issuenest

JWT\_SECRET=your\_secret\_key



Do not commit the actual .env file to GitHub.



The project includes:



server/.env.example



as a reference.



💻 Installation

Prerequisites



Make sure the following are installed:



Node.js

npm

MongoDB

MongoDB Shell

Git

Visual Studio Code

1\. Clone the Repository

git clone https://github.com/RohiniLongadge14/IssueNest.git



Move into the project:



cd IssueNest

2\. Start MongoDB



Make sure the MongoDB service is running.



The application expects MongoDB at:



127.0.0.1:27017

3\. Configure Backend



Move into the server directory:



cd server



Install dependencies:



npm install



Create:



server/.env



Add:



PORT=5000

MONGODB\_URI=mongodb://127.0.0.1:27017/issuenest

JWT\_SECRET=your\_secret\_key

4\. Start Backend



From the server directory:



npm run dev



The backend should run at:



http://localhost:5000



You can also start it using:



npm start

5\. Start Frontend



Open another terminal.



Move to the client directory:



cd client



Install dependencies:



npm install



Start the development server:



npm run dev



The frontend should run at:



http://localhost:5173

🌐 Frontend Routes

Public Routes

/



Landing page.



/login



User login.



/register



User registration.



Protected Routes

/dashboard



User dashboard.



/create-issue



Create a new issue.



/issues



View and filter issues.



/my-issues



View issues created by the logged-in user.



/issues/:id



View issue details.



/issues/:id/edit



Edit an issue.



🧪 Testing



The application was tested across the major full-stack workflows.



Authentication Testing



Tested:



User registration

Successful login

Invalid credentials

Missing authentication token

Valid authentication token

Issue Testing



Tested:



Create issue

Get all issues

Get individual issue

Update issue

Delete issue

Get current user's issues

Authorization Testing



Tested:



User can edit their own issue

User can delete their own issue

User cannot modify another user's issue

Frontend Testing



Tested:



Login

Registration

Dashboard

Create Issue

Issues

My Issues

Issue Details

Edit Issue

Delete confirmation

Search

Status filtering

Priority filtering

Empty states

API error states

Loading states

Logout

Protected routes

Database Testing



Verified:



Users collection

Issues collection

User records

Issue records

Issue ownership

MongoDB connectivity

🧠 Validation



The application contains both frontend and backend validation.



Examples include:



Required fields

Name length validation

Email validation

Password validation

Issue title validation

Issue description validation

Priority validation

Status validation

Category validation

MongoDB ObjectId validation

🚨 Error Handling



The backend uses centralized error handling middleware.



Errors are returned using JSON responses.



Example:



{

&#x20; "message": "Error message"

}



The frontend displays appropriate error messages to the user.



🔒 Security



IssueNest includes several basic security practices:



Password hashing with bcrypt

JWT authentication

Protected API endpoints

Ownership authorization

Environment variables for sensitive configuration

.env excluded from Git

Server-side validation

Client-side validation

📦 Backend Dependencies



Main backend dependencies include:



express

mongoose

bcryptjs

jsonwebtoken

cors

dotenv



Development dependency:



nodemon

📦 Frontend Dependencies



Main frontend dependencies include:



react

react-dom

react-router-dom



Development tools include:



vite

@vitejs/plugin-react

oxlint

🚀 Future Improvements



Possible future improvements include:



Admin role and permissions

Issue comments

Issue attachments

Issue assignment

User profile management

Email notifications

Pagination

Advanced sorting

Dashboard charts

Dark mode

Deployment

Cloud MongoDB

Automated testing

CI/CD pipeline

Docker support

📸 Application Screens



The application contains:



Landing Page

Login Page

Registration Page

Dashboard

Issue List

My Issues

Create Issue

Issue Details

Edit Issue

🎯 Project Objective



The main objective of IssueNest is to demonstrate a complete full-stack application using a modern JavaScript technology stack.



The project demonstrates:



Frontend development with React

REST API development

Backend development with Node.js and Express

MongoDB database integration

Authentication

Authorization

CRUD operations

API integration

Form validation

Error handling

Git and GitHub workflow

Full-stack application architecture

👩‍💻 Author



Rohini Longadge



GitHub:


https://github.com/RohiniLongadge14

📄 License



This project is created for learning, portfolio, and educational purposes.





\### After pasting



Save the file with:



\*\*Ctrl + S\*\*



Then close Notepad.



Run:



```cmd

cd /d D:\\Project\\IssueNest

git status

