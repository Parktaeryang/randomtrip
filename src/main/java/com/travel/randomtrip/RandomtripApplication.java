package com.travel.randomtrip;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Objects;

@SpringBootApplication
public class RandomtripApplication {

    static {
        Dotenv dotenv = Dotenv.load();
        System.setProperty("TOURISM_SERVICE_KEY", Objects.requireNonNull(dotenv.get("TOURISM_SERVICE_KEY")));
        System.setProperty("KAKAO_REST_KEY", Objects.requireNonNull(dotenv.get("KAKAO_REST_KEY")));
    }

    public static void main(String[] args) {
        SpringApplication.run(RandomtripApplication.class, args);
    }

}
