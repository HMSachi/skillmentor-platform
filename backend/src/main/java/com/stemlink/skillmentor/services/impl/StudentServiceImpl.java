package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.dto.StudentSyncRequest;
import com.stemlink.skillmentor.dto.StudentResponseDTO;
import com.stemlink.skillmentor.entities.Student;
import com.stemlink.skillmentor.repositories.SessionRepository;
import com.stemlink.skillmentor.repositories.StudentRepository;
import com.stemlink.skillmentor.services.StudentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final SessionRepository sessionRepository;

    @Override
    @Transactional
    public void syncStudent(String clerkUserId, StudentSyncRequest request) {
        log.info("Syncing student with clerkUserId: {} and request: {}", clerkUserId, request);
        try {
            // Find existing student or create new one
            Student student = studentRepository.findByClerkUserId(clerkUserId)
                    .orElse(new Student());
            
            student.setClerkUserId(clerkUserId);
            if (request.getName() != null) {
                student.setName(request.getName());
            }
            if (request.getEmail() != null) {
                student.setEmail(request.getEmail());
            }
            
            // Simple save. If a race condition happens, the transaction will roll back cleanly.
            // Hibernates handles the unique constraint violation at commit time.
            studentRepository.save(student);
            log.info("Successfully synced student: {}", clerkUserId);
            
        } catch (Exception e) {
            log.error("Failed to sync student {}: {}", clerkUserId, e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public List<StudentResponseDTO> getAllStudentsWithEnrollmentCount() {
        return studentRepository.findAll().stream().map(student -> {
            StudentResponseDTO dto = new StudentResponseDTO();
            dto.setId(student.getId());
            dto.setClerkUserId(student.getClerkUserId());
            dto.setName(student.getName());
            dto.setEmail(student.getEmail());
            // Count total sessions for this student
            int count = sessionRepository.findByStudentId(student.getClerkUserId()).size();
            dto.setEnrolledSessionsCount(count);
            return dto;
        }).collect(Collectors.toList());
    }
}
