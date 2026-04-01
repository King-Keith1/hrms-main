package com.company.hrms.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // Spring configuration class
@SecurityScheme(
        name = "bearerAuth", // JWT authentication scheme name
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT" // Specifies JWT token format
)
public class OpenApiConfig { // Configures Swagger/OpenAPI security

    @Bean // Registers OpenAPI configuration as a Spring bean
    public OpenAPI openAPI() { // Adds global security requirement to API docs
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement()
                        .addList("bearerAuth")); // Requires bearerAuth for endpoints
    }
}