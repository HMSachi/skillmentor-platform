package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.entities.Resource;
import com.stemlink.skillmentor.entities.Subject;
import com.stemlink.skillmentor.repositories.MentorRepository;
import com.stemlink.skillmentor.repositories.ResourceRepository;
import com.stemlink.skillmentor.repositories.SubjectRepository;
import com.stemlink.skillmentor.services.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final MentorRepository mentorRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public Resource addResource(String title, String type, Long mentorId, Long subjectId, MultipartFile file) {
        try {
            String fileName = "res_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("src/main/resources/static/uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path path = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            
            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(fileName)
                    .toUriString();

            Resource resource = new Resource();
            resource.setTitle(title);
            resource.setType(type);
            resource.setFileUrl(fileUrl);

            if (mentorId != null) {
                Mentor mentor = mentorRepository.findById(mentorId).orElse(null);
                resource.setMentor(mentor);
            }
            if (subjectId != null) {
                Subject subject = subjectRepository.findById(subjectId).orElse(null);
                resource.setSubject(subject);
            }

            return resourceRepository.save(resource);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store resource file", e);
        }
    }

    @Override
    public List<Resource> getResourcesBySubject(Long subjectId) {
        return resourceRepository.findBySubjectId(subjectId);
    }

    @Override
    public List<Resource> getResourcesByMentor(Long mentorId) {
        return resourceRepository.findByMentorId(mentorId);
    }

    @Override
    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}
