# CampusPulse

CampusPulse is a full-stack web application that streamlines everyday campus services for students — including mess menus, bus schedules, crowd guidance, and campus notices — all in one place.

The project uses a lightweight, easy-to-maintain tech stack, making it simple to run, extend, and explain end-to-end.

## Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose

## Features

- View the full weekly mess menu
- View the bus timetable for each day
- Get crowd-level suggestions for mess meals and bus timings
- Submit crowd feedback (Low / Medium / High)
- Store and retrieve feedback via MongoDB
- Create, edit, delete, and filter campus notices
- Fully responsive frontend built with plain HTML, CSS, and JavaScript

## How Crowd Suggestions Work

CampusPulse uses a rule-based system (no AI or camera-based detection) to estimate crowd levels:

1. Checks the selected meal or bus timing
2. Reads recent student feedback from MongoDB
3. Combines timing logic with feedback data
4. Returns a Low, Medium, or High crowd estimate with a short suggestion

This approach keeps the feature genuinely useful while remaining simple, transparent, and easy to walk through in a technical discussion.

## Getting Started

**1. Install dependencies**
```bash
npm install
```

**2. Configure environment variables**

Create a `.env` file based on `.env.example` and fill in your MongoDB connection details.

**3. Start MongoDB locally**

**4. Run the application**
```bash
npm start
```

**5. Open in your browser**
```text
http://localhost:5000
```

## Project Summary

**CampusPulse — Campus Service and Crowd Guide**

A full-stack campus service web application providing weekly mess menus, bus timetables, campus notices, student crowd feedback, and rule-based crowd suggestions for mess and bus services.

### Key Contributions

- Developed a student-focused campus service platform using HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB
- Implemented weekly mess menu and bus timetable features using structured JavaScript data
- Built REST APIs to store and retrieve student crowd feedback from MongoDB
- Designed a rule-based crowd suggestion system using meal timing, bus timing, and recent feedback
- Added full CRUD functionality for campus notices with category-based filtering
- 


