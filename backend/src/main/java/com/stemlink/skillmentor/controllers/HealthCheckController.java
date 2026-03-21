package com.stemlink.skillmentor.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthCheckController {
    
    @GetMapping("/api/public/ping")
    public Map<String, String> ping() {
        return Map.of(
            "status", "UP",
            "message", "SkillMentor API is running",
            "timestamp", String.valueOf(System.currentTimeMillis())
        );
    }

    @GetMapping("/api/health")
    public Map<String, Object> health() {
        return Map.of(
            "status", "UP",
            "database", "CONNECTED",
            "version", "0.0.1-SNAPSHOT"
        );
    }
}
