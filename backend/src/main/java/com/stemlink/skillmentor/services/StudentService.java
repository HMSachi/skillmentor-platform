package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.dto.StudentSyncRequest;
import com.stemlink.skillmentor.dto.StudentResponseDTO;

import java.util.List;

public interface StudentService {
    void syncStudent(String clerkUserId, StudentSyncRequest request);
    List<StudentResponseDTO> getAllStudentsWithEnrollmentCount();
}
