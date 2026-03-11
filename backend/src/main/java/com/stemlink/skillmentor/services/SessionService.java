package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.dto.EnrollmentRequestDTO;
import com.stemlink.skillmentor.dto.SessionResponseDTO;

import java.util.List;

public interface SessionService {
    SessionResponseDTO enroll(String studentId, EnrollmentRequestDTO request);
    List<SessionResponseDTO> getStudentSessions(String studentId);
}
