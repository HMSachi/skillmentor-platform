package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.dto.StudentSyncRequest;
import com.stemlink.skillmentor.dto.StudentResponseDTO;
import com.stemlink.skillmentor.entities.Student;

import java.util.List;

public interface StudentService {
    void syncStudent(String clerkUserId, StudentSyncRequest request);
    List<StudentResponseDTO> getAllStudentsWithEnrollmentCount();
    Student getStudentByClerkId(String clerkUserId);
    Student updateStudentProfile(String clerkUserId, String name, String phone, String bio, String profileImageUrl);
}
