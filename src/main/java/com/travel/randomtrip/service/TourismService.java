package com.travel.randomtrip.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TourismService {

    @Value("${tourism.service.key}")
    private String serviceKey;

    private final RestTemplate restTemplate;

    public TourismService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private static final String BASE_URL = "https://apis.data.go.kr/B551011/KorService1/searchKeyword1";

    /**
     * 랜덤 관광지명 반환
     */
    public Map<String, String> getRandomDestinationWithCoords(String keyword, Integer contentTypeId) {
        if (keyword == null || keyword.isBlank()) {
            keyword = "서울";
        }

        int totalCount = fetchTotalCount(keyword, contentTypeId);
        if (totalCount == 0) {
            return Map.of("name", "데이터가 없습니다.", "x", "", "y", "");
        }

        int randIndex = new Random().nextInt(totalCount) + 1;
        int pageSize = 10;
        int pageNo = (randIndex - 1) / pageSize + 1;
        int itemIndex = (randIndex - 1) % pageSize;

        String url = buildUrl(keyword, contentTypeId, pageSize, pageNo);
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        String xml = response.getBody();
        if (xml == null) {
            return Map.of("name", "데이터가 없습니다.", "x", "", "y", "");
        }

        Pattern titlePattern = Pattern.compile("<title>(?:<!\\[CDATA\\[)?(.*?)(?:]]>)?</title>");
        Pattern mapXPattern = Pattern.compile("<mapx>(.*?)</mapx>");
        Pattern mapYPattern = Pattern.compile("<mapy>(.*?)</mapy>");

        Matcher titleMatcher = titlePattern.matcher(xml);
        Matcher xMatcher = mapXPattern.matcher(xml);
        Matcher yMatcher = mapYPattern.matcher(xml);

        List<String> titles = new ArrayList<>();
        List<String> xs = new ArrayList<>();
        List<String> ys = new ArrayList<>();

        while (titleMatcher.find()) titles.add(titleMatcher.group(1));
        while (xMatcher.find()) xs.add(xMatcher.group(1));
        while (yMatcher.find()) ys.add(yMatcher.group(1));

        if (itemIndex >= titles.size()) {
            return Map.of("name", "데이터가 없습니다.", "x", "", "y", "");
        }

        return Map.of(
                "name", titles.get(itemIndex),
                "x", xs.get(itemIndex),
                "y", ys.get(itemIndex)
        );
    }


    private int fetchTotalCount(String keyword, Integer contentTypeId) {
        String url = buildUrl(keyword, contentTypeId, 1, 1);
        String xml = restTemplate.getForObject(url, String.class);
        if (xml == null) return 0;

        Pattern pat = Pattern.compile("<totalCount>(\\d+)</totalCount>");
        Matcher m = pat.matcher(xml);
        if (m.find()) {
            return Integer.parseInt(m.group(1));
        }
        return 0;
    }

    private String buildUrl(String keyword, Integer contentTypeId, int numOfRows, int pageNo) {
        StringBuilder sb = new StringBuilder(BASE_URL);
        sb.append("?serviceKey=").append(serviceKey);
        sb.append("&MobileOS=ETC");
        sb.append("&MobileApp=RandomTrip");
        sb.append("&_type=xml");
        sb.append("&keyword=").append(keyword.replace(" ", "%20"));
        sb.append("&numOfRows=").append(numOfRows);
        sb.append("&pageNo=").append(pageNo);

        if (contentTypeId != null) {
            sb.append("&contentTypeId=").append(contentTypeId);
        }
        return sb.toString();
    }

    private List<String> extractTitles(String xml) {
        Pattern p = Pattern.compile("<title>(?:<!\\[CDATA\\[)?(.*?)(?:]]>)?</title>");
        Matcher m = p.matcher(xml);
        List<String> result = new ArrayList<>();
        while (m.find()) {
            result.add(m.group(1));
        }
        return result;
    }
}
