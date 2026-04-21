package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.StudentSyncRequest;
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
}
