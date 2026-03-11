package com.stemlink.skillmentor.configs;

import com.stemlink.skillmentor.security.ClerkValidator;
import com.stemlink.skillmentor.security.TokenValidator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityBeanConfig {

    @Value("${clerk.jwks.url}")
    private String clerkJwksUrl;

    @Bean
    public TokenValidator tokenValidator() {
        return new ClerkValidator(clerkJwksUrl);
    }
}
