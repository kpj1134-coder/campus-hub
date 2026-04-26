package com.campus.hub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ChatbotService {

    @Value("${ai.api.key:}")
    private String aiApiKey;

    private static final Map<String, String> RULE_BASED_RESPONSES = new LinkedHashMap<>();

    static {
        // Greetings
        RULE_BASED_RESPONSES.put("hello", "👋 Hello! Welcome to **Campus Hub**! I'm your AI assistant. How can I help you today? Type **'help'** to see all I can do!");
        RULE_BASED_RESPONSES.put("hi ", "👋 Hi there! I'm the **Campus Hub Assistant**. Type **'help'** to see what I can do for you.");
        RULE_BASED_RESPONSES.put("hey", "👋 Hey! Great to see you on Campus Hub. Type **'help'** for a list of things I can help with.");

        // Help
        RULE_BASED_RESPONSES.put("help", "🤝 I can help you with:\n\n" +
                "🛒 **Marketplace** — Add, browse, and contact sellers\n" +
                "🎉 **Campus Events** — View and register for events\n" +
                "🌐 **External Events** — Discover inter-college events\n" +
                "📬 **Contact Seller** — Send interest requests\n" +
                "🔐 **Login/Register** — Account setup\n" +
                "📊 **Dashboard** — Overview of your activity\n" +
                "🔔 **Notifications** — Track your alerts\n" +
                "👤 **Profile** — View your account info\n\n" +
                "Just type your question and I'll answer!");

        // Marketplace / Products
        RULE_BASED_RESPONSES.put("add product", "🛒 To add a product:\n1. Login to your account\n2. Go to **Marketplace**\n3. Click **'+ Add Product'**\n4. Fill in title, description, price, category, and contact info\n5. Click **Save** ✅");
        RULE_BASED_RESPONSES.put("sell", "💰 Want to sell something?\n1. Go to **Marketplace**\n2. Click **'+ Add Product'**\n3. Fill in details and your contact info\n4. Your product will be visible to all students!");
        RULE_BASED_RESPONSES.put("product", "🛒 Browse all listed products on the **Marketplace** page. You can filter by category and search by name. Contact the seller using the **'Contact Seller'** button!");
        RULE_BASED_RESPONSES.put("edit product", "✏️ To edit your product:\n1. Go to **Marketplace**\n2. Find your product (or go to **My Products** in Dashboard)\n3. Click **Edit**\n4. Update details and Save");
        RULE_BASED_RESPONSES.put("delete product", "🗑️ To delete your product:\n1. Go to **Marketplace** or **Dashboard → My Products**\n2. Click the **Delete** button\n3. Confirm deletion");
        RULE_BASED_RESPONSES.put("my product", "📦 See all your listed products in **Dashboard → My Products** or visit **Marketplace** and filter by your listings.");

        // Contact Seller
        RULE_BASED_RESPONSES.put("contact seller", "📬 To contact a seller:\n1. Find the product in **Marketplace**\n2. Click **'📬 Contact Seller'**\n3. Type your message in the popup\n4. Click **Send Request**\n\nThe seller gets an email + notification instantly! ✅");
        RULE_BASED_RESPONSES.put("contact request", "📬 Your contact requests are in **Dashboard → My Contact Requests** or at **Contact Requests** page.\n\nEvery request shows:\n• Product name\n• Seller's contact details\n• Message you sent\n• Status (SENT/VIEWED/RESPONDED)");
        RULE_BASED_RESPONSES.put("seller", "👤 Seller contact information is revealed after you click **'Contact Seller'** on a product card and send a request.");

        // Events
        RULE_BASED_RESPONSES.put("register for event", "🎟️ To register for an event:\n1. Go to **Events Hub**\n2. Find the event you like\n3. Click **'🎟️ Register'**\n4. You'll get a confirmation notification ✅\n\nYou can only register once per event.");
        RULE_BASED_RESPONSES.put("event", "🎉 Campus Events are listed on the **Events Hub** page. Click **Register** to join. Check **My Registered Events** to see your registrations.");
        RULE_BASED_RESPONSES.put("campus event", "🎉 Campus events are created by admins. Go to **Events Hub** to browse and register. You'll get a notification and email confirmation upon registration!");
        RULE_BASED_RESPONSES.put("my event", "🎟️ Your registered events are in **Dashboard → My Registered Events** or at the **My Registered Events** page. You can view event date, time, location, and status.");
        RULE_BASED_RESPONSES.put("cancel registration", "❌ To cancel your event registration:\n1. Go to **My Registered Events**\n2. Find the event\n3. Click **'Cancel Registration'**\n\nNote: Admin will be notified of the cancellation.");
        RULE_BASED_RESPONSES.put("registered event", "🎟️ See all your registered events in **Dashboard → My Registered Events** or the **My Registered Events** page.");

        // External Events
        RULE_BASED_RESPONSES.put("external event", "🌐 **External Events** are real college events from across India (sourced via Knowafest).\n\n- Browse at **External Events** page\n- Filter by city, state, event type, and date\n- Click **'View Details'** to open the original event page\n- Admins can add new external events manually");
        RULE_BASED_RESPONSES.put("knowafest", "🌐 External events on Campus Hub are sourced from college event platforms. Admins curate and add these events manually so you get the best inter-college opportunities!");
        RULE_BASED_RESPONSES.put("inter college", "🌐 Check the **External Events** page for hackathons, workshops, tech fests, and seminars happening at colleges across India!");
        RULE_BASED_RESPONSES.put("hackathon", "💻 Looking for hackathons? Check the **External Events** page! Filter by **'Hackathon'** event type to see all available hackathons.");

        // Dashboard
        RULE_BASED_RESPONSES.put("dashboard", "📊 Your **Dashboard** shows everything at a glance:\n\n• 🛒 My Products\n• 🎟️ My Registered Events\n• 📬 My Contact Requests\n• 🔔 Recent Notifications\n• 📈 Stats cards\n• ⚡ Quick action buttons");

        // Notifications
        RULE_BASED_RESPONSES.put("notification", "🔔 Your **Notifications** page shows:\n• Contact request sent/received\n• Event registration confirmations\n• Admin alerts\n\nNotifications are shown with correct real time like **'5 min ago'** or **'Today 3:45 PM'**.");
        RULE_BASED_RESPONSES.put("unread", "🔔 Unread notifications show a badge count in the navbar. Go to **Notifications** to view and mark them as read.");

        // Auth
        RULE_BASED_RESPONSES.put("login", "🔐 To login:\n1. Go to the **Login** page\n2. Enter your registered email and password\n3. Click **Sign In**\n\nAfter login, you'll be taken to the **Dashboard** automatically.");
        RULE_BASED_RESPONSES.put("register", "📝 To create an account:\n1. Click **Register** on the login page\n2. Enter your name, email, and password\n3. Click **Create Account**\n\nYou'll be automatically logged in and taken to the Dashboard!");
        RULE_BASED_RESPONSES.put("password", "🔑 If you forgot your password, please contact the admin at **admin@campus.com**.");
        RULE_BASED_RESPONSES.put("logout", "👋 To logout, click the **Logout** button in the navbar. You'll be redirected to the Login page.");
        RULE_BASED_RESPONSES.put("account", "👤 Your account info is on the **Profile** page. You can view your name, email, role, and activity stats.");

        // Admin
        RULE_BASED_RESPONSES.put("admin", "👑 **Admin features include:**\n• Add/Edit/Delete campus events\n• View event registrations\n• Add external events\n• View all products\n• Manage notifications\n\nContact **admin@campus.com** for admin access.");
        RULE_BASED_RESPONSES.put("admin dashboard", "👑 The Admin Dashboard shows:\n• Total users, products, events\n• Event registration counts\n• Recent buyer interests\n• Quick action buttons");

        // Profile
        RULE_BASED_RESPONSES.put("profile", "👤 Your **Profile page** shows:\n• Name & Email\n• Account Role\n• My Products count\n• My Registrations count\n• My Contact Requests count\n\nGo to **Profile** from the navbar.");

        // General
        RULE_BASED_RESPONSES.put("how to", "🤔 I can help with that! Could you be more specific? Try asking:\n• **'how to add product'**\n• **'how to contact seller'**\n• **'how to register for event'**\n• **'how to view notifications'**");
        RULE_BASED_RESPONSES.put("what is", "🤔 Campus Hub is a full-stack platform for college students that includes:\n🛒 Marketplace · 🎉 Events · 🌐 External Events · 📬 Seller Contact · 🤖 AI Chatbot · 📊 Dashboard");
    }

    public String getResponse(String message) {
        if (message == null || message.isBlank()) {
            return "Please type a message and I'll be happy to help! 😊";
        }

        String lower = message.toLowerCase().trim();

        // AI API (if configured)
        if (aiApiKey != null && !aiApiKey.isBlank()) {
            return callAiApi(message);
        }

        // Rule-based matching
        for (Map.Entry<String, String> entry : RULE_BASED_RESPONSES.entrySet()) {
            if (lower.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        // Smart fallback
        return "🤔 I'm not sure about that specific question. Here's what I can help with:\n\n" +
               "• **'help'** → Full feature guide\n" +
               "• **'add product'** → List your item\n" +
               "• **'contact seller'** → Contact a product seller\n" +
               "• **'register for event'** → Join a campus event\n" +
               "• **'external events'** → Discover inter-college events\n" +
               "• **'notifications'** → Your alerts\n" +
               "• **'dashboard'** → Your overview\n\n" +
               "📧 For more help: **admin@campus.com**";
    }

    private String callAiApi(String message) {
        // When AI_API_KEY is set, integrate with OpenAI or Gemini here
        // Example: POST https://api.openai.com/v1/chat/completions
        // For now, fall through to rule-based with AI-styled prefix
        return getResponse(message.toLowerCase().contains("help") ? "help" : "default_fallback");
    }
}
