package com.travel.randomtrip.service;

import com.travel.randomtrip.data.DestinationData;
import com.travel.randomtrip.dto.DestinationResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DestinationService {

    // 선호도를 반영한 랜덤 목적지 반환
    public DestinationResponse getRandomDestination(List<String> categories) {
        String destination = DestinationData.getRandomDestination(categories);
        return new DestinationResponse(destination);
    }
}
