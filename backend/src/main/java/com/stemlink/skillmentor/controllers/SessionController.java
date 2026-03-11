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

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/enroll")
    public ResponseEntity<SessionResponseDTO> enroll(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody EnrollmentRequestDTO request) {
        String studentId = jwt.getSubject();
        return ResponseEntity.ok(sessionService.enroll(studentId, request));
    }

    @GetMapping("/my-sessions")
    public ResponseEntity<List<SessionResponseDTO>> getMySessions(@AuthenticationPrincipal Jwt jwt) {
        String studentId = jwt.getSubject();
        return ResponseEntity.ok(sessionService.getStudentSessions(studentId));
    }
}
