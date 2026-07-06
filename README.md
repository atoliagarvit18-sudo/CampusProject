# CampusPulse Student Version

CampusPulse is a student-level full-stack web project for campus daily services. It keeps the original project idea: mess menu, bus timetable, crowd guidance, student feedback, and campus notices.

This version removes the difficult interview parts like React/Next.js, AI, Gemini, OpenCV, YOLO, and heavy Python backend code. The project is rebuilt with simpler technologies that are easier to explain.

## Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose

## Main Features

- View full weekly mess menu
- View bus timetable for each day
- Select mess meal and get a simple crowd suggestion
- Select bus timing and get a simple crowd suggestion
- Submit student crowd feedback as Low, Medium, or High
- Store crowd feedback in MongoDB
- Add, edit, delete, and filter campus notices
- Responsive frontend using plain HTML, CSS, and JavaScript

## How Crowd Suggestion Works

This project does not use AI or camera-based detection.

The backend uses simple logic:

1. For mess, it checks the selected meal timing.
2. For bus, it checks the selected bus time.
3. It reads recent student feedback from MongoDB.
4. It combines timing-based logic and student feedback.
5. It returns Low, Medium, or High crowd with a short suggestion.

This keeps the project useful while staying easy to explain in interviews.

## How to Run

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example`.

Start MongoDB locally.

Run the app:

```bash
npm start
```

Open:

```text
http://localhost:5000
```

## Resume Title

**CampusPulse - Campus Service and Crowd Guide**

## Resume Description

Built a full-stack campus service web application using HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB. The app provides weekly mess menu, bus timetable, campus notices, student crowd feedback, and rule-based crowd suggestions for mess and bus services.

## Resume Bullet Points

- Developed a student-focused campus service guide using HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.
- Added weekly mess menu and bus timetable features using structured JavaScript data.
- Built REST APIs to store and fetch student crowd feedback from MongoDB.
- Implemented simple rule-based crowd suggestions using meal time, bus timing, and recent feedback.
- Added CRUD functionality for campus notices with category filtering.

## Interview Explanation

"CampusPulse is a campus service guide where students can check the mess menu, bus timetable, campus notices, and crowd status. Students can submit crowd feedback as Low, Medium, or High. The app does not use AI or camera detection. It uses simple timing rules and recent feedback from MongoDB to show a useful crowd suggestion. The frontend is built with HTML, CSS, and JavaScript, and the backend is built with Node.js, Express.js, and MongoDB."
