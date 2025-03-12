package com.travel.randomtrip.controller;

import com.travel.randomtrip.dto.DestinationResponse;
import com.travel.randomtrip.service.DestinationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destination")
public class DestinationController {
    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    // 사용자 선호도 반영 랜덤 목적지 추천 API
    @PostMapping("/random")
    public DestinationResponse getRandomDestination(@RequestBody List<String> categories) {
        System.out.println("📌 [백엔드] 받은 카테고리: " + categories); // 디버깅용
        return destinationService.getRandomDestination(categories);
    }
}
