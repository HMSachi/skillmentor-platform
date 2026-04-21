package com.stemlink.skillmentor.dto;

import lombok.Data;

@Data
public class StudentResponseDTO {
    private Long id;
    private String clerkUserId;
    private String name;
    private String email;
    private int enrolledSessionsCount;
}
