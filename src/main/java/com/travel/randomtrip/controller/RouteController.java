package com.travel.randomtrip.controller;

import com.travel.randomtrip.service.NaverApiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/route")
public class RouteController {
    private final NaverApiService naverApiService;

    public RouteController(NaverApiService naverApiService) {
        this.naverApiService = naverApiService;
    }

    @GetMapping
    public String getRoute(@RequestParam String start, @RequestParam String goal) {
        System.out.println("📌 [백엔드] 길찾기 요청: 출발지 = " + start + ", 목적지 = " + goal);
        return naverApiService.getRoute(start, goal);
    }
}
