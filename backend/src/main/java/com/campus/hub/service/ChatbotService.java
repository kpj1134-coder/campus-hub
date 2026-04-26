package com.campus.hub.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@Slf4j
public class ChatbotService {

    @Value("${ai.api.key:}")
    private String aiApiKey;

    /**
     * Ordered rule-based response map.
     * Key = keyword(s) to match (comma-separated, case-insensitive).
     * Value = response string.
     * LinkedHashMap preserves insertion order — more specific rules first.
     */
    private static final LinkedHashMap<String, String> RULES = new LinkedHashMap<>();

    static {
        // ── GREETING ────────────────────────────────────────────────────────
        RULES.put("hello,hi,hey,greet,help", "👋 Hey there! I'm Campus Hub AI. I can help you with:\n\n• 🛒 Marketplace (buy/sell)\n• 🎉 Events (register & get QR pass)\n• 📬 Contact Seller workflow\n• ❤️ Wishlist / Saved Products\n• 🔔 Notifications\n• 👑 Admin functions\n\nJust ask me anything!");

        // ── REGISTRATION & QR PASS ───────────────────────────────────────────
        RULES.put("qr,pass,qr code,qr pass,event pass,download pass,ticket",
                "🎟️ **QR Event Pass**\n\n1. Register for any event (Events page)\n2. Your status starts as **PENDING**\n3. Admin reviews and **Approves** or Rejects\n4. If Approved → go to **My Registered Events**\n5. Your QR Pass appears automatically ✅\n6. Click **Download Pass** to save as PNG\n\nShow your QR at the event entry.");

        RULES.put("register event,event register,how to register,register for event",
                "🎉 **Event Registration**\n\n1. Go to **Events** page\n2. Find an event you like\n3. Click **Register**\n4. Status = PENDING (awaiting admin approval)\n5. Admin approves → you get a notification + QR Pass\n\n📍 Track registrations at **My Registered Events**");

        RULES.put("pending,pending registration,pending request,what is pending",
                "⏳ **What does PENDING mean?**\n\nPENDING means your request is submitted but waiting for action:\n\n• **Event Registration** → Admin hasn't approved yet\n• **Contact Request** → Seller hasn't responded yet\n\nYou'll get an in-app notification when status changes.");

        RULES.put("approved,approve,approval,how admin approves",
                "✅ **Admin Approval**\n\nWhen admin **Approves** your event registration:\n• You get an in-app notification\n• Your QR Event Pass is generated\n• Go to **My Registered Events** to download it\n\nAdmin can also **Reject** if capacity is full.");

        RULES.put("cancel,cancel registration",
                "🚫 **Cancel Registration**\n\nYou can cancel a PENDING registration:\n1. Go to **My Registered Events**\n2. Find the pending event\n3. Click **Cancel Registration**\n\n⚠️ Once APPROVED, you cannot cancel online — contact the organizer.");

        // ── MARKETPLACE & PRODUCTS ───────────────────────────────────────────
        RULES.put("add product,sell,list product,create listing,post product",
                "🛒 **Adding a Product**\n\n1. Go to **Marketplace**\n2. Click **+ Add Product**\n3. Fill in: Title, Description, Category, Price, Contact, Image URL\n4. Click **Add Product**\n\nYour listing appears immediately. You can Edit/Delete anytime.");

        RULES.put("edit product,update product,modify listing",
                "✏️ **Editing a Product**\n\n1. Go to **Marketplace**\n2. Find YOUR product (shows Edit button)\n3. Click **✏️ Edit**\n4. Update fields and save\n\nOnly YOU (seller) can edit your own listings.");

        RULES.put("product status,available,reserved,sold,mark sold,mark reserved",
                "🏷️ **Product Status**\n\nAs a seller you can change status:\n• **AVAILABLE** = Open for contact\n• **RESERVED** = Under negotiation\n• **SOLD** = No longer available\n\nUse the dropdown on your product card.\nBuyers CANNOT contact for RESERVED or SOLD items.");

        RULES.put("delete product,remove listing",
                "🗑️ **Deleting a Product**\n\n1. Go to **Marketplace**\n2. Find YOUR product\n3. Click **🗑️ Delete**\n4. Confirm deletion\n\nAdmins can also remove any listing if it violates rules.");

        RULES.put("search,filter,find product,browse,category",
                "🔍 **Finding Products**\n\n• Use the **search bar** to search by title/description\n• Use **category filters** (Books, Electronics, Notes, etc.)\n• Hover on products to see full details\n• Products sorted by newest first");

        // ── CONTACT SELLER ───────────────────────────────────────────────────
        RULES.put("contact seller,contact,send request,interest,message seller",
                "📬 **Contact Seller Workflow**\n\n1. Browse Marketplace\n2. Click **📬 Contact Seller** on any AVAILABLE product\n3. Type your message and send\n4. Seller gets an **in-app notification**\n5. Track status under **Contact Requests**\n\nStatus flow: PENDING → ACCEPTED / REJECTED / RESPONDED");

        RULES.put("accepted,seller accepted,request accepted",
                "✅ **Request Accepted!**\n\nWhen seller ACCEPTS your request:\n• You get an in-app notification\n• Seller will contact you via your registered email\n• Check your email or ask the seller to reach out\n\nTip: Make sure your profile email is correct.");

        RULES.put("rejected,seller rejected,request rejected",
                "❌ **Request Rejected**\n\nThe seller has declined your interest. This can happen if:\n• Product is already reserved/sold\n• Seller found another buyer\n\nTry contacting another seller or check back later.");

        RULES.put("contact request,my requests,sent requests",
                "📬 **My Contact Requests**\n\nGo to **Contact Requests** page:\n• **Sent tab** = requests you sent as buyer\n• **Received tab** = requests sellers sent to you (as seller)\n\nSellers can Accept, Reject, or Mark Responded.");

        // ── WISHLIST ─────────────────────────────────────────────────────────
        RULES.put("wishlist,save,saved,bookmark,favourite,favorite",
                "❤️ **Wishlist / Saved Products**\n\n• Click **🤍 Save** on any product card to save it\n• Click again to **❤️ unsave** (toggle)\n• View all saved items at **Saved Products** page\n• Saved items show current status (Available/Reserved/Sold)");

        RULES.put("saved products,my saved,wishlist page",
                "❤️ Go to **Saved Products** in the menu to see all items you've saved. You can remove items from there too.");

        // ── NOTIFICATIONS ────────────────────────────────────────────────────
        RULES.put("notification,notifications,alert,alerts,bell",
                "🔔 **In-App Notifications**\n\nYou get notifications for:\n• Contact request sent/accepted/rejected\n• Event registration submitted\n• Event approved/rejected by admin\n• Product updates\n\n**Actions:**\n• Click ✓ to mark one read\n• Mark All as Read\n• 🗑️ Delete individual notifications\n\nThe 🔔 badge in the navbar shows unread count.");

        RULES.put("unread,mark read,read all",
                "✅ To clear notifications:\n• Go to **Notifications** page\n• Click **Mark All Read** button, or\n• Click ✓ on each notification individually\n• Red badge disappears when count = 0");

        // ── EVENTS ───────────────────────────────────────────────────────────
        RULES.put("events,campus event,add event,create event",
                "🎉 **Campus Events**\n\n**Students:**\n• Browse events on Events page\n• Click Register → status = PENDING\n• Track status at My Registered Events\n\n**Admins:**\n• Click **+ Add Event** on Events page\n• Fill title, description, date, time, location\n• Approve/reject registrations at Event Requests page");

        RULES.put("event requests,admin event,event approval,approve registration",
                "👑 **Admin Event Requests**\n\nAdmins go to **Event Requests** page:\n• See all PENDING registrations\n• Click **✅ Approve** or **❌ Reject**\n• Student gets notified automatically\n• Approved students get QR pass");

        // ── AUTH ─────────────────────────────────────────────────────────────
        RULES.put("login,sign in,signin",
                "🔐 **Login**\n\n1. Go to the Login page\n2. Enter your registered email & password\n3. Click **Login**\n4. You're redirected to Dashboard\n\nIf you haven't registered, click **Register** first.");

        RULES.put("register,sign up,signup,create account",
                "📝 **Register**\n\n1. Click **Register** on the login page\n2. Enter your name, email, password\n3. Click **Create Account**\n4. You're automatically logged in!\n\nPasswords are securely hashed with BCrypt.");

        RULES.put("logout,sign out",
                "👋 To logout, click the **Logout** button in the navbar (top right). Your session will be cleared and you'll return to the login page.");

        RULES.put("password,forgot password,reset password",
                "🔒 Forgot password? Currently the app doesn't have email-based reset. Contact your campus admin to reset your account or re-register with the same email.");

        // ── PROFILE ──────────────────────────────────────────────────────────
        RULES.put("profile,account,my account,user profile",
                "👤 **Profile Page**\n\nClick your name chip in the navbar or go to **Profile**.\nYou can see:\n• Your name, email, role\n• Activity stats (products, registrations, requests)\n• Quick links to your pages");

        // ── ADMIN ────────────────────────────────────────────────────────────
        RULES.put("admin,admin dashboard,admin panel",
                "👑 **Admin Dashboard**\n\nAdmins see:\n• Analytics cards (users, products, events, registrations)\n• Pending event approvals\n• Pending seller requests\n• Quick action shortcuts\n\nAdmin-only: Create events, approve/reject registrations");

        RULES.put("analytics,stats,statistics,metrics",
                "📊 **Analytics Dashboard** (Admin only)\n\nThe admin dashboard shows:\n• Total users, products, events\n• Available vs Sold products\n• Pending/Approved/Rejected registrations\n• Pending contact requests");

        // ── TECH / HOW IT WORKS ──────────────────────────────────────────────
        RULES.put("how does it work,explain,overview,what is campus hub",
                "🎓 **Campus Hub Overview**\n\nA full-stack campus platform with:\n• 🛒 **Marketplace** — Buy/sell within campus\n• 🎉 **Events** — Register with admin approval + QR pass\n• 📬 **Contact Seller** — In-app messaging workflow\n• ❤️ **Wishlist** — Save products for later\n• 🔔 **Notifications** — Real-time in-app alerts\n• 🤖 **AI Chatbot** — This is me!\n\nBuilt with React + Spring Boot + MongoDB + JWT");

        RULES.put("technology,tech stack,built with,spring boot,react,mongodb",
                "⚙️ **Tech Stack**\n\n• **Frontend**: React 18, Vite, Vanilla CSS\n• **Backend**: Spring Boot 3, Spring Security\n• **Database**: MongoDB (Spring Data)\n• **Auth**: JWT + BCrypt\n• **QR Code**: qrcode.react\n• **Deploy**: Vercel (frontend), Render (backend)");

        // ── FALLBACK ─────────────────────────────────────────────────────────
    }

    public String getResponse(String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            return "Please type a question and I'll help you! 😊";
        }

        String lower = userMessage.toLowerCase().trim();

        // Match against rules — check if any key word appears in message
        for (Map.Entry<String, String> rule : RULES.entrySet()) {
            String[] keywords = rule.getKey().split(",");
            for (String kw : keywords) {
                if (lower.contains(kw.trim())) {
                    return rule.getValue();
                }
            }
        }

        // Fallback response
        return "🤔 I'm not sure about that. Here are some things you can ask me:\n\n" +
               "• **How to add a product**\n" +
               "• **How to contact a seller**\n" +
               "• **How to get a QR pass**\n" +
               "• **What does pending mean**\n" +
               "• **How to register for an event**\n" +
               "• **How wishlist works**\n" +
               "• **How notifications work**\n\n" +
               "Try rephrasing your question! 😊";
    }
}
