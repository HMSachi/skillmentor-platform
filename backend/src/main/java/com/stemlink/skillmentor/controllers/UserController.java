package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.StudentSyncRequest;
import com.stemlink.skillmentor.entities.Student;
import com.stemlink.skillmentor.services.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController extends AbstractController {

    private final StudentService studentService;

    @PostMapping("/sync")
    public ResponseEntity<Void> syncUser(Principal principal, @RequestBody StudentSyncRequest request) {
        if (principal != null && principal.getName() != null) {
            studentService.syncStudent(principal.getName(), request);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        try {
            return ResponseEntity.ok(studentService.getStudentByClerkId(principal.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Profile not found. Please sync your account.");
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<Student> updateProfile(
            Principal principal,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) org.springframework.web.multipart.MultipartFile image) {
        
        String profileImageUrl = null;
        if (image != null && !image.isEmpty()) {
            try {
                String fileName = "profile_" + principal.getName() + "_" + System.currentTimeMillis() + "_" + image.getOriginalFilename();
                java.nio.file.Path path = java.nio.file.Paths.get("src/main/resources/static/uploads/" + fileName);
                java.nio.file.Files.copy(image.getInputStream(), path, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                profileImageUrl = "http://localhost:8080/uploads/" + fileName;
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to store profile image", e);
            }
        }

        return ResponseEntity.ok(studentService.updateStudentProfile(principal.getName(), name, phone, bio, profileImageUrl));
    }
}
