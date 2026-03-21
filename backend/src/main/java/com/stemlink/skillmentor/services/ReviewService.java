package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.entities.Review;
import java.util.List;

public interface ReviewService {
    Review leaveReview(String studentId, Long mentorId, int rating, String comment);
    List<Review> getMentorReviews(Long mentorId);
}
