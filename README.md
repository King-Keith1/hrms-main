# HRMS — Human Resource Management System

## What is this project?

HRMS is a full-stack web application that digitises the core operations of a company's HR department. Instead of managing employees, attendance, leave, and payroll through spreadsheets or manual processes, HRMS provides a secure, role-based system that different types of users can interact with based on their permissions.

The system solves the following real business problems:

- **Employee management** — HR admins and managers can onboard new employees and assign them to departments
- **Attendance tracking** — Employees clock in daily by marking their hours worked, including overtime
- **Leave management** — Employees submit leave requests which managers or admins can approve
- **Payroll calculation** — The system automatically calculates gross pay based on actual attendance records and approved paid leave, with overtime paid at 1.5x the hourly rate

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Java 17 | Language |
| Spring Boot 4 | Framework |
| Spring Security 7 | Authentication & Authorization |
| JWT (jjwt 0.11.5) | Stateless token-based auth |
| PostgreSQL | Database |
| Hibernate / JPA | ORM |
| springdoc-openapi 2.8.5 | Swagger UI & API docs |
| BCrypt | Password hashing |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build tool |
| React Router DOM | Client-side routing |
| Axios | HTTP client |

---

## Business Rules

### Roles
| Role | What they can do |
|------|-----------------|
| `ROLE_ADMIN` | Full access — manage all employees across all departments, approve leave, generate payroll |
| `ROLE_MANAGER` | Can view and manage employees within their own department, approve leave, generate payroll |
| `ROLE_EMPLOYEE` | Can mark their own attendance and submit leave requests |

### Payroll Calculation
```
For each working day:
  Regular pay  = hourlyRate x hoursWorked
  Overtime pay = hourlyRate x overtimeHours x 1.5

For approved paid leave days:
  Leave pay = hourlyRate x standardHoursPerDay x leaveDays

Gross Pay = Sum of all regular pay + overtime pay + paid leave pay
```

Overtime is any hours worked beyond the employee's standard hours per day (default 8 hours).

### Attendance Rules
- An employee can only mark attendance once per day
- Hours worked must be greater than 0

### Leave Rules
- End date cannot be before start date
- Leave can be either PAID or UNPAID
- Leave starts with PENDING status and must be approved by a manager or admin

---

## Project Structure

```
backend/
src/main/java/com/company/hrms/
├── config/                        # CORS and OpenAPI configuration
├── controller/                    # REST controllers
├── dto/                           # Request and response DTOs
├── entity/                        # JPA entities and enums
├── exception/                     # Global exception handler
├── repository/                    # Spring Data JPA repositories
├── security/                      # JWT filter, service, and security config
└── service/                       # Business logic services

frontend/
src/
├── api/                           # Axios API calls per domain
├── components/                    # Shared components (Navbar, Card)
├── pages/
│   ├── auth/                      # Login and Register pages
│   ├── admin/                     # Admin dashboard
│   ├── manager/                   # Manager dashboard
│   └── employee/                  # Employee dashboard
└── utils/                         # Auth helpers (token, role, logout)
```

---

## Setup & Running

### Prerequisites
- Java 17+
- PostgreSQL installed and running
- Node.js 18+
- Maven

### Backend Setup

**1. Create the PostgreSQL database**
```sql
CREATE DATABASE hrms;
```

**2. Configure `application.properties`**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hrms
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

**3. Run the backend**
```bash
mvn spring-boot:run
```

The application will auto-create all tables and seed departments on first run.

**4. Access Swagger UI**
```
http://localhost:8080/swagger-ui.html
```

### Frontend Setup

**1. Install dependencies**
```bash
cd hrms-frontend
npm install
```

**2. Run the frontend**
```bash
npm run dev
```

**3. Open the app**
```
http://localhost:5173
```

---

## Environment Variables

For production set these environment variables:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret key for signing JWT tokens (min 32 chars) |
| `JWT_EXPIRATION` | Token expiry in milliseconds (default 86400000 = 24h) |
| `DATABASE_URL` | PostgreSQL connection URL |
| `DATABASE_USERNAME` | Database username |
| `DATABASE_PASSWORD` | Database password |

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and get JWT token |
| GET | `/auth/me` | Authenticated | Get current user details |

### Employees
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/employees` | ADMIN, MANAGER | Create a new employee |
| GET | `/employees` | ADMIN, MANAGER | Get all employees |
| GET | `/employees/{id}` | ADMIN, MANAGER | Get employee by ID |
| GET | `/employees/department/{deptId}` | ADMIN, MANAGER | Get employees by department |

### Attendance
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/attendance/mark` | EMPLOYEE | Mark today's attendance |
| GET | `/attendance/employee/{id}` | ADMIN, MANAGER | Get attendance for current month |

### Leaves
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/leaves` | EMPLOYEE | Submit a leave request |
| POST | `/leaves/{id}/approve` | ADMIN, MANAGER | Approve a leave request |
| GET | `/leaves` | ADMIN, MANAGER | Get all leave requests |
| GET | `/leaves/my` | EMPLOYEE | Get my leave requests |

### Payroll
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/payroll/generate/{employeeId}` | ADMIN, MANAGER | Generate monthly payroll |
| GET | `/payroll` | ADMIN, MANAGER | Get all payroll records |
| GET | `/payroll/employee/{id}` | ADMIN, MANAGER | Get payroll by employee |

### System
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/system/current-date` | All roles | Get current system date |
| POST | `/system/next-day` | ADMIN, MANAGER | Advance system date by 1 day |

---

## Deployment

- **Backend** — deployed on Render as a web service
- **Frontend** — deployed on Vercel
- **Database** — Render PostgreSQL

---

## Security

- All endpoints except `/auth/**`, `/swagger-ui/**`, and `/api-docs/**` require a valid Bearer token
- Tokens are signed with HMAC-SHA256 and expire after 24 hours
- Passwords are hashed with BCrypt
- JWT secret is set as an environment variable in production

---

## See Also

- `TestingFlow.html` — Visual step-by-step guide for testing the application