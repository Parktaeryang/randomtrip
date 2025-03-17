package com.travel.randomtrip.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/kakao")
public class KakaoLocalSearchController {

    @Value("${kakao.rest.key}")
    private String kakaoRestKey;

    private final RestTemplate restTemplate;

    public KakaoLocalSearchController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * 🚩 GET /api/kakao/search?query=장소명
     * 프론트엔드에서 넘어온 쿼리를 반드시 100자로 제한하여 Kakao API에 전달
     */
    @GetMapping("/search")
    public ResponseEntity<String> searchKeyword(@RequestParam("query") String query) {
        try {
            if (query.isBlank()) {
                return ResponseEntity.badRequest().body("query 파라미터가 비어있음");
            }

            // 🟢 이 부분을 추가! 백엔드에서도 쿼리 길이 제한
            if (query.length() > 100) {
                query = query.substring(0, 100);
            }

            String encoded = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String apiUrl = "https://dapi.kakao.com/v2/local/search/keyword.json?query=" + encoded;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + kakaoRestKey);

            HttpEntity<String> reqEntity = new HttpEntity<>("", headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl, HttpMethod.GET, reqEntity, String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return ResponseEntity.ok(response.getBody());
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body("카카오 API 호출 실패: " + response.getStatusCodeValue());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버오류: " + e.getMessage());
        }
    }

    /**
     * 카테고리 검색 API
     * GET /api/kakao/category?category_group_code=FD6&x=127.0&y=37.5&radius=1000&sort=distance
     */
    @GetMapping("/category")
    public ResponseEntity<String> searchCategory(
            @RequestParam("category_group_code") String categoryCode,
            @RequestParam("x") String x,
            @RequestParam("y") String y,
            @RequestParam(value="radius", required=false, defaultValue="1000") String radius,
            @RequestParam(value="page", required=false, defaultValue="1") String page,
            @RequestParam(value="size", required=false, defaultValue="15") String size,
            @RequestParam(value="sort", required=false, defaultValue="distance") String sort
    ) {
        try {
            String apiUrl = String.format("https://dapi.kakao.com/v2/local/search/category.json?category_group_code=%s&x=%s&y=%s&radius=%s&page=%s&size=%s&sort=%s",
                    categoryCode, x, y, radius, page, size, sort);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + kakaoRestKey);

            HttpEntity<String> reqEntity = new HttpEntity<>("", headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl, HttpMethod.GET, reqEntity, String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return ResponseEntity.ok(response.getBody());
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body("카카오 API 호출 실패: " + response.getStatusCodeValue());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버오류: " + e.getMessage());
        }
    }
}
