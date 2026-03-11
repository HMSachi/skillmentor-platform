package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.dto.EnrollmentRequestDTO;
import com.stemlink.skillmentor.dto.SessionResponseDTO;
import com.stemlink.skillmentor.entities.Session;
import com.stemlink.skillmentor.entities.Subject;
import com.stemlink.skillmentor.repositories.SessionRepository;
import com.stemlink.skillmentor.repositories.SubjectRepository;
import com.stemlink.skillmentor.services.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public SessionResponseDTO enroll(String studentId, EnrollmentRequestDTO request) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Session session = new Session();
        session.setStudentId(studentId);
        session.setSubject(subject);
        session.setSessionAt(request.getSessionAt());
        session.setPaymentStatus("pending");

        Session savedSession = sessionRepository.save(session);
        return mapToResponse(savedSession);
    }

    @Override
    public List<SessionResponseDTO> getStudentSessions(String studentId) {
        return sessionRepository.findByStudentId(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SessionResponseDTO mapToResponse(Session session) {
        SessionResponseDTO dto = new SessionResponseDTO();
        dto.setId(session.getId());
        dto.setSubjectId(session.getSubject().getId());
        dto.setSubjectName(session.getSubject().getSubjectName());
        dto.setMentorName(session.getSubject().getMentor().getFirstName() + " " + session.getSubject().getMentor().getLastName());
        dto.setMentorProfileImageUrl(session.getSubject().getMentor().getProfileImageUrl());
        dto.setSessionAt(session.getSessionAt());
        dto.setPaymentStatus(session.getPaymentStatus());
        return dto;
    }
}
