import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [destination, setDestination] = useState('');
    const [route, setRoute] = useState(null);

    const fetchRandomDestination = async () => {
        try {
            const response = await axios.get('/api/destination/random');
            setDestination(response.data.name);
        } catch (error) {
            console.error('Error fetching destination:', error);
            setDestination('에러 발생');
        }
    };

    // 길찾기 API 요청
    const fetchRoute = async () => {
        try {
            const userLocation = "127.1058342,37.359708"; // 예제 좌표 (사용자 현재 위치로 변경 필요)
            const response = await axios.get(`/api/route?start=${userLocation}&goal=${destination}`);
            setRoute(response.data);
        } catch (error) {
            console.error('Error fetching route:', error);
            setRoute('경로 정보를 가져올 수 없습니다.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>즉흥 랜덤 여행</h1>
            <button onClick={fetchRandomDestination}>랜덤 여행지 추천</button>
            {destination && (
                <>
                    <h2>추천 여행지: {destination}</h2>
                    <button onClick={fetchRoute}>길찾기</button>
                </>
            )}
            {route && (
                <div>
                    <h3>길찾기 결과:</h3>
                    <pre>{JSON.stringify(route, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default App;
