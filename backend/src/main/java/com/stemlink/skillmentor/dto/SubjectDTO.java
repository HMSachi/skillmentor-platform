package com.stemlink.skillmentor.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectDTO {

    private Long id;

    @NotBlank(message = "Subject name cannot be empty")
    @Size(min = 2, max = 20, message = "Subject must be at least 2 characters long")
    private String subjectName;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    private String courseImageUrl;

}