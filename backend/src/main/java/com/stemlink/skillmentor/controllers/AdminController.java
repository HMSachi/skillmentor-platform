package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.SessionResponseDTO;
import com.stemlink.skillmentor.services.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController extends AbstractController {

    private final SessionService sessionService;

    @GetMapping("/bookings")
    public ResponseEntity<List<SessionResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @PutMapping("/bookings/{id}/approve-payment")
    public ResponseEntity<SessionResponseDTO> approvePayment(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.updatePaymentStatus(id, "PAID"));
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<SessionResponseDTO> updateSessionStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        return ResponseEntity.ok(sessionService.updateSessionStatus(id, status));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        List<SessionResponseDTO> allSessions = sessionService.getAllSessions();
        Map<String, Object> analytics = new HashMap<>();
        
        long totalBookings = allSessions.size();
        long completedSessions = allSessions.stream().filter(s -> "COMPLETED".equals(s.getStatus())).count();
        long pendingPayments = allSessions.stream().filter(s -> "PENDING".equals(s.getPaymentStatus())).count();
        
        analytics.put("totalBookings", totalBookings);
        analytics.put("completedSessions", completedSessions);
        analytics.put("pendingPayments", pendingPayments);
        
        // Enrollment counts per subject
        Map<String, Long> subjectEnrollments = new HashMap<>();
        for (SessionResponseDTO s : allSessions) {
            subjectEnrollments.put(s.getSubjectName(), subjectEnrollments.getOrDefault(s.getSubjectName(), 0L) + 1);
        }
        analytics.put("subjectEnrollments", subjectEnrollments);
        
        return ResponseEntity.ok(analytics);
    }
}
