package com.diabetescdss;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DiabetesCdssApplication {

    public static void main(String[] args) {
        SpringApplication.run(DiabetesCdssApplication.class, args);
    }
}