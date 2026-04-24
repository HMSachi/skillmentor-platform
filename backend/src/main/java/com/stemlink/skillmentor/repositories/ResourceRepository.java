package com.stemlink.skillmentor.repositories;

import com.stemlink.skillmentor.entities.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findBySubjectId(Long subjectId);
    List<Resource> findByMentorId(Long mentorId);
}
