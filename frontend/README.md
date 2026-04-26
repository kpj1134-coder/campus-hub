# 🎓 Virtual Campus Marketplace & Events Hub

> A full-stack web platform built with **React + Spring Boot + MongoDB** that solves real-world campus problems — enabling students to buy/sell items, register for events, discover inter-college opportunities, and communicate with sellers securely.

---

## 📌 Real-World Problem Solved

Campus students face multiple disconnected challenges:
1. **No trusted platform** to buy/sell used textbooks, electronics, notes, and other items within campus.
2. **No unified event system** to discover, register, and track both campus and inter-college events.
3. **No visibility** into real-world events happening at colleges across India.
4. **Fragmented communication** — students had no structured way to contact product sellers.

**Campus Hub** solves all of these in a single, authenticated platform with role-based access control (student vs. admin).

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Vanilla CSS |
| Backend | Spring Boot 3, Spring Security |
| Database | MongoDB (via Spring Data MongoDB) |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Frontend → Vercel, Backend → Render |

---

## 🔐 Authentication Flow

- **Login / Register** pages are the only pages accessible without authentication.
- All other routes (Marketplace, Events, Dashboard, Notifications, etc.) are protected via `ProtectedRoute` component in React.
- The Navbar is **hidden entirely before login** — shown only after successful authentication.
- After login, users are automatically redirected to the **Dashboard**.
- JWT tokens are stored in `localStorage` and sent as `Authorization: Bearer <token>` headers on every API request.
- The backend validates tokens using Spring Security's `JwtAuthFilter`.

---

## 📬 Contact Seller Workflow

**Problem:** Students couldn't contact product sellers from within the app.

**Solution:**

1. A logged-in buyer clicks **"📬 Contact Seller"** on any product they don't own.
2. A modal appears with a pre-filled message that the buyer can customize.
3. The frontend calls `POST /api/contact-requests` with `{ productId, message }`.
4. The backend:
   - Looks up the product and the current user.
   - Prevents duplicate contact requests from the same buyer for the same product.
   - Saves a `ContactRequest` document in MongoDB with full buyer/seller/product details.
   - Creates a **notification for the seller** (e.g., "Priya Sharma is interested in your product: Scientific Calculator").
5. The seller's contact details (email/phone) are **revealed** in the modal on success.
6. Buyers can view all their contact requests on the **"My Contact Requests"** page.

**ContactRequest schema:**
```
id, productId, productTitle, buyerId, buyerName, buyerEmail,
sellerId, sellerName, sellerContact, message, createdAt, status
```

**API Endpoints:**
- `POST /api/contact-requests` — Create a new contact request (authenticated)
- `GET /api/contact-requests/my` — Get all contact requests made by the logged-in buyer

---

## 🎟️ Event Registration Workflow

**Problem:** The existing registration only stored minimal data and had no status tracking.

**Solution:**

1. A student clicks **"🎟️ Register"** on any campus event they haven't registered for yet.
2. The frontend calls `POST /api/events/{id}/register`.
3. The backend:
   - Retrieves the authenticated user and the event.
   - **Prevents duplicate registration** using `existsByUserIdAndEventId`.
   - Saves a complete `Registration` document with all event and user details.
   - Creates a **notification** for the student (e.g., "You have successfully registered for: Tech Fest 2024 on 2024-12-15").
4. The registration card shows date, time, venue, and confirmed status.
5. Students can view all registrations on the **"My Registered Events"** page.
6. The **Dashboard** shows the 3 most recent registrations with full details.

**Registration schema:**
```
id, userId, userName, userEmail, eventId, eventTitle,
eventDate, eventTime, eventLocation, registeredAt, status
```

---

## 🌐 Knowafest Real-World Events Integration

**Problem:** Students are unaware of hackathons, workshops, and tech fests happening at other colleges.

**Solution:** Admin-curated External Events sourced from [Knowafest.com](https://www.knowafest.com) — the largest college event aggregator in India.

**Key Design Decisions:**
- ✅ **No automatic scraping** — events are manually added by admin to stay ethical and compliant.
- Each event shows a **"Knowafest" source badge** and a **"View on Knowafest"** deep link.
- Students can filter external events by **Event Type**, **City**, and **Date**.

**ExternalEvent schema:**
```
id, title, eventType, collegeName, city, state,
startDate, endDate, sourceName, sourceUrl
```

**API Endpoints:**
- `GET /api/external-events` — Public: View all curated external events
- `POST /api/external-events` — Admin only: Add a new Knowafest event link
- `DELETE /api/external-events/{id}` — Admin only: Remove an external event

**Event Types supported:** Hackathon, Workshop, Technical Fest, Seminar, Competition, Cultural Fest

---

## 📊 Dashboard

The Dashboard gives a comprehensive overview:

| Stat Card | Description |
|---|---|
| 🛒 Total Products | All products listed in the marketplace |
| 🎉 Campus Events | All internal campus events |
| 🌐 External Events | Knowafest-sourced events |
| 🎟️ My Registrations | Events the user has registered for |
| 📬 Contact Requests | Contact requests sent by the user |
| 🔔 Unread Alerts | Unread notification count |

**Sections:**
- Recent registered events (with date, time, venue, status)
- Recent contact requests (with seller details)
- Recent 5 notifications
- My product listings with delete option

---

## 🚀 Getting Started

### Backend
```bash
cd backend
# Set MONGODB_URI in application.properties or env variable
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

**Demo Credentials:**
| Role | Email | Password |
|---|---|---|
| Admin | admin@campus.com | admin123 |
| Student | priya@student.com | student123 |
| Student | arjun@student.com | student123 |

---

## 🔮 Future Scope

1. **Real-time Chat** — WebSocket-based messaging between buyer and seller after a contact request is approved.
2. **Payment Integration** — UPI/Razorpay integration for in-app transaction escrow.
3. **Event Reminders** — Email/push notifications 24 hours before a registered event.
4. **Knowafest API Integration** — If Knowafest provides a public API, auto-sync events.
5. **QR Code Tickets** — Generate QR-based e-tickets for registered events.
6. **Product Rating System** — Allow buyers to rate sellers after a transaction.
7. **Advanced Search & Recommendations** — ML-based product recommendations based on user activity.
8. **College Verification** — Email domain-based verification (e.g., `@student.college.edu`).
9. **Mobile App** — React Native companion app.
10. **Admin Analytics Dashboard** — Usage stats, popular products, event attendance charts.

---

## 📁 Project Structure

```
EventHub/
├── backend/
│   └── src/main/java/com/campus/hub/
│       ├── config/          # SecurityConfig, DataSeeder
│       ├── controller/      # REST Controllers
│       ├── dto/             # Request/Response DTOs
│       ├── model/           # MongoDB Documents
│       ├── repository/      # Spring Data Repositories
│       ├── security/        # JWT Filter & Utils
│       └── service/         # Business Logic
└── frontend/
    └── src/
        ├── api/             # Axios instance
        ├── components/      # Navbar, ProductCard, EventCard, ProtectedRoute
        ├── context/         # AuthContext (JWT + user state)
        └── pages/           # All page components
```

---

*Built as a Final Year Project demonstrating full-stack development, JWT security, MongoDB data modeling, and real-world feature integration.*
