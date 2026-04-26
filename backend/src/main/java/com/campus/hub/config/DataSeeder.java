package com.campus.hub.config;

import com.campus.hub.model.Event;
import com.campus.hub.model.ExternalEvent;
import com.campus.hub.model.Product;
import com.campus.hub.model.User;
import com.campus.hub.repository.EventRepository;
import com.campus.hub.repository.ExternalEventRepository;
import com.campus.hub.repository.ProductRepository;
import com.campus.hub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final EventRepository eventRepository;
    private final ExternalEventRepository externalEventRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only seed if database is empty
        if (userRepository.count() > 0) {
            log.info("Data already seeded. Skipping...");
            return;
        }

        log.info("Seeding initial data...");
        seedUsers();
        seedProducts();
        seedEvents();
        seedExternalEvents();
        log.info("Data seeding complete!");
    }

    private void seedUsers() {
        List<User> users = List.of(
            User.builder()
                .name("Admin User")
                .email("admin@campus.com")
                .password(passwordEncoder.encode("admin123"))
                .role("admin")
                .build(),
            User.builder()
                .name("Priya Sharma")
                .email("priya@student.com")
                .password(passwordEncoder.encode("student123"))
                .role("student")
                .build(),
            User.builder()
                .name("Arjun Kumar")
                .email("arjun@student.com")
                .password(passwordEncoder.encode("student123"))
                .role("student")
                .build(),
            User.builder()
                .name("Sneha Patel")
                .email("sneha@student.com")
                .password(passwordEncoder.encode("student123"))
                .role("student")
                .build(),
            User.builder()
                .name("Rahul Singh")
                .email("rahul@student.com")
                .password(passwordEncoder.encode("student123"))
                .role("student")
                .build(),
            User.builder()
                .name("Meera Nair")
                .email("meera@student.com")
                .password(passwordEncoder.encode("student123"))
                .role("student")
                .build()
        );
        List<User> savedUsers = userRepository.saveAll(users);
        log.info("Seeded {} users", savedUsers.size());

        // Seed products using student IDs
        String priyaId = savedUsers.get(1).getId();
        String arjunId = savedUsers.get(2).getId();
        String snehaId = savedUsers.get(3).getId();
        String rahulId = savedUsers.get(4).getId();

        seedProductsWithIds(priyaId, arjunId, snehaId, rahulId);
    }

    private void seedProducts() {
        // Products seeded inside seedUsers with real IDs
    }

    private void seedProductsWithIds(String priyaId, String arjunId, String snehaId, String rahulId) {
        List<Product> products = List.of(
            Product.builder()
                .title("Engineering Mathematics Textbook")
                .description("Complete EM textbook for 2nd year. Very good condition, barely used.")
                .category("Books")
                .price(250.0)
                .sellerId(priyaId)
                .sellerName("Priya Sharma")
                .contact("priya@student.com")
                .imageUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400")
                .createdAt(LocalDateTime.now().minusDays(5))
                .build(),
            Product.builder()
                .title("Scientific Calculator (Casio fx-991ES)")
                .description("Casio scientific calculator, perfect working condition. Used for 1 semester only.")
                .category("Electronics")
                .price(800.0)
                .sellerId(arjunId)
                .sellerName("Arjun Kumar")
                .contact("arjun@student.com")
                .imageUrl("https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400")
                .createdAt(LocalDateTime.now().minusDays(4))
                .build(),
            Product.builder()
                .title("Laptop Stand + Cooling Pad")
                .description("Adjustable aluminum laptop stand with USB cooling pad. Great for long study sessions.")
                .category("Electronics")
                .price(1200.0)
                .sellerId(snehaId)
                .sellerName("Sneha Patel")
                .contact("sneha@student.com")
                .imageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400")
                .createdAt(LocalDateTime.now().minusDays(3))
                .build(),
            Product.builder()
                .title("Data Structures Notes (Handwritten)")
                .description("Complete handwritten notes for Data Structures & Algorithms. Very detailed and neat.")
                .category("Notes")
                .price(150.0)
                .sellerId(rahulId)
                .sellerName("Rahul Singh")
                .contact("rahul@student.com")
                .imageUrl("https://images.unsplash.com/photo-1517842645767-c639042777db?w=400")
                .createdAt(LocalDateTime.now().minusDays(2))
                .build(),
            Product.builder()
                .title("Bicycle (Hero Sprint)")
                .description("Hero Sprint bicycle, perfect for campus commute. Minor scratches but fully functional.")
                .category("Vehicles")
                .price(3500.0)
                .sellerId(priyaId)
                .sellerName("Priya Sharma")
                .contact("priya@student.com")
                .imageUrl("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400")
                .createdAt(LocalDateTime.now().minusDays(1))
                .build(),
            Product.builder()
                .title("Drawing Board + Instruments Set")
                .description("Complete drawing board set with T-square, set squares, and instruments. For civil/arch students.")
                .category("Stationery")
                .price(600.0)
                .sellerId(arjunId)
                .sellerName("Arjun Kumar")
                .contact("arjun@student.com")
                .imageUrl("https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400")
                .createdAt(LocalDateTime.now().minusHours(12))
                .build(),
            Product.builder()
                .title("Bluetooth Headphones (Boat Rockerz)")
                .description("Boat Rockerz 255 Bluetooth headphones. 8hr battery life. Selling as I bought better ones.")
                .category("Electronics")
                .price(1500.0)
                .sellerId(snehaId)
                .sellerName("Sneha Patel")
                .contact("sneha@student.com")
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400")
                .createdAt(LocalDateTime.now().minusHours(6))
                .build(),
            Product.builder()
                .title("College Hoodie (L/XL)")
                .description("Official college hoodie in Large and XL sizes. Unused. Perfect for cold days on campus!")
                .category("Clothing")
                .price(450.0)
                .sellerId(rahulId)
                .sellerName("Rahul Singh")
                .contact("rahul@student.com")
                .imageUrl("https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400")
                .createdAt(LocalDateTime.now().minusHours(2))
                .build()
        );
        productRepository.saveAll(products);
        log.info("Seeded {} products", products.size());
    }

    private void seedEvents() {
        List<Event> events = List.of(
            Event.builder()
                .title("Tech Fest 2024 - Innovation Summit")
                .description("Annual technology festival featuring hackathons, project exhibitions, and guest talks from industry leaders.")
                .date("2024-12-15")
                .time("09:00 AM")
                .location("Main Auditorium")
                .organizer("Admin User")
                .organizerId("admin")
                .build(),
            Event.builder()
                .title("Campus Placement Drive - TCS & Infosys")
                .description("On-campus recruitment drive by TCS and Infosys. Open to all final year students. Bring 5 copies of your resume.")
                .date("2024-12-20")
                .time("08:30 AM")
                .location("Seminar Hall, Block A")
                .organizer("Admin User")
                .organizerId("admin")
                .build(),
            Event.builder()
                .title("Cultural Night - Rang De Campus")
                .description("Annual cultural extravaganza with music, dance, drama, and food stalls. A night to remember!")
                .date("2024-12-22")
                .time("06:00 PM")
                .location("Open Air Theatre")
                .organizer("Admin User")
                .organizerId("admin")
                .build(),
            Event.builder()
                .title("Machine Learning Workshop")
                .description("Hands-on workshop on ML fundamentals using Python and scikit-learn. Bring your laptops!")
                .date("2024-12-18")
                .time("10:00 AM")
                .location("Computer Lab 3, Block C")
                .organizer("Admin User")
                .organizerId("admin")
                .build(),
            Event.builder()
                .title("Basketball Inter-College Tournament")
                .description("Inter-college basketball championship. Support our team! Entry is free for all students.")
                .date("2024-12-14")
                .time("02:00 PM")
                .location("Sports Complex")
                .organizer("Admin User")
                .organizerId("admin")
                .build(),
            Event.builder()
                .title("Entrepreneurship Bootcamp")
                .description("2-day bootcamp on startup ideas, business models, and pitching to investors. Certificates provided.")
                .date("2024-12-27")
                .time("09:00 AM")
                .location("Innovation Hub, Block D")
                .organizer("Admin User")
                .organizerId("admin")
                .build()
        );
        eventRepository.saveAll(events);
        log.info("Seeded {} events", events.size());
    }

    private void seedExternalEvents() {
        List<ExternalEvent> externalEvents = List.of(
            ExternalEvent.builder()
                .title("Smart India Hackathon 2024")
                .eventType("Hackathon")
                .collegeName("NIT Trichy")
                .city("Tiruchirappalli")
                .state("Tamil Nadu")
                .startDate("2024-12-19")
                .endDate("2024-12-20")
                .sourceName("Knowafest")
                .sourceUrl("https://www.knowafest.com/explore/events/smart-india-hackathon-2024")
                .build(),
            ExternalEvent.builder()
                .title("TechXcelerate 2024 - National Level Technical Fest")
                .eventType("Technical Fest")
                .collegeName("IIT Bombay")
                .city("Mumbai")
                .state("Maharashtra")
                .startDate("2024-12-28")
                .endDate("2024-12-30")
                .sourceName("Knowafest")
                .sourceUrl("https://www.knowafest.com/explore/events")
                .build(),
            ExternalEvent.builder()
                .title("AI & ML Summit 2024")
                .eventType("Workshop")
                .collegeName("VIT University")
                .city("Vellore")
                .state("Tamil Nadu")
                .startDate("2025-01-05")
                .endDate("2025-01-06")
                .sourceName("Knowafest")
                .sourceUrl("https://www.knowafest.com/explore/events")
                .build(),
            ExternalEvent.builder()
                .title("CodeFest National Programming Contest")
                .eventType("Hackathon")
                .collegeName("BITS Pilani")
                .city("Pilani")
                .state("Rajasthan")
                .startDate("2025-01-10")
                .endDate("2025-01-11")
                .sourceName("Knowafest")
                .sourceUrl("https://www.knowafest.com/explore/events")
                .build(),
            ExternalEvent.builder()
                .title("Entrepreneurship Conclave 2025")
                .eventType("Seminar")
                .collegeName("IIM Ahmedabad")
                .city("Ahmedabad")
                .state("Gujarat")
                .startDate("2025-01-15")
                .endDate("2025-01-15")
                .sourceName("Knowafest")
                .sourceUrl("https://www.knowafest.com/explore/events")
                .build(),
            ExternalEvent.builder()
                .title("Robowars Championship 2025")
                .eventType("Competition")
                .collegeName("DTU Delhi")
                .city("New Delhi")
                .state("Delhi")
                .startDate("2025-01-20")
                .endDate("2025-01-21")
                .sourceName("Knowafest")
                .sourceUrl("https://www.knowafest.com/explore/events")
                .build()
        );
        externalEventRepository.saveAll(externalEvents);
        log.info("Seeded {} external events", externalEvents.size());
    }
}
