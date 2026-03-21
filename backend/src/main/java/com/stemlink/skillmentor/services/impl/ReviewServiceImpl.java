package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.entities.Review;
import com.stemlink.skillmentor.repositories.MentorRepository;
import com.stemlink.skillmentor.repositories.ReviewRepository;
import com.stemlink.skillmentor.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final MentorRepository mentorRepository;

    @Override
    public Review leaveReview(String studentId, Long mentorId, int rating, String comment) {
        Mentor mentor = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        Review review = new Review();
        review.setStudentId(studentId);
        review.setMentor(mentor);
        review.setRating(rating);
        review.setComment(comment);

        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getMentorReviews(Long mentorId) {
        return reviewRepository.findByMentorId(mentorId);
    }
}
