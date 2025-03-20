import React, {useState, useRef, useEffect, useCallback} from 'react';
import axios from 'axios';
import { Layout, Input, Select, Button, List, Typography, Space } from 'antd';
import InfoTooltip from './components/InfoTooltip';
const { Header, Content, Footer } = Layout;
const { Option } = Select;

function App() {
    const [keyword, setKeyword] = useState('');
    const [contentTypeId, setContentTypeId] = useState('');
    const [place, setPlace] = useState({ name: '', x: '', y: '' });
    const [places, setPlaces] = useState([]);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const infoWindowRef = useRef(null);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;


    const fetchBackendData = useCallback(async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/destination/random`);
            setPlace(res.data);
        } catch (err) {
            console.error("백엔드 API 호출 실패:", err);
        }
    }, [backendUrl]);


    useEffect(() => {
        fetchBackendData();
    }, [fetchBackendData]);



    // 지도 마커 초기화
    const clearMarkers = () => {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
            infoWindowRef.current = null;
        }
    };

    // 랜덤 관광지 검색
    const handleFetchRandom = async () => {
        clearMarkers();
        try {
            const res = await axios.get(`${backendUrl}/api/destination/random`, {
                params: { keyword, contentTypeId }
            });


            const { name, x, y } = res.data;

            if (!x || !y) {
                alert('좌표 정보가 없습니다.');
                return;
            }

            setPlace({ name, x, y });
            drawMap(y, x, name);
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

        const mapContainer = document.getElementById('map');
        const mapOption = {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 4,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        mapRef.current = map;

        const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(lat, lng)
        });
        marker.setMap(map);
        markersRef.current.push(marker);

        const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:14px;">${title}</div>`
        });
        infowindow.open(map, marker);
        infoWindowRef.current = infowindow;
    };

    const handleCategorySearch = async (categoryCode) => {
        clearMarkers();
        try {
            const { x, y } = place;
            if (!x || !y) {
                alert('먼저 랜덤 관광지를 검색해주세요.');
                return;
            }



            const res = await axios.get(`${backendUrl}/api/kakao/category`, {
                params: { category_group_code: categoryCode, x, y, radius: 15000, size: 15, sort: 'distance' }
            });



            const data = res.data.documents;

            if (!data || data.length === 0) {
                alert("해당 카테고리의 장소를 찾을 수 없습니다.");
                setPlaces([]); // 검색 결과가 없으면 빈 배열 설정
                return;
            }

            setPlaces(data); // 목록 업데이트

            //  지도에 마커 추가
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
