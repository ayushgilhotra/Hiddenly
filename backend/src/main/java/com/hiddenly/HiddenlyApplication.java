package com.hiddenly;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * LEARNING NOTE:
 * This is the entry point of our Spring Boot application.
 * @SpringBootApplication is a convenience annotation that adds:
 * - @Configuration: Tags the class as a source of bean definitions.
 * - @EnableAutoConfiguration: Tells Spring Boot to start adding beans based on classpath settings.
 * - @ComponentScan: Tells Spring to look for other components, configurations, and services in this package.
 */
@SpringBootApplication
public class HiddenlyApplication {

    public static void main(String[] args) {
        SpringApplication.run(HiddenlyApplication.class, args);
    }
}
