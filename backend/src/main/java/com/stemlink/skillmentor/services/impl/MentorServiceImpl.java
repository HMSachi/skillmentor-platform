package com.stemlink.skillmentor.services.impl;


import com.stemlink.skillmentor.entities.Mentor;
import com.stemlink.skillmentor.exceptions.SkillMentorException;
import com.stemlink.skillmentor.repositories.MentorRepository;
import com.stemlink.skillmentor.services.MentorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
public class MentorServiceImpl implements MentorService {

    private final MentorRepository mentorRepository;
    private final ModelMapper modelMapper;



    public Mentor createNewMentor(Mentor mentor){
        try {
            return mentorRepository.save(mentor);

        }catch (Exception exception){
            System.err.printf("Error getting Mentor " +exception.getMessage());
            throw  new SkillMentorException("Fail to get new mentor", HttpStatus.CONFLICT);
        }}



    public Page<Mentor> getAllMentors(Pageable pageable) {
        try {
            log.debug("getting mentors");
            return mentorRepository.findAll(pageable); // SELECT * FROM mentor
        } catch (Exception exception){
            log.error("Fail to get all Mentors", exception);
            throw new SkillMentorException("Fail to get All Mentors", HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }
    public Mentor getMentorById(Long id){
        try {
            Mentor mentor =  mentorRepository.findById(id).orElseThrow(
                    () -> new SkillMentorException("Mentor not Found", HttpStatus.NOT_FOUND)
            );
            log.info("Successfully  fetch Mentor {}", id);
            return mentor;

        }catch(SkillMentorException skillMentorException){
//            System.err.printf("Mentor Not Found " +skillMentorException.getMessage());
            // LOG LEVELS
            // DEBUG, INFO, WARN, ERROR
            log.warn("Mentor not Found id {} to fetch", id, skillMentorException);
            throw  new SkillMentorException("Mentor Not Found ", HttpStatus.NOT_FOUND);

        }catch (Exception exception){
            // System.err.printf("Error getting Mentor " +exception.getMessage());
            log.error("Error getting Mentor ", exception);
            throw  new SkillMentorException("Fail to get new mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }}




    public Mentor updateMentorById(Long id, Mentor updatedMentor){
        try{
            Mentor mentor =  mentorRepository.findById(id).orElseThrow(
                    () -> new SkillMentorException("Mentor not Found", HttpStatus.NOT_FOUND)
            );
            
            if (updatedMentor.getFirstName() != null) mentor.setFirstName(updatedMentor.getFirstName());
            if (updatedMentor.getLastName() != null) mentor.setLastName(updatedMentor.getLastName());
            if (updatedMentor.getProfession() != null) mentor.setProfession(updatedMentor.getProfession());
            if (updatedMentor.getCompany() != null) mentor.setCompany(updatedMentor.getCompany());
            if (updatedMentor.getBio() != null) mentor.setBio(updatedMentor.getBio());
            if (updatedMentor.getPhoneNumber() != null) mentor.setPhoneNumber(updatedMentor.getPhoneNumber());
            if (updatedMentor.getTitle() != null) mentor.setTitle(updatedMentor.getTitle());
            if (updatedMentor.getProfileImageUrl() != null) mentor.setProfileImageUrl(updatedMentor.getProfileImageUrl());
            
            return mentorRepository.save(mentor);

        } catch(SkillMentorException skillMentorException){
            log.warn("Mentor not Found with id {} to update", id, skillMentorException);
            throw  new SkillMentorException("Mentor Not Found", HttpStatus.NOT_FOUND);

        }catch (Exception exception){
            log.error("Error update  Mentor ", exception);
            throw  new SkillMentorException("Fail to update new mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }}



    public void deleteMentor(Long id){
        try {
            mentorRepository.deleteById(id);
        }catch (Exception exception){
            log.error("Fail to delete Mentor with id {} ", id, exception);
            throw new SkillMentorException("Fail to Delete Mentor", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
