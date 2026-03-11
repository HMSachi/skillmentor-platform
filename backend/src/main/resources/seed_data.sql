-- Seed Mentors
INSERT INTO mentors (id, mentor_id, first_name, last_name, email, title, profession, company, experience_years, bio, profile_image_url, positive_reviews, total_enrollments, is_certified, start_year)
VALUES 
(1, 'user_mentor_1', 'John', 'Doe', 'john.doe@example.com', 'Senior Cloud Architect', 'AWS Solutions Architect', 'Amazon Web Services', 10, 'Experienced cloud architect with a focus on serverless architectures and microservices. I have helped hundreds of students pass their AWS certifications.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 98, 450, true, '2015'),
(2, 'user_mentor_2', 'Jane', 'Smith', 'jane.smith@example.com', 'Lead Frontend Engineer', 'React Expert', 'Netflix', 8, 'Passionate about building beautiful and performant user interfaces. I specialize in React, Next.js, and Tailwind CSS. Let me help you master modern frontend development.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 95, 320, true, '2017'),
(3, 'user_mentor_3', 'Michael', 'Chen', 'michael.chen@example.com', 'Full Stack Developer', 'Java Specialist', 'Google', 6, 'Expert in Spring Boot and Java development. I love teaching complex concepts in a simple way. Join my sessions to build robust backend systems.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 99, 150, false, '2019')
ON CONFLICT (id) DO NOTHING;

-- Seed Subjects
INSERT INTO subjects (id, subject_name, description, course_image_url, mentor_id)
VALUES 
(1, 'AWS Certified Solutions Architect', 'Complete guide to AWS architecture and certification prep.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', 1),
(2, 'Serverless on AWS', 'Build and deploy production-ready serverless applications.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=400&h=300&fit=crop', 1),
(3, 'Advanced React Patterns', 'Master hooks, context API, and high-performance React components.', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop', 2),
(4, 'Mastering Next.js 14', 'Build full-stack applications with the latest Next.js features.', 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=300&fit=crop', 2),
(5, 'Spring Boot Microservices', 'Learn how to build and scale microservices with Spring Cloud.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', 3)
ON CONFLICT (id) DO NOTHING;
