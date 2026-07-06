# Interview Notes

## Short Explanation

"CampusPulse is a full-stack campus service guide. It helps students check the weekly mess menu, bus timetable, campus notices, and crowd suggestions for mess and bus services. Students can submit live feedback, and the app uses that feedback with simple timing rules."

## What To Say

- The project is based on real campus use cases.
- It uses HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.
- Mess menu and bus timetable are stored as structured JavaScript data.
- Crowd suggestion is rule-based, not AI-based.
- Student feedback is stored in MongoDB.
- Frontend communicates with backend using `fetch`.
- Campus notices support create, read, update, delete, and filtering.

## What Not To Say

- Do not say it uses YOLO.
- Do not say it uses OpenCV.
- Do not say it uses Gemini.
- Do not say it uses machine learning.
- Do not say it automatically detects crowd from camera.
- Do not say you built a production-level system.

## If Asked: Why Not AI?

"The original idea can be expanded with AI later, but for this version I focused on a practical web application that is easier to maintain and deploy. I used simple rules and student feedback because that is enough for a useful campus-level prototype."

## If Asked: How Does Crowd Logic Work?

"For mess, the backend checks the selected meal. Breakfast, lunch, and dinner are usually more crowded around their peak time. For bus, the backend checks the selected bus timing. Then it checks recent feedback from MongoDB and combines both to return Low, Medium, or High."

## APIs

- `POST /api/crowd/estimate` - returns mess or bus crowd suggestion
- `GET /api/crowd/reports` - shows recent feedback
- `POST /api/crowd/reports` - saves feedback
- `GET /api/notices` - shows notices
- `POST /api/notices` - adds a notice
- `PUT /api/notices/:id` - updates a notice
- `DELETE /api/notices/:id` - deletes a notice

## Best Resume Line

**CampusPulse - Campus Service and Crowd Guide**  
Built a full-stack web application using HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB to display mess menus, bus timetables, campus notices, and rule-based crowd suggestions using student feedback.
