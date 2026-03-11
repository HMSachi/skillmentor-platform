package com.stemlink.skillmentor.bootstrap;

import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.entities.Session;
import com.stemlink.skillmentor.entities.Subject;
import com.stemlink.skillmentor.repositories.MentorRepository;
import com.stemlink.skillmentor.repositories.SessionRepository;
import com.stemlink.skillmentor.repositories.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final MentorRepository mentorRepository;
    private final SubjectRepository subjectRepository;
    private final SessionRepository sessionRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking database for mentors...");
        if (mentorRepository.count() < 3) {
            log.info("Database is empty or incomplete. Starting data seeding...");
            sessionRepository.deleteAll();
            subjectRepository.deleteAll();
            mentorRepository.deleteAll();
            seedData();
            log.info("Data seeding completed successfully!");
        } else {
            log.info("Database already contains {} mentors. Skipping seeding.", mentorRepository.count());
        }
    }

    private void seedData() {
        // Mentor 1: Michelle Burns
        Mentor mentor1 = new Mentor();
        mentor1.setFirstName("Michelle");
        mentor1.setLastName("Burns");
        mentor1.setMentorId("user_michelle_burns");
        mentor1.setEmail("michelle.burns@example.com");
        mentor1.setTitle("Principal Cloud Architect");
        mentor1.setProfession("AWS Certified Architect");
        mentor1.setCompany("Amazon Web Services");
        mentor1.setExperienceYears(12);
        mentor1.setBio("Helping students master AWS and cloud migrations since 2012. Specializing in Developer Associate and Solutions Architect levels.");
        mentor1.setProfileImageUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop");
        mentor1.setPositiveReviews(99);
        mentor1.setTotalEnrollments(1250);
        mentor1.setCertified(true);
        mentor1.setStartYear("2012");
        
        Mentor savedMentor1 = mentorRepository.save(mentor1);

        Subject sub1 = new Subject();
        sub1.setSubjectName("AWS Dev Associate");
        sub1.setDescription("Master the AWS Certified Developer Associate exam with deep dives into Lambda and DynamoDB.");
        sub1.setCourseImageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop");
        sub1.setMentor(savedMentor1);
        subjectRepository.save(sub1);

        // Mentor 2: Dr. Priya Sharma
        Mentor mentor2 = new Mentor();
        mentor2.setFirstName("Priya");
        mentor2.setLastName("Sharma");
        mentor2.setMentorId("user_priya_sharma");
        mentor2.setEmail("priya.sharma@example.com");
        mentor2.setTitle("AI & Machine Learning Lead");
        mentor2.setProfession("Data Scientist");
        mentor2.setCompany("Google");
        mentor2.setExperienceYears(15);
        mentor2.setBio("Expert in Deep Learning and Neural Networks. I guide professionals looking to transition into AI and ML roles.");
        mentor2.setProfileImageUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop");
        mentor2.setPositiveReviews(98);
        mentor2.setTotalEnrollments(850);
        mentor2.setCertified(true);
        mentor2.setStartYear("2010");

        Mentor savedMentor2 = mentorRepository.save(mentor2);

        Subject sub2 = new Subject();
        sub2.setSubjectName("AWS Machine Learning");
        sub2.setDescription("Prepare for the ML Specialty certification with real-world SageMaker projects.");
        sub2.setCourseImageUrl("https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=400&h=300&fit=crop");
        sub2.setMentor(savedMentor2);
        subjectRepository.save(sub2);

        // Mentor 3: Scarlet Nexus
        Mentor mentor3 = new Mentor();
        mentor3.setFirstName("Scarlet");
        mentor3.setLastName("Nexus");
        mentor3.setMentorId("user_scarlet_nexus");
        mentor3.setEmail("scarlet.nexus@example.com");
        mentor3.setTitle("Cybersecurity Expert");
        mentor3.setProfession("Security Architect");
        mentor3.setCompany("Discord");
        mentor3.setExperienceYears(7);
        mentor3.setBio("Specialist in cloud security and incident response. Learn how to protect your infrastructure from modern threats.");
        mentor3.setProfileImageUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop");
        mentor3.setPositiveReviews(97);
        mentor3.setTotalEnrollments(420);
        mentor3.setCertified(true);
        mentor3.setStartYear("2018");

        Mentor savedMentor3 = mentorRepository.save(mentor3);

        Subject sub3 = new Subject();
        sub3.setSubjectName("Cybersecurity Architect");
        sub3.setDescription("Advanced Microsoft Cybersecurity Architect Expert Certification prep.");
        sub3.setCourseImageUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop");
        sub3.setMentor(savedMentor3);
        subjectRepository.save(sub3);

        // Fetch subjects back to ensure list is populated for session seeding
        seedSampleSessions(savedMentor1, savedMentor2, savedMentor3, sub1, sub2, sub3);
    }

    private void seedSampleSessions(Mentor m1, Mentor m2, Mentor m3, Subject s1, Subject s2, Subject s3) {
        String testStudentId = "user_2u4L4Q3K9B7V6X5Y8Z1A2C3D4E5";

        // Session 1: Michelle Burns
        Session sess1 = new Session();
        sess1.setStudentId(testStudentId);
        sess1.setSubject(s1);
        sess1.setSessionAt(java.time.LocalDateTime.now().plusDays(2));
        sess1.setPaymentStatus("accepted");
        sessionRepository.save(sess1);

        // Session 2: Priya Sharma
        Session sess2 = new Session();
        sess2.setStudentId(testStudentId);
        sess2.setSubject(s2);
        sess2.setSessionAt(java.time.LocalDateTime.now().plusDays(5));
        sess2.setPaymentStatus("pending");
        sessionRepository.save(sess2);

        // Session 3: Scarlet Nexus
        Session sess3 = new Session();
        sess3.setStudentId(testStudentId);
        sess3.setSubject(s3);
        sess3.setSessionAt(java.time.LocalDateTime.now().minusDays(1));
        sess3.setPaymentStatus("completed");
        sessionRepository.save(sess3);
    }
}
