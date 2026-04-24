package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.SessionResponseDTO;
import com.stemlink.skillmentor.dto.StudentResponseDTO;
import com.stemlink.skillmentor.services.SessionService;
import com.stemlink.skillmentor.services.StudentService;
import com.stemlink.skillmentor.services.MentorService;
import com.stemlink.skillmentor.services.ResourceService;
import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.entities.Resource;
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
    private final StudentService studentService;
    private final MentorService mentorService;
    private final ResourceService resourceService;

    @GetMapping("/students")
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudentsWithEnrollmentCount());
    }

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

    // Mentor Management
    @GetMapping("/mentors/{id}")
    public ResponseEntity<Mentor> getMentor(@PathVariable Long id) {
        return ResponseEntity.ok(mentorService.getMentorById(id));
    }

    @PutMapping("/mentors/{id}")
    public ResponseEntity<Mentor> updateMentor(@PathVariable Long id, @RequestBody Mentor mentor) {
        return ResponseEntity.ok(mentorService.updateMentorById(id, mentor));
    }

    // Resource Management
    @PostMapping("/resources")
    public ResponseEntity<Resource> addResource(
            @RequestParam String title,
            @RequestParam String type,
            @RequestParam(required = false) Long mentorId,
            @RequestParam(required = false) Long subjectId,
            @RequestParam org.springframework.web.multipart.MultipartFile file) {
        return ResponseEntity.ok(resourceService.addResource(title, type, mentorId, subjectId, file));
    }

    @GetMapping("/mentors/{id}/resources")
    public ResponseEntity<List<Resource>> getMentorResources(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourcesByMentor(id));
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok().build();
    }
}
