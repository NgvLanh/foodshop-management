import React from 'react';
import { Row, Col, Image, Carousel, Card } from 'react-bootstrap';
import './style.css'
const AboutUs = () => {
    return (
        <div>
            <Row className="my-5">
                <Col md={4}>
                    <Image
                        src="./assets/images/logo.png"
                        fluid
                        rounded
                        alt="Introduce"
                    />
                </Col>
                <Col md={8}>
                    <h2>Giới thiệu</h2>
                    <p>
                        Chào mừng bạn đến với nhà hàng của chúng tôi, nơi mang đến những trải nghiệm ẩm thực tuyệt vời! Chúng tôi tự hào là điểm đến lý tưởng cho những tín đồ yêu thích món ăn ngon và chất lượng. Nhà hàng của chúng tôi chuyên phục vụ các món ăn đa dạng, được chế biến từ những nguyên liệu tươi ngon nhất, đảm bảo giữ trọn hương vị tự nhiên và dinh dưỡng.

                        Với không gian ấm cúng và sang trọng, bạn sẽ cảm nhận được sự thoải mái và thư giãn trong mỗi lần ghé thăm. Đội ngũ nhân viên của chúng tôi luôn tận tâm và chuyên nghiệp, sẵn sàng đáp ứng mọi nhu cầu của bạn để mang đến một dịch vụ tận tình và chu đáo nhất.

                        Chúng tôi tọa lạc tại Số 123, Đường ABC, Thành phố XYZ, nơi dễ dàng tìm thấy và thuận tiện để đến. Đừng ngần ngại liên hệ với chúng tôi qua số điện thoại 0123-456-789 để đặt bàn hoặc biết thêm thông tin. Nhà hàng mở cửa từ Thứ Hai đến Chủ Nhật, từ 10:00 AM đến 10:00 PM, luôn chào đón bạn và gia đình đến thưởng thức những món ăn ngon miệng!    </p>
                    <p>
                        <strong>Địa chỉ:</strong> Số 123, Đường ABC, Thành phố XYZ.
                    </p>
                    <p>
                        <strong>Liên hệ:</strong> 0123-456-789
                    </p>
                    <p>
                        <strong>Giờ mở cửa:</strong> Thứ Hai đến Chủ Nhật, từ 10:00 AM đến 10:00 PM.
                    </p>
                </Col>
            </Row>

            <Row className="my-5">
                <h3 className="text-center mb-4">Hình Ảnh Đội Ngũ HaLa TP Foods</h3>
                <Col md={3}>
                    <Card className="rounded-4">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <div className="testimonial-avatar">
                                <Image
                                    src="./assets/images/nv2.jpg"
                                    width={100}
                                    height={100}
                                    roundedCircle
                                    alt="nguoi-choi-1"
                                />
                            </div>
                            <Card.Text className="text-center mt-3">
                                Những món ăn do chính tay anh ta chế biến ! Master Chef của nhà hàng !
                            </Card.Text>
                            <footer className="mt-2">
                                Vua Đầu Bếp : <span>Nguyễn Văn Tiến</span>
                            </footer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="rounded-4">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <div className="testimonial-avatar">
                                <Image
                                    src="./assets/images/nv1.jpg"
                                    width={100}
                                    height={100}
                                    roundedCircle
                                    alt="nguoi-choi-2"
                                />
                            </div>
                            <Card.Text className="text-center mt-3">
                                Quản Lý Mọi Thứ ! Ông Vua Gánh Team ! Kẻ Tư Bản Vĩ Đại
                            </Card.Text>
                            <footer className="mt-2">
                                Master : <span>Nguyễn Văn Lành</span>
                            </footer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className=" rounded-4">
                        <Card.Body className="d-flex flex-column align-items-center rounded-0">
                            <div className="testimonial-avatar ">
                                <Image
                                    src="./assets/images/nv3.png"
                                    width={100}
                                    height={100}
                                    roundedCircle
                                    alt="nguoi-choi-3"
                                />
                            </div>
                            <Card.Text className="text-center mt-3">
                                Chúa tể bị đày đọa ! Ông vua ERD ! Kẻ bị tư bản kiểm soát ! Gym Chúa
                            </Card.Text>
                            <footer className="mt-2">
                                Gym Master : <span>Khưu Trọng Phúc</span>
                            </footer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="rounded-4">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <div className="testimonial-avatar">
                                <Image
                                    src="./assets/images/nv4.jpg"
                                    width={100}
                                    height={100}
                                    roundedCircle
                                    alt="nguoi-choi-4"
                                />
                            </div>
                            <Card.Text className="text-center mt-3">
                                Người tạo nên những bức ảnh đẹp ! Bida thể lực ! Chúa tể Design ! Vua FO4 !
                            </Card.Text>
                            <footer className="mt-2">
                                Photographer : <span>Hồ Huỳnh Hào</span>
                            </footer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Google Map */}
            <Row>
                <Col md={12}>
                    <h3 className='text-center mb-3'>Địa chỉ</h3>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.7604640328386!2d105.78717347591689!3d10.03661479007069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a06382f0044189%3A0xb75aa051073c9b04!2sNinh%20Ki%E1%BB%81u%20Riverside%20Hotel!5e0!3m2!1svi!2s!4v1723355004756!5m2!1svi!2s"
                        width="100%"
                        height="450"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Map"
                    ></iframe>
                </Col>
            </Row>
        </div>
    );
};

export default AboutUs;
