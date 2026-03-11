package com.stemlink.skillmentor.bootstrap;

import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.entities.Subject;
import com.stemlink.skillmentor.repositories.MentorRepository;
import com.stemlink.skillmentor.repositories.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final MentorRepository mentorRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public void run(String... args) throws Exception {
        if (mentorRepository.count() == 0) {
            seedData();
        }
    }

    private void seedData() {
        // Mentor 1
        Mentor mentor1 = new Mentor();
        mentor1.setFirstName("John");
        mentor1.setLastName("Doe");
        mentor1.setMentorId("user_mentor_1");
        mentor1.setEmail("john.doe@example.com");
        mentor1.setTitle("Senior Cloud Architect");
        mentor1.setProfession("AWS Solutions Architect");
        mentor1.setCompany("Amazon Web Services");
        mentor1.setExperienceYears(10);
        mentor1.setBio("Experienced cloud architect with a focus on serverless architectures and microservices. I have helped hundreds of students pass their AWS certifications.");
        mentor1.setProfileImageUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop");
        mentor1.setPositiveReviews(98);
        mentor1.setTotalEnrollments(450);
        mentor1.setCertified(true);
        mentor1.setStartYear("2015");
        
        Mentor savedMentor1 = mentorRepository.save(mentor1);

        Subject sub1 = new Subject();
        sub1.setSubjectName("AWS Certified SAA");
        sub1.setDescription("Complete guide to AWS architecture and certification prep.");
        sub1.setCourseImageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop");
        sub1.setMentor(savedMentor1);
        subjectRepository.save(sub1);

        Subject sub2 = new Subject();
        sub2.setSubjectName("Serverless on AWS");
        sub2.setDescription("Build and deploy production-ready serverless applications.");
        sub2.setCourseImageUrl("https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=400&h=300&fit=crop");
        sub2.setMentor(savedMentor1);
        subjectRepository.save(sub2);

        // Mentor 2
        Mentor mentor2 = new Mentor();
        mentor2.setFirstName("Jane");
        mentor2.setLastName("Smith");
        mentor2.setMentorId("user_mentor_2");
        mentor2.setEmail("jane.smith@example.com");
        mentor2.setTitle("Lead Frontend Engineer");
        mentor2.setProfession("React Expert");
        mentor2.setCompany("Netflix");
        mentor2.setExperienceYears(8);
        mentor2.setBio("Passionate about building beautiful and performant user interfaces. I specialize in React, Next.js, and Tailwind CSS.");
        mentor2.setProfileImageUrl("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop");
        mentor2.setPositiveReviews(95);
        mentor2.setTotalEnrollments(320);
        mentor2.setCertified(true);
        mentor2.setStartYear("2017");

        Mentor savedMentor2 = mentorRepository.save(mentor2);

        Subject sub3 = new Subject();
        sub3.setSubjectName("Advanced React");
        sub3.setDescription("Master hooks, context API, and high-performance components.");
        sub3.setCourseImageUrl("https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop");
        sub3.setMentor(savedMentor2);
        subjectRepository.save(sub3);

        // Mentor 3
        Mentor mentor3 = new Mentor();
        mentor3.setFirstName("Michael");
        mentor3.setLastName("Chen");
        mentor3.setMentorId("user_mentor_3");
        mentor3.setEmail("michael.chen@example.com");
        mentor3.setTitle("Full Stack Developer");
        mentor3.setProfession("Java Specialist");
        mentor3.setCompany("Google");
        mentor3.setExperienceYears(6);
        mentor3.setBio("Expert in Spring Boot and Java development. I love teaching complex concepts in a simple way.");
        mentor3.setProfileImageUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop");
        mentor3.setPositiveReviews(99);
        mentor3.setTotalEnrollments(150);
        mentor3.setCertified(false);
        mentor3.setStartYear("2019");

        Mentor savedMentor3 = mentorRepository.save(mentor3);

        Subject sub4 = new Subject();
        sub4.setSubjectName("Spring Boot Micro");
        sub4.setDescription("Learn how to build and scale microservices with Spring Cloud.");
        sub4.setCourseImageUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop");
        sub4.setMentor(savedMentor3);
        subjectRepository.save(sub4);
    }
}
