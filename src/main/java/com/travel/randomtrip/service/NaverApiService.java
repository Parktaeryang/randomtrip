package com.travel.randomtrip.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NaverApiService {

    @Value("${naver.api.client.id}")
    private String clientId;

    @Value("${naver.api.client.secret}")
    private String clientSecret;

    private final RestTemplate restTemplate;

    public NaverApiService() {
        this.restTemplate = new RestTemplate();
    }

    // 네이버 길찾기 API 호출
    public String getRoute(String start, String goal) {
        String url = "https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving"
                + "?start=" + start
                + "&goal=" + goal
                + "&option=trafast"; // 실시간 빠른 길

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-NCP-APIGW-API-KEY-ID", clientId);
        headers.set("X-NCP-APIGW-API-KEY", clientSecret);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody(); // JSON 응답 반환
        } else {
            return "네이버 API 호출 실패: " + response.getStatusCode();
        }
    }
}
