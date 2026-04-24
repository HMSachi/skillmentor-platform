package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.EnrollmentRequestDTO;
import com.stemlink.skillmentor.dto.SessionResponseDTO;
import com.stemlink.skillmentor.entities.Resource;
import com.stemlink.skillmentor.services.ResourceService;
import com.stemlink.skillmentor.services.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;
    private final ResourceService resourceService;

    @GetMapping("/subject/{subjectId}/resources")
    public ResponseEntity<List<Resource>> getSubjectResources(@PathVariable Long subjectId) {
        return ResponseEntity.ok(resourceService.getResourcesBySubject(subjectId));
    }

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
        try {
            String fileName = id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            java.nio.file.Path uploadPath = java.nio.file.Paths.get("src/main/resources/static/uploads");
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }
            java.nio.file.Path path = uploadPath.resolve(fileName);
            java.nio.file.Files.copy(file.getInputStream(), path, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            
            String proofUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(fileName)
                    .toUriString();
            return ResponseEntity.ok(sessionService.updatePaymentProof(id, proofUrl));
        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
