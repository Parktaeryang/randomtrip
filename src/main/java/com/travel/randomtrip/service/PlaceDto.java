package com.travel.randomtrip.service;

public class PlaceDto {
    private String title;
    private double mapx;
    private double mapy;

    public PlaceDto() {}

    public PlaceDto(String title, double mapx, double mapy) {
        this.title = title;
        this.mapx = mapx;
        this.mapy = mapy;
    }

    // getter/setter 생략하지 마세요.
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public double getMapx() { return mapx; }
    public void setMapx(double mapx) { this.mapx = mapx; }

    public double getMapy() { return mapy; }
    public void setMapy(double mapy) { this.mapy = mapy; }
}
