import { Row, Col, Image } from 'react-bootstrap';

const AboutUs = () => {
    return (
        <div>
            <Row className="my-5">
                <Col md={4}>
                    <Image
                        src="https://via.placeholder.com/400x300?text=Introduce+Image"
                        fluid
                        rounded
                        alt="Introduce"
                    />
                </Col>
                <Col md={8}>
                    <h2>Giới thiệu</h2>
                    <p>
                        Nhà hàng của chúng tôi chuyên phục vụ các món ăn ngon và độc đáo. Chúng tôi cam kết sử dụng nguyên liệu tươi ngon và mang đến trải nghiệm ẩm thực tuyệt vời cho khách hàng.
                    </p>
                    <p>
                        Địa chỉ: Số 123, Đường ABC, Thành phố XYZ.
                    </p>
                    <p>
                        Liên hệ: 0123-456-789
                    </p>
                </Col>
            </Row>
            <Row className="my-5">
                <Col md={12}>
                    <h3>Lịch Sử</h3>
                    <p>
                        Nhà hàng của chúng tôi được thành lập vào năm 2005, với sứ mệnh mang đến những món ăn ngon và không gian ấm cúng cho khách hàng. Trong suốt hơn 15 năm qua, chúng tôi đã không ngừng phát triển và nâng cao chất lượng dịch vụ.
                    </p>
                </Col>
            </Row>
            <Row className="my-5">
                <Col md={4}>
                    <Image
                        src="https://via.placeholder.com/400x300?text=Staff+Image"
                        fluid
                        rounded
                        alt="Staff"
                    />
                </Col>
                <Col md={8}>
                    <h3>Đội Ngũ</h3>
                    <p>
                        Chúng tôi tự hào với đội ngũ nhân viên chuyên nghiệp và tận tâm. Từ đầu bếp đến nhân viên phục vụ, tất cả đều được đào tạo để mang đến trải nghiệm tốt nhất cho khách hàng.
                    </p>
                </Col>
            </Row>
            <Row className="my-5">
                <Col md={8}>
                    <h3>Đầu Bếp Trưởng</h3>
                    <p>
                        Đầu bếp trưởng của chúng tôi, ông Nguyễn Văn A, có hơn 20 năm kinh nghiệm trong lĩnh vực ẩm thực. Ông đã làm việc tại nhiều nhà hàng nổi tiếng và mang đến những món ăn sáng tạo và ngon miệng.
                    </p>
                </Col>
                <Col md={4}>
                    <Image
                        src="https://via.placeholder.com/400x300?text=Chef+Image"
                        fluid
                        rounded
                        alt="Chef"
                    />
                </Col>
            </Row>
            <Row className="my-5">
                <Col md={4}>
                    <Image
                        src="https://via.placeholder.com/400x300?text=Team+Image"
                        fluid
                        rounded
                        alt="Team"
                    />
                </Col>
                <Col md={8}>
                    <h3>Hình Ảnh Đội Ngũ</h3>
                    <p>
                        Hình ảnh đội ngũ nhân viên của chúng tôi trong các sự kiện và hoạt động nội bộ. Chúng tôi luôn coi trọng sự đoàn kết và phát triển bền vững của đội ngũ.
                    </p>
                </Col>
            </Row>
        </div>
    );
};

export default AboutUs;
