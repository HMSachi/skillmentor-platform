package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.EnrollmentRequestDTO;
import com.stemlink.skillmentor.dto.SessionResponseDTO;
import com.stemlink.skillmentor.services.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/enroll")
    public ResponseEntity<SessionResponseDTO> enroll(
            java.security.Principal principal,
            @Valid @RequestBody EnrollmentRequestDTO request) {
        String studentId = principal.getName();
        return ResponseEntity.ok(sessionService.enroll(studentId, request));
    }

    @GetMapping("/my-sessions")
    public ResponseEntity<List<SessionResponseDTO>> getMySessions(java.security.Principal principal) {
        String studentId = principal.getName();
        return ResponseEntity.ok(sessionService.getStudentSessions(studentId));
    }

    @PostMapping("/upload-payment/{id}")
    public ResponseEntity<SessionResponseDTO> uploadPaymentProof(
            @PathVariable Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        // In this implementation, we simulate save-file and return a mock URL.
        // A real app would use Cloudinary/S3.
        String proofUrl = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000";
        return ResponseEntity.ok(sessionService.updatePaymentProof(id, proofUrl));
    }
}
