package com.hiddenly.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * LEARNING NOTE:
 * This configures Swagger/OpenAPI documentation.
 * We include JWT security settings so you can test protected APIs directly from Swagger.
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI hiddenlyOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hiddenly API")
                        .description("API for discovering hidden cafes and spots")
                        .version("1.0"))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication", createAPIKeyScheme()));
    }

    private SecurityScheme createAPIKeyScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .scheme("bearer");
    }
}
