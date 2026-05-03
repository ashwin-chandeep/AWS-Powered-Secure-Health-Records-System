package com.clinic.config;

import com.clinic.entity.*;
import com.clinic.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final DoctorRepository doctorRepo;
    private final MedicalServiceRepository svcRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository userRepo, DoctorRepository doctorRepo,
                      MedicalServiceRepository svcRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.doctorRepo = doctorRepo;
        this.svcRepo = svcRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) return; // Already seeded

        String hash = encoder.encode("Test@123");

        // ===== Patients =====
        User p1 = userRepo.save(User.builder().email("patient1.chennai@test.com").phone("9000000001").name("Chennai Patient 1").passwordHash(hash).role(UserRole.PATIENT).build());
        User p2 = userRepo.save(User.builder().email("patient2.chennai@test.com").phone("9000000002").name("Chennai Patient 2").passwordHash(hash).role(UserRole.PATIENT).build());
        userRepo.save(User.builder().email("patient1.madurai@test.com").phone("9000000011").name("Madurai Patient 1").passwordHash(hash).role(UserRole.PATIENT).build());
        userRepo.save(User.builder().email("patient2.madurai@test.com").phone("9000000012").name("Madurai Patient 2").passwordHash(hash).role(UserRole.PATIENT).build());

        // ===== Chennai Doctors =====
        User du1 = userRepo.save(User.builder().email("doctor.doc-chn-1@test.com").phone("8100000000").name("Dr. Arjun Menon").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(du1).name("Dr. Arjun Menon").specialization("General Physician").fee(400).hospitalName("City Care Hospital, Chennai").clinicAddress("T. Nagar, Chennai").lat(13.0418).lng(80.2341).rating(4.6).city("Chennai").timings("09:00 AM - 01:00 PM").build());

        User du2 = userRepo.save(User.builder().email("doctor.doc-chn-2@test.com").phone("8100000001").name("Dr. Priya Raman").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(du2).name("Dr. Priya Raman").specialization("Dermatologist").fee(650).hospitalName("Greenleaf Skin Clinic, Chennai").clinicAddress("Anna Nagar, Chennai").lat(13.0850).lng(80.2101).rating(4.7).city("Chennai").timings("05:00 PM - 09:00 PM").build());

        User du3 = userRepo.save(User.builder().email("doctor.doc-chn-3@test.com").phone("8100000002").name("Dr. Karthik Iyer").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(du3).name("Dr. Karthik Iyer").specialization("Dentist").fee(500).hospitalName("BrightSmile Dental Care, Chennai").clinicAddress("Velachery, Chennai").lat(12.9756).lng(80.2207).rating(4.5).city("Chennai").timings("10:00 AM - 02:00 PM").build());

        User du4 = userRepo.save(User.builder().email("doctor.doc-chn-4@test.com").phone("8100000003").name("Dr. Sneha Rao").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(du4).name("Dr. Sneha Rao").specialization("Pediatrician").fee(600).hospitalName("LittleHearts Children Hospital, Chennai").clinicAddress("Adyar, Chennai").lat(13.0012).lng(80.2565).rating(4.8).city("Chennai").timings("04:00 PM - 08:00 PM").build());

        User du5 = userRepo.save(User.builder().email("doctor.doc-chn-5@test.com").phone("8100000004").name("Dr. Vishal Gupta").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(du5).name("Dr. Vishal Gupta").specialization("Orthopedic").fee(800).hospitalName("OrthoPlus Clinic, Chennai").clinicAddress("Porur, Chennai").lat(13.0359).lng(80.1588).rating(4.4).city("Chennai").timings("11:00 AM - 03:00 PM").build());

        User du6 = userRepo.save(User.builder().email("doctor.doc-chn-6@test.com").phone("8100000005").name("Dr. Meera Nair").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(du6).name("Dr. Meera Nair").specialization("ENT").fee(550).hospitalName("ENT Care Centre, Chennai").clinicAddress("Mylapore, Chennai").lat(13.0337).lng(80.2680).rating(4.3).city("Chennai").timings("06:00 PM - 09:00 PM").build());

        User du7 = userRepo.save(User.builder().email("doctor.doc-chn-7@test.com").phone("8100000006").name("Dr. Raghav S").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(du7).name("Dr. Raghav S").specialization("Cardiologist").fee(900).hospitalName("HeartPoint Hospital, Chennai").clinicAddress("Nungambakkam, Chennai").lat(13.0569).lng(80.2425).rating(4.7).city("Chennai").timings("09:30 AM - 12:30 PM").build());

        User du8 = userRepo.save(User.builder().email("doctor.doc-chn-8@test.com").phone("8100000007").name("Dr. Lakshmi Devi").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(du8).name("Dr. Lakshmi Devi").specialization("Diabetologist").fee(700).hospitalName("SugarCare Clinic, Chennai").clinicAddress("Tambaram, Chennai").lat(12.9249).lng(80.1000).rating(4.5).city("Chennai").timings("02:00 PM - 06:00 PM").build());

        User du9 = userRepo.save(User.builder().email("doctor.doc-chn-9@test.com").phone("8100000008").name("Dr. Naveen Kumar").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(du9).name("Dr. Naveen Kumar").specialization("Physiotherapist").fee(450).hospitalName("MoveWell Physiotherapy, Chennai").clinicAddress("Guindy, Chennai").lat(13.0108).lng(80.2124).rating(4.2).city("Chennai").timings("07:00 AM - 11:00 AM").build());

        User du10 = userRepo.save(User.builder().email("doctor.doc-chn-10@test.com").phone("8100000009").name("Dr. Ananya Suresh").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(du10).name("Dr. Ananya Suresh").specialization("Gynecologist").fee(850).hospitalName("WomenFirst Clinic, Chennai").clinicAddress("OMR, Chennai").lat(12.9120).lng(80.2280).rating(4.6).city("Chennai").timings("05:30 PM - 09:30 PM").build());

        // ===== Madurai Doctors =====
        User mu1 = userRepo.save(User.builder().email("doctor.doc-mdu-1@test.com").phone("8100000010").name("Dr. Saravanan P").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(mu1).name("Dr. Saravanan P").specialization("General Physician").fee(350).hospitalName("Meenakshi Care Hospital, Madurai").clinicAddress("K.K. Nagar, Madurai").lat(9.9345).lng(78.1210).rating(4.5).city("Madurai").timings("09:00 AM - 01:00 PM").build());

        User mu2 = userRepo.save(User.builder().email("doctor.doc-mdu-2@test.com").phone("8100000011").name("Dr. Madhumitha R").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(mu2).name("Dr. Madhumitha R").specialization("Dermatologist").fee(600).hospitalName("SkinGlow Clinic, Madurai").clinicAddress("Anna Nagar, Madurai").lat(9.9533).lng(78.1152).rating(4.6).city("Madurai").timings("04:00 PM - 08:00 PM").build());

        User mu3 = userRepo.save(User.builder().email("doctor.doc-mdu-3@test.com").phone("8100000012").name("Dr. Balamurugan K").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(mu3).name("Dr. Balamurugan K").specialization("Dentist").fee(450).hospitalName("SmileLine Dental, Madurai").clinicAddress("S.S. Colony, Madurai").lat(9.9194).lng(78.1054).rating(4.4).city("Madurai").timings("10:00 AM - 02:00 PM").build());

        User mu4 = userRepo.save(User.builder().email("doctor.doc-mdu-4@test.com").phone("8100000013").name("Dr. Deepa S").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(mu4).name("Dr. Deepa S").specialization("Pediatrician").fee(550).hospitalName("KidsCare Hospital, Madurai").clinicAddress("Bypass Road, Madurai").lat(9.9261).lng(78.1400).rating(4.7).city("Madurai").timings("05:00 PM - 09:00 PM").build());

        User mu5 = userRepo.save(User.builder().email("doctor.doc-mdu-5@test.com").phone("8100000014").name("Dr. Kannan V").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(mu5).name("Dr. Kannan V").specialization("Orthopedic").fee(750).hospitalName("OrthoCare Hospital, Madurai").clinicAddress("Tallakulam, Madurai").lat(9.9476).lng(78.1340).rating(4.3).city("Madurai").timings("11:00 AM - 03:00 PM").build());

        User mu6 = userRepo.save(User.builder().email("doctor.doc-mdu-6@test.com").phone("8100000015").name("Dr. Janaki M").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(mu6).name("Dr. Janaki M").specialization("ENT").fee(500).hospitalName("ENT & Hearing Clinic, Madurai").clinicAddress("Goripalayam, Madurai").lat(9.9420).lng(78.1311).rating(4.2).city("Madurai").timings("06:00 PM - 09:00 PM").build());

        User mu7 = userRepo.save(User.builder().email("doctor.doc-mdu-7@test.com").phone("8100000016").name("Dr. Prakash N").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(mu7).name("Dr. Prakash N").specialization("Cardiologist").fee(850).hospitalName("CardioPlus Hospital, Madurai").clinicAddress("Mattuthavani, Madurai").lat(9.9300).lng(78.1540).rating(4.6).city("Madurai").timings("09:30 AM - 12:30 PM").build());

        User mu8 = userRepo.save(User.builder().email("doctor.doc-mdu-8@test.com").phone("8100000017").name("Dr. Uma S").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(mu8).name("Dr. Uma S").specialization("Diabetologist").fee(650).hospitalName("Diabetes & Wellness Centre, Madurai").clinicAddress("Palanganatham, Madurai").lat(9.9056).lng(78.1228).rating(4.5).city("Madurai").timings("02:00 PM - 06:00 PM").build());

        User mu9 = userRepo.save(User.builder().email("doctor.doc-mdu-9@test.com").phone("8100000018").name("Dr. Hariharan G").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(mu9).name("Dr. Hariharan G").specialization("Physiotherapist").fee(400).hospitalName("MoveFree Physiotherapy, Madurai").clinicAddress("Tirunagar, Madurai").lat(9.8312).lng(78.0723).rating(4.1).city("Madurai").timings("07:00 AM - 11:00 AM").build());

        User mu10 = userRepo.save(User.builder().email("doctor.doc-mdu-10@test.com").phone("8100000019").name("Dr. Nithya A").passwordHash(hash).role(UserRole.DOCTOR).build());
        doctorRepo.save(Doctor.builder().user(mu10).name("Dr. Nithya A").specialization("Gynecologist").fee(800).hospitalName("WomenCare Clinic, Madurai").clinicAddress("Avaniyapuram, Madurai").lat(9.8812).lng(78.0895).rating(4.4).city("Madurai").timings("05:30 PM - 09:30 PM").build());

        // ===== Medical Services =====
        String[] serviceNames = {"General Consultation", "Dental Checkup", "Dermatology Consultation",
                "Pediatric Consultation", "ENT Consultation", "Orthopedic Consultation",
                "Cardiology Consultation", "Diabetes Follow-up", "Physiotherapy Session", "Vaccination"};

        for (String city : new String[]{"Chennai", "Madurai"}) {
            for (String name : serviceNames) {
                svcRepo.save(MedicalService.builder().name(name).city(city).build());
            }
        }

        System.out.println("✅ Database seeded with 4 patients, 20 doctors, and 20 medical services.");
    }
}
