package com.travel.randomtrip.data;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

// 목적지 데이터를 저장하는 클래스
public class DestinationData {

    // 목적지 데이터 (카테고리 추가)
    private static final List<Destination> DESTINATIONS = List.of(
            new Destination("서울 남산타워", "문화"),
            new Destination("경기 수원 화성", "문화"),
            new Destination("인천 차이나타운", "음식"),
            new Destination("서울 광장시장", "음식"),
            new Destination("경기 가평 레일바이크", "체험"),
            new Destination("인천 송도 워터파크", "체험")
    );

    private static final Random RANDOM = new Random();

    // 특정 카테고리의 목적지만 필터링 후 랜덤 반환
    public static String getRandomDestination(List<String> categories) {
        System.out.println("📌 [백엔드] 필터링할 카테고리: " + categories); // 디버깅용

        List<Destination> filtered = DESTINATIONS.stream()
                .filter(dest -> categories.contains(dest.getCategory()))
                .collect(Collectors.toList());

        System.out.println("📌 [백엔드] 필터링된 목적지 리스트: " + filtered.stream().map(Destination::getName).toList()); // 디버깅용

        if (filtered.isEmpty()) {
            return "해당 카테고리의 목적지가 없습니다.";
        }

        return filtered.get(RANDOM.nextInt(filtered.size())).getName();
    }

    // 목적지 정보 클래스
    public static class Destination {
        private final String name;
        private final String category;

        public Destination(String name, String category) {
            this.name = name;
            this.category = category;
        }

        public String getName() {
            return name;
        }

        public String getCategory() {
            return category;
        }
    }
}
