# SkillMentor Platform

SkillMentor is a full-stack platform designed to connect students with experienced mentors for personalized career training, interview prep, and certification guidance.

## 🚀 Features

- **Mentor Discovery**: Browse a list of experienced mentors from top tech companies.
- **Detailed Profiles**: View comprehensive mentor profiles including their biography, experience, and subjects they teach.
- **Session Booking**: Seamlessly schedule sessions with mentors using an integrated calendar and scheduling system.
- **Dashboard**: Track your enrollments and upcoming sessions in a personalized dashboard.
- **Secure Authentication**: Integrated with Clerk for robust and secure user authentication.
- **Responsive Design**: Fully responsive UI that works across desktop, tablet, and mobile devices.
- **API Documentation**: Integrated Swagger/OpenAPI for easy backend exploration.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4
- **Auth**: Clerk
- **Icons**: Lucide React
- **UI Components**: Radix UI / Shadcn

### Backend
- **Framework**: Spring Boot 3.4
- **Language**: Java 21
- **Database**: PostgreSQL (Supabase)
- **Auth**: JWT with Clerk JWKS
- **OR**: Spring Data JPA
- **Documentation**: SpringDoc OpenAPI (Swagger)

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- JDK 21
- Maven 3.6+
- Supabase Account
- Clerk Account

### Local Development

#### 1. Backend Setup
1. Navigate to `backend/`
2. Configure `src/main/resources/application.properties` or set environment variables.
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. Access Swagger at: `http://localhost:8081/swagger-ui.html`

#### 2. Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env.local`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_key
   VITE_API_BASE_URL=http://localhost:8081
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```

---

## 📋 Environment Variables

### Backend
- `SPRING_DATASOURCE_URL`: PostgreSQL connection string
- `SPRING_DATASOURCE_USERNAME`: DB username
- `SPRING_DATASOURCE_PASSWORD`: DB password
- `CLERK_JWKS_URL`: Clerk JWKS endpoint
- `CLERK_ISSUER`: Clerk issuer URL
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins

### Frontend
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `VITE_API_BASE_URL`: Backend API URL

---

## ➕ Adding Mentors

### Using the API (Admin Required)
To add a new mentor, you can send a POST request to `/api/v1/mentors`. 
*Note: This endpoint is protected and requires an Admin Clerk token.*

**Request Body Example:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "title": "Senior Solutions Architect",
  "profession": "Cloud Specialist",
  "company": "Amazon",
  "experienceYears": 12,
  "bio": "Expert in AWS and cloud migration.",
  "profileImageUrl": "https://example.com/image.jpg",
  "positiveReviews": 99,
  "totalEnrollments": 500,
  "isCertified": true,
  "startYear": "2012"
}
```

### Initial Data Seeding
The application automatically seeds sample data on the first startup if the database is empty. This is handled by the `DataSeeder.java` component.

---

## 🔗 Key Endpoints (API)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/mentors` | Get all mentors (paginated) | Yes |
| GET | `/api/v1/mentors/{id}` | Get mentor details | No |
| POST | `/api/v1/sessions/enroll` | Enroll in a session | Yes |
| GET | `/api/v1/sessions/my-sessions` | Get user's enrollments | Yes |

---

## 🌐 Deployment Links

- **Frontend**: [SkillMentor Live](https://skillmentor-platform-sepia.vercel.app/) *(Example Link)*
- **Backend API**: [SkillMentor API](https://skillmentor-backend.onrender.com/swagger-ui.html) *(Example Link)*

---

## 📂 Project Structure

```text
skillmentor-platform/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages
│   │   └── lib/        # API and utilities
│   └── vercel.json     # Vercel deployment config
├── backend/            # Spring Boot backend service
│   ├── src/
│   │   ├── main/java/  # Java source code
│   │   └── main/resources/ # Config & Seed scripts
│   └── pom.xml         # Maven dependencies
└── README.md           # Main project documentation
```
