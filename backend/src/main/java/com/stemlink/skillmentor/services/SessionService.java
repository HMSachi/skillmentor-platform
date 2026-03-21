package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.dto.EnrollmentRequestDTO;
import com.stemlink.skillmentor.dto.SessionResponseDTO;

import java.util.List;

public interface SessionService {
    SessionResponseDTO enroll(String studentId, EnrollmentRequestDTO request);
    List<SessionResponseDTO> getStudentSessions(String studentId);
    List<SessionResponseDTO> getAllSessions();
    SessionResponseDTO updatePaymentStatus(Long sessionId, String status);
    SessionResponseDTO updateSessionStatus(Long sessionId, String status);
    SessionResponseDTO updatePaymentProof(Long sessionId, String paymentProofUrl);
}
