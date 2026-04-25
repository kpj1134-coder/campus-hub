package com.campus.hub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ChatbotService {

    @Value("${ai.api.key:}")
    private String aiApiKey;

    private static final Map<String, String> RULE_BASED_RESPONSES = Map.ofEntries(
        Map.entry("product", "🛒 To browse products, go to the **Marketplace** page. You can search by name or category. To sell something, click **'Add Product'** after logging in!"),
        Map.entry("sell", "💰 Want to sell something? Head to the **Marketplace** and click **'Add Product'**. Fill in the title, price, category, and your contact info."),
        Map.entry("buy", "🛍️ Browse all listed products on the **Marketplace** page. Contact the seller directly using the contact info on each product card."),
        Map.entry("event", "🎉 Check out upcoming campus events on the **Events Hub** page. You can register for events with just one click!"),
        Map.entry("register", "✅ To register for an event, go to **Events Hub** and click the **'Register'** button on any event card. Make sure you're logged in!"),
        Map.entry("seller", "📞 Contact information for sellers is available on each product card in the **Marketplace**. Just find the product and check the contact details."),
        Map.entry("login", "🔐 To login, click the **'Login'** button in the navbar. Use your email and password. New here? Click **'Register'** to create an account."),
        Map.entry("password", "🔑 If you forgot your password, please contact the admin at **admin@campus.com**."),
        Map.entry("admin", "👑 Admins can add/delete events and manage all products. Contact **admin@campus.com** for admin access."),
        Map.entry("dashboard", "📊 Your **Dashboard** shows your product listings, event registrations, and notifications all in one place."),
        Map.entry("notification", "🔔 Check your **Notifications** page for updates on event registrations and other campus activities."),
        Map.entry("help", "🤝 I'm the Campus Hub Assistant! I can help you with:\n• 🛒 Marketplace & Products\n• 🎉 Events & Registration\n• 🔐 Login & Account\n• 📊 Dashboard & Notifications\n\nWhat do you need help with?"),
        Map.entry("hello", "👋 Hello! I'm the **Campus Hub AI Assistant**. How can I help you today? Type 'help' to see what I can do!"),
        Map.entry("hi", "👋 Hi there! Welcome to **Campus Hub**! Type 'help' to see how I can assist you.")
    );

    public String getResponse(String message) {
        if (message == null || message.isBlank()) {
            return "Please type a message and I'll be happy to help! 😊";
        }

        String lowerMessage = message.toLowerCase().trim();

        // Check if AI API key is configured
        if (aiApiKey != null && !aiApiKey.isBlank()) {
            return callAiApi(message);
        }

        // Rule-based response
        for (Map.Entry<String, String> entry : RULE_BASED_RESPONSES.entrySet()) {
            if (lowerMessage.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        // Default response
        return "🤔 I'm not sure about that. Here's what I can help with:\n\n" +
               "• Type **'product'** → Marketplace help\n" +
               "• Type **'event'** → Events help\n" +
               "• Type **'seller'** → Seller contact info\n" +
               "• Type **'dashboard'** → Dashboard guide\n" +
               "• Type **'help'** → Full help menu\n\n" +
               "Or contact admin at **admin@campus.com** 📧";
    }

    private String callAiApi(String message) {
        // Placeholder for OpenAI API integration
        // To enable: add your OpenAI API key to application.properties
        // and implement HTTP call to https://api.openai.com/v1/chat/completions
        return "AI API response for: " + message;
    }
}
