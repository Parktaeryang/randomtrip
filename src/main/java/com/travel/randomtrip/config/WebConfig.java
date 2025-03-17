package com.travel.randomtrip.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 모든 경로에 대해
        registry.addMapping("/**")
                // 허용할 출처(Origin). React dev 서버 http://localhost:3000
                .allowedOrigins("http://localhost:3000")
                // 허용할 메서드(GET,POST,PUT,PATCH,DELETE,OPTIONS 등)
                .allowedMethods("*")
                // 허용할 헤더
                .allowedHeaders("*")
                // 자격 증명(쿠키 등) 사용 여부
                .allowCredentials(true);
    }
}
