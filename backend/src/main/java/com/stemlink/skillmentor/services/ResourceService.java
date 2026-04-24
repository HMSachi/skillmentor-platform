package com.stemlink.skillmentor.services;

import com.stemlink.skillmentor.entities.Resource;
import java.util.List;

public interface ResourceService {
    Resource addResource(String title, String type, Long mentorId, Long subjectId, org.springframework.web.multipart.MultipartFile file);
    List<Resource> getResourcesBySubject(Long subjectId);
    List<Resource> getResourcesByMentor(Long mentorId);
    void deleteResource(Long id);
}
