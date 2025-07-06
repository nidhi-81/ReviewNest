#  ReviewNest – Book Review & Feedback System
ReviewNest is a full-stack web app that allows users to explore books, read reviews, interact with others through likes/dislikes, and contribute their own feedback—either anonymously or with attribution. It also features an admin dashboard with sentiment score chart, user activity insights, and review moderation. It simplifies book discovery and creates a shared space for thoughtful reader engagement, saving time compared to traditional platforms like Kindle.

---

##  Features

###  User Functionality
- **JWT-based Authentication**: Secure login/register system.
- **Browse Books**: View book details and associated reviews.
- **Submit Reviews**:
  - Add rating, comment, sentiment score, and anonymity option.
  - Real-time update of reviews.
- **Like/Dislike Reviews**:
  - Each user can like or dislike a review once.
  - Prevents multiple votes per review per user.
    

### Admin Dashboard
- **Analytics Overview**:
  - Total number of reviews
  - Unique users
  - Total likes and dislikes
- **Review Management**:
  - View all submitted reviews along with user and book details.
  - Delete any review with confirmation.
- **Chart Visualization**:
  - Bar chart displaying sentiment scores of all reviews using Chart.js.

---

## Tech Stack

| Layer        | Technology         |
|--------------|--------------------|
| Frontend     | React.js           |
| Backend      | Node.js, Express.js|
| Database     | MS SQL Server      |
| Authentication | JWT (JSON Web Token) |
| Charting     | Chart.js           |

---

### Backend Setup

```bash
cd backend
npm install
node server.js
```
---
### Frontend Setup

```bash
cd frontend
npm install
npm run dev




