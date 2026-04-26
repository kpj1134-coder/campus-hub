# 🎓 Campus Hub — Virtual Campus Marketplace & Events Hub

> A full-stack web platform that solves real campus problems: buy/sell items, discover events, contact sellers via email or SMS, register for events, and get AI-powered help — all in one authenticated portal.

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-6366f1?style=for-the-badge)](https://campus-hub-demo.vercel.app)
[![Backend API](https://img.shields.io/badge/🔧_Backend_API-Render-10b981?style=for-the-badge)](https://campus-hub-9fbk.onrender.com)
[![GitHub](https://img.shields.io/badge/⭐_GitHub-Repo-333?style=for-the-badge)](https://github.com/kpj1134-coder/campus-hub)

</div>

---

## 📸 Screenshot

![Campus Hub Dashboard](./public/screenshot-dashboard.png)

---

## 🌐 Live Demo : https://campus-hub-gold.vercel.app/
"""URLs

| Service | URL |
|---|---|
| **Frontend (Vercel)** | https://campus-hub-demo.vercel.app |
| **Backend API (Render)** | https://campus-hub-9fbk.onrender.com |
| **GitHub Repository** | https://github.com/kpj1134-coder/campus-hub |

> ⚠️ **Note:** Backend runs on Render free tier — first request may take **30–60 seconds** to wake up."""

---

## 🎯 What Problem Does This Solve?

Campus students face disconnected challenges every day:
- **No trusted platform** to buy/sell textbooks, electronics, or notes within campus
- **No unified hub** to discover and register for campus + inter-college events
- **No structured way** to contact a product seller — relying on WhatsApp groups
- **No visibility** into hackathons, workshops, and tech fests at other colleges

**Campus Hub** solves all of this in a single, secure, authenticated platform.

---

## ✨ Features

### 🔐 Authentication
- JWT-based login and registration
- BCrypt password hashing
- Protected routes — unauthenticated users cannot access any page except Login/Register
- Token verification on every page refresh via `GET /api/auth/me`
- Navbar hidden before login; appears only after successful authentication

### 🛒 Marketplace
- Browse all campus products with category filters and search
- Add, edit, delete your own product listings
- Upload product image URL
- Products from all sellers in one place

### 📬 Contact Seller (Smart Alert System)
- Click **Contact Seller** on any product → type a message → send
- **Auto-detects seller's contact type:**
  - If seller gave an **email** → sends email via Gmail SMTP
  - If seller gave a **phone number** → sends SMS via Twilio
- Seller receives in-app notification instantly
- Buyer receives confirmation notification
- My Contact Requests page shows Sent & Received tabs

### 🎉 Campus Events
- Admins create, edit, delete events
- Students register for events (one-click, duplicate prevention)
- Email sent to event organizer on registration
- In-app confirmation notification for student
- My Registered Events page with date, time, venue, status
- Students can cancel their registration

### 🌐 External Events (Knowafest-style)
- Admin-curated real college events from across India
- Filter by event type, city, and date
- Deep-link to original event page
- Separate from campus events (never mixed)

### 📊 Dashboard
- 7 clickable stat cards: products, listings, campus events, external events, registrations, requests, unread alerts
- Recent registered events with real timestamps
- Recent contact requests with seller details
- Recent 5 notifications with "Just now" / "5 min ago" time formatting
- Quick Actions grid (8 buttons)
- AI Chatbot promo card

### 🔔 Smart Notifications
- Real unique timestamps using `LocalDateTime.now()` — never hardcoded
- Formatted as: "Just now", "5 minutes ago", "Today, 3:45 PM", "Yesterday, 10:30 AM"
- Mark one as read, mark all as read, delete individual notifications
- Unread count badge in Navbar (refreshes every 30s)

### 🤖 AI Chatbot
- 30+ rule-based answers covering all app features
- Answers: how to add product, contact seller, register for events, external events, dashboard help, admin guide, and more
- Ready for OpenAI/Gemini integration when `AI_API_KEY` is set

### 👤 Profile Page
- View name, email, role (student/admin)
- Activity stats: my products count, registrations, contact requests

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS |
| **Backend** | Spring Boot 3.2, Spring Security |
| **Database** | MongoDB (Spring Data MongoDB) |
| **Authentication** | JWT (JJWT 0.11.5), BCrypt |
| **Email Alerts** | Spring Boot Mail (Gmail SMTP) |
| **SMS Alerts** | Twilio Java SDK |
| **Deployment** | Frontend → Vercel, Backend → Render |

---

## 📁 Project Structure

```
EventHub/
├── backend/
│   └── src/main/java/com/campus/hub/
│       ├── config/          → SecurityConfig, DataSeeder
│       ├── controller/      → Auth, Product, Event, Contact, Notification, Chatbot, ExternalEvent
│       ├── exception/       → GlobalExceptionHandler
│       ├── model/           → User, Product, Event, Registration, ContactRequest, Notification, ExternalEvent
│       ├── repository/      → Spring Data MongoDB repositories
│       ├── security/        → JwtAuthFilter, JwtUtil, UserDetailsServiceImpl
│       └── service/         → Auth, Product, Event, Contact, Notification, Email, Chatbot, ExternalEvent
└── frontend/
    └── src/
        ├── api/             → axios.js (with JWT interceptor)
        ├── components/      → Navbar, ProductCard, EventCard, ProtectedRoute
        ├── context/         → AuthContext (JWT + token verification)
        ├── pages/           → All page components
        └── utils/           → dateUtils.js (real timestamp formatting)
```

---

## 🚀 Local Setup

### Prerequisites
- Java 17+
- Node.js 18+
- MongoDB (local or Atlas)
- Maven

### 1. Clone the Repository
```bash
git clone https://github.com/kpj1134-coder/campus-hub.git
cd campus-hub
```

### 2. Backend Setup
```bash
cd backend
```

Create or update `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/campus_hub
jwt.secret=your_secret_key_here
```

Run:
```bash
mvn spring-boot:run
```
Backend starts at: `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file:
```
VITE_API_URL=http://localhost:8080
```

Run:
```bash
npm run dev
```
Frontend starts at: `http://localhost:5173`

### 4. Login with Demo Accounts

| Role | Email | Password |
|---|---|---|
| 👑 Admin | admin@campus.com | admin123 |
| 🎓 Student | priya@student.com | student123 |
| 🎓 Student | arjun@student.com | student123 |

---

## 📧 Enable Email Alerts (Gmail)

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Create an App Password for "Mail"
3. Set environment variables:

```bash
MAIL_USERNAME=youremail@gmail.com
MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx    # Gmail App Password
```

> **Important:** Use the App Password, NOT your regular Gmail password.

---

## 📱 Enable SMS Alerts (Twilio)

When a seller provides a phone number instead of email, SMS is sent automatically.

1. Create a free account at [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Get your Account SID, Auth Token, and a virtual phone number
3. Set environment variables:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890    # Your Twilio number
```

**How it works:**
- Seller contact = email → Email sent via Gmail SMTP
- Seller contact = phone number → SMS sent via Twilio
- No credentials configured → Logs the alert (no crash)

---

## 🔑 All Environment Variables

### Backend
| Variable | Description | Required |
|---|---|---|
| `MONGO_URI` / `SPRING_DATA_MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | JWT signing key (32+ chars) | ✅ |
| `MAIL_USERNAME` | Gmail address | Optional |
| `MAIL_PASSWORD` | Gmail App Password | Optional |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | Optional |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | Optional |
| `TWILIO_PHONE_NUMBER` | Twilio virtual number | Optional |
| `AI_API_KEY` | OpenAI/Gemini key for chatbot | Optional |
| `CORS_ALLOWED_ORIGINS` | Frontend URL(s) | Optional |

### Frontend
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/auth/me` | ✅ | Verify token, get user info |

### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List all products |
| GET | `/api/products/mine` | ✅ | My listed products |
| POST | `/api/products` | ✅ | Create product |
| PUT | `/api/products/{id}` | ✅ | Update product |
| DELETE | `/api/products/{id}` | ✅ | Delete product |

### Events
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/events` | Public | List all campus events |
| POST | `/api/events` | 👑 Admin | Create event |
| DELETE | `/api/events/{id}` | 👑 Admin | Delete event |
| POST | `/api/events/{id}/register` | ✅ | Register for event |
| GET | `/api/events/my-registrations` | ✅ | My registered events |
| DELETE | `/api/events/registrations/{id}` | ✅ | Cancel registration |

### Contact Requests
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/contact-requests` | ✅ | Send contact request (triggers email/SMS) |
| GET | `/api/contact-requests/my` | ✅ | My sent requests |
| GET | `/api/contact-requests/seller` | ✅ | Requests I received as seller |
| PUT | `/api/contact-requests/{id}/status` | ✅ | Update request status |

### Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/notifications` | ✅ | All my notifications |
| GET | `/api/notifications/unread-count` | ✅ | Unread count |
| PUT | `/api/notifications/read-all` | ✅ | Mark all as read |
| PUT | `/api/notifications/{id}/read` | ✅ | Mark one as read |
| DELETE | `/api/notifications/{id}` | ✅ | Delete notification |

### External Events
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/external-events` | Public | List all external events |
| POST | `/api/external-events` | 👑 Admin | Add external event |
| DELETE | `/api/external-events/{id}` | 👑 Admin | Remove external event |

### Chatbot
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/chatbot/message` | Public | Send message, get response |

---

## 🔮 Future Scope

1. **Real-time Chat** — WebSocket-based messaging between buyer and seller
2. **Payment Integration** — UPI/Razorpay in-app transaction escrow
3. **Event Reminders** — Email/SMS 24 hours before registered event
4. **QR Code Tickets** — Downloadable QR-based e-tickets for events
5. **OpenAI Integration** — Full AI answers with `AI_API_KEY`
6. **Product Ratings** — Rate sellers after transaction
7. **College Verification** — Email domain verification (e.g. `@student.college.edu`)
8. **Mobile App** — React Native companion

---

## 🐛 Common Errors & Fixes

| Error | Fix |
|---|---|
| Backend not responding | Render free tier sleeps — wait 30–60s for first request |
| `Invalid email or password` | Make sure you registered first (no pre-existing accounts) |
| Email not received | Check `MAIL_USERNAME` / `MAIL_PASSWORD` env vars; use Gmail App Password |
| SMS not sent | Check Twilio credentials; ensure phone has country code (+91 for India) |
| CORS error | Set `CORS_ALLOWED_ORIGINS` to your frontend URL |
| MongoDB connection failed | Check `MONGO_URI` or Atlas whitelist IP |

---

## 🏆 Resume Bullets

```
• Built full-stack campus marketplace using React 18, Spring Boot 3, MongoDB, REST APIs, and JWT authentication
• Implemented smart contact-seller system that auto-detects email vs phone and routes alerts via Gmail SMTP or Twilio SMS
• Developed event registration workflow with duplicate prevention, admin email notifications, and real-time in-app alerts
• Created real-time notification system with "Just now / 5 min ago" timestamp formatting and unread count badge
• Integrated AI chatbot with 30+ rule-based responses covering all app features (production-ready for OpenAI upgrade)
• Deployed frontend to Vercel and backend to Render with environment-based configuration for staging and production
```

---

## 👨‍💻 Author

**[kpj1134-coder](https://github.com/kpj1134-coder)**

Built as a Final Year Project demonstrating full-stack development, JWT security, MongoDB data modeling, third-party API integration (Gmail SMTP, Twilio SMS), and real-world feature design.

---

*⭐ If this project helped you, please give it a star on GitHub!*
