import React, {useState, useRef, useEffect, useCallback} from 'react';
import axios from 'axios';
import { Layout, Input, Select, Button, List, Typography, Space } from 'antd';
import InfoTooltip from './components/InfoTooltip';
const { Header, Content, Footer } = Layout;
const { Option } = Select;

/* React 함수형 컴포넌트 (Hook 기반) */
function App() {
    /* 사용자 입력값 (검색 키워드) */
    const [keyword, setKeyword] = useState('');

    /* 관광지 유형 선택값 관리 */
    const [contentTypeId, setContentTypeId] = useState('');

    /* 현재 선택된 관광지 정보 상태 관리 */
    const [place, setPlace] = useState({ name: '', x: '', y: '' });

    /* 카테고리 검색 결과 목록 상태 관리 */
    const [places, setPlaces] = useState([]);

    /* 카카오 지도 인스턴스를 저장하기 위한 Ref 객체 */
    const mapRef = useRef(null);

    /* 지도에 표시된 마커 객체들을 저장하는 Ref 배열 */
    const markersRef = useRef([]);

    /* 지도 마커 클릭 시 나타나는 정보창(InfoWindow) 객체를 관리하는 Ref 객체 */
    const infoWindowRef = useRef(null);

    /* 서버 환경변수에서 url 동적 로 */
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    /*
    최초 로딩 시 backendUrl에서 랜덤 관광지 가져오기
    */
    const fetchBackendData = useCallback(async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/destination/random`);
            setPlace(res.data);
        } catch (err) {
            console.error("백엔드 API 호출 실패:", err);
        }
    }, [backendUrl]);

    /* 컴포넌트 최초 렌더링 시 실행 (백엔드에서 랜덤 관광지 데이터 로딩) */
    useEffect(() => {
        fetchBackendData();
    }, [fetchBackendData]);



    /* 지도 상의 모든 마커와 정보창 초기화 */
    const clearMarkers = () => {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
            infoWindowRef.current = null;
        }
    };

    /* 사용자가 입력한 키워드 및 선택한 카테고리를 기반으로 랜덤 관광지 정보 요청 (비동기 방식) */
    const handleFetchRandom = async () => {
        clearMarkers(); // 기존 마커 제거
        try {
            const res = await axios.get(`${backendUrl}/api/destination/random`, {
                params: { keyword, contentTypeId }
            });


            const { name, x, y } = res.data;

            if (!x || !y) {
                alert('좌표 정보가 없습니다.');
                return;
            }

            setPlace({ name, x, y }); // 상태 업데이트
            drawMap(y, x, name);           // 지도에 마커 표시
        } catch (err) {
            console.error("API 요청 오류:", err);
        }
    };

    // 카카오 지도 로딩
    const drawMap = (lat, lng, title) => {
        if (!window.kakao || !window.kakao.maps) {
            console.error("카카오 지도 API가 아직 로드되지 않았습니다.");
            return;
        }

        const mapContainer = document.getElementById('map'); // 지도를 표시할 DOM Element 지정
        const mapOption = {
            center: new window.kakao.maps.LatLng(lat, lng), // 지도 중심 좌표
            level: 4, // 지도 확대 레벨
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        mapRef.current = map; // 지도 객체를 Ref에 저장하여 나중에 재사용 가능

        // 마커 생성 및 지도에 표시
        const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(lat, lng)
        });
        marker.setMap(map);
        markersRef.current.push(marker);

        // 마커 클릭 시 정보창(InfoWindow) 표시
        const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:14px;">${title}</div>`
        });
        infowindow.open(map, marker);
        infoWindowRef.current = infowindow;
    };

    /* 카카오 카테고리 검색 API 호출하여 관광지 주변 장소를 표시하는 함수 */
    const handleCategorySearch = async (categoryCode) => {
        clearMarkers(); // 기존 지도 마커 초기화
        try {
            const { x, y } = place; // 현재 관광지 좌표
            if (!x || !y) {
                alert('먼저 랜덤 관광지를 검색해주세요.');
                return;
            }

            // 카테고리별 장소를 요청하는 API 호출
            const res = await axios.get(`${backendUrl}/api/kakao/category`, {
                params: { category_group_code: categoryCode, x, y, radius: 15000, size: 15, sort: 'distance' }
            });

            const data = res.data.documents;

            if (!data || data.length === 0) {
                alert("해당 카테고리의 장소를 찾을 수 없습니다.");
                setPlaces([]); // 검색 결과가 없으면 빈 배열 설정
                return;
            }

            setPlaces(data); // 검색된 장소 목록 상태 업데이트

            // 지도에 각 장소별 마커 추가
            data.forEach(place => {
                const markerPosition = new window.kakao.maps.LatLng(place.y, place.x);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition
                });

                marker.setMap(mapRef.current);
                markersRef.current.push(marker);

                const infowindow = new window.kakao.maps.InfoWindow({
                    content: `
                    <div style="padding:10px;font-size:12px;">
                        <strong>${place.place_name}</strong><br/>
                        ${place.address_name}<br/>
                        <a href="${place.place_url}" target="_blank">상세보기</a>
                    </div>`
                });

                window.kakao.maps.event.addListener(marker, 'click', () => {
                    if (infoWindowRef.current) infoWindowRef.current.close();
                    infowindow.open(mapRef.current, marker);
                    infoWindowRef.current = infowindow;
                });
            });

        } catch (err) {
            console.error("카테고리 검색 오류:", err);
            alert("카테고리 검색 중 오류가 발생했습니다.");
        }
    };


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ backgroundColor: '#1677FF', padding: '0 20px' }}>
                <Typography.Title level={3} style={{ color: 'white', marginTop: '14px' }}>
                    🚀 랜덤 관광지 여행
                </Typography.Title>
            </Header>
            <Content style={{ padding: '20px', maxWidth: 900, margin: '0 auto' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Space.Compact style={{ width: '100%' }}>
                        <Input
                            placeholder="키워드를 입력하세요 (예: 서울)"
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                        />
                        <Select placeholder="카테고리 선택" value={contentTypeId} onChange={value => setContentTypeId(value)} allowClear>
                            <Option value="">전체</Option>
                            <Option value="12">관광지</Option>
                            <Option value="14">문화시설</Option>
                            <Option value="28">레포츠</Option>
                            <Option value="39">음식점</Option>
                        </Select>
                        <Space style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Button type="primary" onClick={handleFetchRandom}>검색</Button>
                            <InfoTooltip />
                        </Space>
                    </Space.Compact>

                    <Typography.Title level={4}>📍 {place.name}</Typography.Title>

                    <div id="map" style={{ width: '100%', height: '400px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}></div>

                    <Space style={{ marginTop: 10 }}>
                        <Button onClick={() => handleCategorySearch('FD6')}>🍔 음식점</Button>
                        <Button onClick={() => handleCategorySearch('CT1')}>🎭 문화시설</Button>
                        <Button onClick={() => handleCategorySearch('AT4')}>📷 관광명소</Button>
                    </Space>
                    <List
                        bordered
                        dataSource={places || []}  // ✅ places가 undefined일 경우 빈 배열로 설정
                        style={{ marginTop: '20px' }}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={<a href={item.place_url} target="_blank" rel="noopener noreferrer">{item.place_name}</a>}
                                    description={`${item.address_name} (${item.distance}m)`}
                                />
                            </List.Item>
                        )}
                    />

                </Space>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Created by Strong-Ryang </Footer>
        </Layout>
    );
}

export default App;
