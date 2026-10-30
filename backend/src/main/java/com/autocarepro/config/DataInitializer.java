package com.autocarepro.config;

import com.autocarepro.entity.*;
import com.autocarepro.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MechanicRepository mechanicRepository;
    private final VehicleRepository vehicleRepository;
    private final SparePartRepository sparePartRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           MechanicRepository mechanicRepository,
                           VehicleRepository vehicleRepository,
                           SparePartRepository sparePartRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.mechanicRepository = mechanicRepository;
        this.vehicleRepository = vehicleRepository;
        this.sparePartRepository = sparePartRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Ensure default users with guaranteed BCrypt encoded passwords
        createOrUpdateUser("admin@autocare.com", "admin123", "System Administrator", "+91 98765 43210", Role.ROLE_ADMIN, "Tech Park, HITEC City, Hyderabad");
        User ramesh = createOrUpdateUser("ramesh@autocare.com", "mechanic123", "Ramesh Kumar (Senior Tech)", "+91 98765 11111", Role.ROLE_MECHANIC, "Kukatpally, Hyderabad");
        User suresh = createOrUpdateUser("suresh@autocare.com", "mechanic123", "Suresh Reddy (Master Electrician)", "+91 98765 22222", Role.ROLE_MECHANIC, "Bachupally, Hyderabad");
        User sainath = createOrUpdateUser("sainath@example.com", "customer123", "Sainath Reddy", "+91 98765 33333", Role.ROLE_CUSTOMER, "Miyapur, Hyderabad");
        createOrUpdateUser("priya@example.com", "customer123", "Priya Sharma", "+91 98765 44444", Role.ROLE_CUSTOMER, "Gachibowli, Hyderabad");

        // Ensure mechanic profiles exist
        if (ramesh != null && mechanicRepository.findByUser(ramesh).isEmpty()) {
            Mechanic m1 = new Mechanic();
            m1.setUser(ramesh);
            m1.setSpecialization("Engine Overhaul & Transmission Specialist");
            m1.setExperienceYears(8);
            m1.setAvailabilityStatus("AVAILABLE");
            m1.setActiveJobsCount(1);
            m1.setRating(new BigDecimal("4.90"));
            mechanicRepository.save(m1);
        }

        if (suresh != null && mechanicRepository.findByUser(suresh).isEmpty()) {
            Mechanic m2 = new Mechanic();
            m2.setUser(suresh);
            m2.setSpecialization("Electrical Diagnostics & AC Systems");
            m2.setExperienceYears(6);
            m2.setAvailabilityStatus("AVAILABLE");
            m2.setActiveJobsCount(1);
            m2.setRating(new BigDecimal("4.85"));
            mechanicRepository.save(m2);
        }

        // Ensure spare parts exist
        if (sparePartRepository.count() == 0) {
            savePart("SP-OIL-5W30", "Synthec 5W-30 Full Synthetic Engine Oil (4L)", "Fluids & Lubricants", new BigDecimal("3200.00"), 45, 10);
            savePart("SP-FLT-OIL01", "High Flow Premium Oil Filter", "Filters", new BigDecimal("450.00"), 60, 15);
            savePart("SP-FLT-AIR02", "Active Carbon Air Cleaner Element", "Filters", new BigDecimal("650.00"), 35, 10);
            savePart("SP-FLT-AC03", "HEPA Cabin AC Filter", "Filters", new BigDecimal("850.00"), 28, 8);
            savePart("SP-BRK-PAD-F", "Ceramic Front Brake Pad Set", "Brakes", new BigDecimal("2400.00"), 20, 5);
            savePart("SP-BRK-DISC", "Ventilated Front Brake Disc Rotor (Pair)", "Brakes", new BigDecimal("4800.00"), 12, 4);
            savePart("SP-BAT-45AH", "Exide 12V 45Ah Maintenance-Free Battery", "Electrical", new BigDecimal("5500.00"), 15, 3);
            savePart("SP-WIP-SET", "Aerodynamic Silicone Wiper Blades (Set)", "Body Parts", new BigDecimal("950.00"), 40, 10);
            savePart("SP-SPK-IRID", "NGK Laser Iridium Spark Plug (Pack of 4)", "Ignition", new BigDecimal("2200.00"), 25, 6);
            savePart("SP-COOL-GLY", "Long-Life Glycol Coolant (2L Premix)", "Fluids & Lubricants", new BigDecimal("750.00"), 50, 12);
        }

        // Ensure default vehicle for customer sainath if none
        if (sainath != null && vehicleRepository.findByUserId(sainath.getId()).isEmpty()) {
            Vehicle v1 = new Vehicle();
            v1.setUser(sainath);
            v1.setRegistrationNumber("TS09EA1234");
            v1.setManufacturer("Hyundai");
            v1.setModel("Creta SX(O)");
            v1.setManufacturingYear(2022);
            v1.setFuelType("PETROL");
            v1.setCurrentMileage(34500);
            v1.setVehicleCategory("SUV");
            v1.setLastServiceDate(LocalDate.now().minusMonths(5));
            vehicleRepository.save(v1);

            Vehicle v2 = new Vehicle();
            v2.setUser(sainath);
            v2.setRegistrationNumber("TS08FB5678");
            v2.setManufacturer("Honda");
            v2.setModel("City ZX CVT");
            v2.setManufacturingYear(2021);
            v2.setFuelType("PETROL");
            v2.setCurrentMileage(48200);
            v2.setVehicleCategory("SEDAN");
            v2.setLastServiceDate(LocalDate.now().minusMonths(6));
            vehicleRepository.save(v2);
        }
    }

    private User createOrUpdateUser(String email, String rawPassword, String fullName, String phone, Role role, String address) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user;
        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setFullName(fullName);
            user.setPhone(phone);
            user.setRole(role);
            user.setAddress(address);
        } else {
            user = new User(fullName, email, passwordEncoder.encode(rawPassword), phone, role, address);
        }
        return userRepository.save(user);
    }

    private void savePart(String partNum, String name, String cat, BigDecimal price, int qty, int reorder) {
        SparePart part = new SparePart();
        part.setPartNumber(partNum);
        part.setPartName(name);
        part.setCategory(cat);
        part.setUnitPrice(price);
        part.setStockQuantity(qty);
        part.setReorderLevel(reorder);
        sparePartRepository.save(part);
    }
}
