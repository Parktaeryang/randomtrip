package com.travel.randomtrip.dto;

// 목적지 정보를 담는 DTO (Data Transfer Object)
public class DestinationResponse {
    private String name;

    public DestinationResponse(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
