package com.hiddenly;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// This class is the main entry point of our Spring Boot application.
// The @SpringBootApplication annotation does three things:
// 1. It enables auto-configuration (Spring tries to guess what you need based on your pom.xml).
// 2. It enables component scanning (Spring looks for your controllers, services, etc. in this package).
// 3. It marks this class as a configuration class.
@SpringBootApplication
public class HiddenlyApplication {

    // This is the standard main method that Java uses to start any program.
    // When you run this, Spring Boot will start up and launch the web server.
    public static void main(String[] args) {
        // This line actually starts the whole Spring application container.
        SpringApplication.run(HiddenlyApplication.class, args);
        // We print a message so we know the app has started successfully in the terminal.
        System.out.println("Hiddenly Application is running on http://localhost:8080");
    }
}
