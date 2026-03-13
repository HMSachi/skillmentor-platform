package com.stemlink.skillmentor.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> root() {
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "SkillMentor API is running successfully!",
                "version", "1.0",
                "docs", "/swagger-ui/index.html"
        ));
    }
}
