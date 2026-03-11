package com.stemlink.skillmentor.controllers;

import com.stemlink.skillmentor.dto.SubjectDTO;
import com.stemlink.skillmentor.entities.Subject;
import com.stemlink.skillmentor.services.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final ModelMapper modelMapper;
    private final SubjectService subjectService;


    @GetMapping
    public List<Subject> getAllSubjects(@RequestParam(name = "name", defaultValue = "all") String name) {
        return subjectService.getAllSubjects();
    }


    @GetMapping("{id}")
    public Subject getSubjectById(
            @PathVariable Long id
    ){
        return subjectService.getSubjectById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Subject createSubjects(@Valid @RequestBody SubjectDTO subjectDTO) {
        Subject subject = modelMapper.map(subjectDTO, Subject.class);
        return subjectService.addNewSubject(subject);
    }



    @PutMapping
    public String updateSubjects() {
        System.out.println("PUT");
        return "update subjects";
    }

    @DeleteMapping(path = "{id}")
    public String deleteSubjects(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return "Subject deleted";
    }

}
