package com.travel.randomtrip.controller;

import com.travel.randomtrip.service.TourismService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/* REST Controller 클래스: 클라이언트 요청을 받아 처리하고 응답을 JSON으로 반환 */
@RestController
@RequestMapping("/api/destination")
public class DestinationController {

    private final TourismService tourismService;
    /* 생성자 주입 패턴을 사용하여 서비스 객체 주입 (의존성 주입 패턴) */
    public DestinationController(TourismService tourismService) {
        this.tourismService = tourismService;
    }

    /*
     GET 방식으로 클라이언트에서 요청한 랜덤 관광지 정보를 JSON 형태로 반환
     URL 예시: GET /api/destination/random?keyword=서울&contentTypeId=12
     통신 방식: 동기 방식으로 요청을 처리하고 결과 반환
    */
    @GetMapping("/random")
    public Map<String, String> getRandomDestination(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer contentTypeId
    ) {
        // 서비스에서 처리된 관광지 정보를 반환
        return tourismService.getRandomDestinationWithCoords(keyword, contentTypeId);
    }
}
