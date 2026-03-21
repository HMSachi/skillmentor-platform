package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.entities.Review;
import com.stemlink.skillmentor.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController extends AbstractController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> leaveReview(
            java.security.Principal principal,
            @RequestBody Map<String, Object> payload) {
        String studentId = principal.getName();
        Long mentorId = Long.valueOf(payload.get("mentorId").toString());
        int rating = Integer.parseInt(payload.get("rating").toString());
        String comment = payload.get("comment").toString();
        
        return ResponseEntity.ok(reviewService.leaveReview(studentId, mentorId, rating, comment));
    }

    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<Review>> getMentorReviews(@PathVariable Long mentorId) {
        return ResponseEntity.ok(reviewService.getMentorReviews(mentorId));
    }
}
