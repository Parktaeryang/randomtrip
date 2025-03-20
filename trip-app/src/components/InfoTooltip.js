import React, { useState } from 'react';
import { Tooltip, Modal, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

function InfoTooltip() {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5px' }}>
            <Tooltip title="검색 방법 및 데이터 출처를 확인하려면 클릭하세요.">
                <QuestionCircleOutlined
                    style={{
                        fontSize: '25px',
                        cursor: 'pointer',
                        color: '#1677FF',
                        verticalAlign: 'middle'
                    }}
                    onClick={showModal}
                />
            </Tooltip>

            {/* 🔹 안내 모달 */}
            <Modal
                title="🔍 검색 및 이용 안내"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Title level={4}>📌 사용 방법</Title>
                <Paragraph>
                    이 서비스는 <strong>랜덤으로 관광지를 추천</strong>하고, 해당 위치를 지도에서 확인하며, 주변 맛집 및 관광지를 검색할 수 있도록 도와줍니다.
                </Paragraph>

                <Title level={4}>🔎 검색 방법</Title>
                <Paragraph>
                    <p>검색창에 원하는 지역명을 입력한 후 "검색" 버튼을 클릭하세요.</p>
                    <p>추천된 관광지가 지도에 마커로 표시됩니다.</p>
                    <p>"음식점", "관광지" 버튼을 클릭하면 주변 장소가 지도에 추가됩니다.</p>
                </Paragraph>

                <Title level={4}>📍 지도 이용 방법</Title>
                <Paragraph>
                    <p>마커를 클릭하면 해당 장소의 상세 정보를 확인할 수 있습니다.</p>
                    <p>관광지, 음식점, 문화시설을 한눈에 볼 수 있도록 UI가 제공됩니다.</p>
                </Paragraph>

                <Title level={4}>🌏 데이터 출처</Title>
                <Paragraph>
                    본 서비스는 한국관광공사 API를 기반으로 데이터를 제공합니다.<br />
                    제공되는 데이터는 최신 정보와 차이가 있을 수 있으므로, 방문 전 개별 확인을 권장합니다.
                </Paragraph>

                <Title level={4}>📧 문의 및 개선 제안</Title>
                <Paragraph>
                    서비스 관련 문의나 추가 개선 요청이 있다면 아래 이메일로 연락해주세요.
                    <a href="mailto:skygve2@gmail.com">📩 skygve2@gmail.com</a>
                </Paragraph>
            </Modal>
        </div>
    );
}

export default InfoTooltip;
