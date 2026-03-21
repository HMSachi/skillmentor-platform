package com.stemlink.skillmentor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionResponseDTO {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String mentorName;
    private String mentorProfileImageUrl;
    private LocalDateTime sessionAt;
    private int durationMinutes;
    private String status;
    private String paymentStatus;
    private String paymentProofUrl;
}
