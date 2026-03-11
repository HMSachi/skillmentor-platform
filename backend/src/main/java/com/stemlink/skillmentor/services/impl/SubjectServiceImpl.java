package com.stemlink.skillmentor.services.impl;

import com.stemlink.skillmentor.entities.Subject;
import com.stemlink.skillmentor.repositories.SubjectRepository;
import com.stemlink.skillmentor.services.SubjectService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final ModelMapper modelMapper;

    private final SubjectRepository subjectRepository;
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();  // SELECT * FROM Subject
    }

    public Subject addNewSubject(Subject subject) {
        return subjectRepository.save(subject); // INSERT and return saved entity
    }


    public Subject getSubjectById(Long id){
        return subjectRepository.findById(id).get();    //WHERE id=={}
    }

    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }

    public Subject updateSubjectById(Long id, Subject subject){
        Subject existingSubject = subjectRepository.findById(id).get();
        // Subject updatedSubject = modelMapper.map(subject, existingSubject);
        Subject updatedSubject = new Subject();
        existingSubject.setSubjectName(subject.getSubjectName());
        existingSubject.setDescription(subject.getDescription());

        return subjectRepository.save(existingSubject);
    }
    }


