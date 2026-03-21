package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.dto.EnrollmentRequestDTO;
import com.stemlink.skillmentor.dto.SessionResponseDTO;
import com.stemlink.skillmentor.entities.Session;
import com.stemlink.skillmentor.entities.Subject;
import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.repositories.SessionRepository;
import com.stemlink.skillmentor.repositories.SubjectRepository;
import com.stemlink.skillmentor.repositories.MentorRepository;
import com.stemlink.skillmentor.services.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;
    private final SubjectRepository subjectRepository;
    private final MentorRepository mentorRepository;

    @Override
    public SessionResponseDTO enroll(String studentId, EnrollmentRequestDTO request) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        LocalDateTime sessionAt = request.getSessionAt();
        if (sessionAt.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot book a session in the past");
        }

        Mentor mentor = subject.getMentor();
        int duration = request.getDurationMinutes() > 0 ? request.getDurationMinutes() : 60;
        LocalDateTime sessionEnd = sessionAt.plusMinutes(duration);

        // Simple overlap check: any existing session for this mentor that starts OR ends during this new session time
        List<Session> overlappingSessions = sessionRepository.findBySubjectMentorIdAndStatusNot(mentor.getId(), "CANCELLED");
        for (Session existing : overlappingSessions) {
            LocalDateTime start = existing.getSessionAt();
            LocalDateTime end = start.plusMinutes(existing.getDurationMinutes());
            
            if (sessionAt.isBefore(end) && sessionEnd.isAfter(start)) {
                throw new RuntimeException("Mentor is already booked for this time slot");
            }
        }

        Session session = new Session();
        session.setStudentId(studentId);
        session.setSubject(subject);
        session.setSessionAt(sessionAt);
        session.setDurationMinutes(duration);
        session.setStatus("PENDING");
        session.setPaymentStatus("PENDING");

        Session savedSession = sessionRepository.save(session);
        return mapToResponse(savedSession);
    }

    @Override
    public List<SessionResponseDTO> getStudentSessions(String studentId) {
        return sessionRepository.findByStudentId(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SessionResponseDTO> getAllSessions() {
        return sessionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SessionResponseDTO updatePaymentStatus(Long sessionId, String status) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setPaymentStatus(status);
        if ("PAID".equals(status)) {
            session.setStatus("CONFIRMED");
        }
        return mapToResponse(sessionRepository.save(session));
    }

    @Override
    public SessionResponseDTO updateSessionStatus(Long sessionId, String status) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        String oldStatus = session.getStatus();
        session.setStatus(status);
        
        if ("COMPLETED".equals(status) && !"COMPLETED".equals(oldStatus)) {
            Mentor mentor = session.getSubject().getMentor();
            mentor.setTotalEnrollments(mentor.getTotalEnrollments() + 1);
            mentorRepository.save(mentor);
        }
        
        return mapToResponse(sessionRepository.save(session));
    }

    @Override
    public SessionResponseDTO updatePaymentProof(Long sessionId, String paymentProofUrl) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setPaymentProofUrl(paymentProofUrl);
        session.setPaymentStatus("PENDING_APPROVAL");
        return mapToResponse(sessionRepository.save(session));
    }

    private SessionResponseDTO mapToResponse(Session session) {
        SessionResponseDTO dto = new SessionResponseDTO();
        dto.setId(session.getId());
        dto.setSubjectId(session.getSubject().getId());
        dto.setSubjectName(session.getSubject().getSubjectName());
        dto.setMentorName(session.getSubject().getMentor().getFirstName() + " " + session.getSubject().getMentor().getLastName());
        dto.setMentorProfileImageUrl(session.getSubject().getMentor().getProfileImageUrl());
        dto.setSessionAt(session.getSessionAt());
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setStatus(session.getStatus());
        dto.setPaymentStatus(session.getPaymentStatus());
        dto.setPaymentProofUrl(session.getPaymentProofUrl());
        return dto;
    }
}
