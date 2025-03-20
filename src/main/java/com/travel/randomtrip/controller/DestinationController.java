package com.travel.randomtrip.controller;

import com.travel.randomtrip.service.TourismService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/destination")
public class DestinationController {

    private final TourismService tourismService;

    public DestinationController(TourismService tourismService) {
        this.tourismService = tourismService;
    }

    @GetMapping("/random")
    public Map<String, String> getRandomDestination(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer contentTypeId
    ) {
        return tourismService.getRandomDestinationWithCoords(keyword, contentTypeId);
    }
}
