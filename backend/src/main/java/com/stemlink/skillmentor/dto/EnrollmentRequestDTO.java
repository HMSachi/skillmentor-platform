package com.stemlink.skillmentor.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EnrollmentRequestDTO {
    @NotNull(message = "Subject ID is required")
    private Long subjectId;
    
    @NotNull(message = "Session time is required")
    private LocalDateTime sessionAt;

    private int durationMinutes = 60;
}
