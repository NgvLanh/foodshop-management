import { Button, Card, Carousel, Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import './style.css'
import BookTable from "../BookTable";

const dishesData = [
    { id: 1, image: "https://via.placeholder.com/150?text=Dish+1", name: "Món ăn 1", price: "100,000 VND" },
    { id: 2, image: "https://via.placeholder.com/150?text=Dish+2", name: "Món ăn 2", price: "150,000 VND" },
    { id: 3, image: "https://via.placeholder.com/150?text=Dish+3", name: "Món ăn 3", price: "200,000 VND" },
    { id: 4, image: "https://via.placeholder.com/150?text=Dish+4", name: "Món ăn 4", price: "250,000 VND" },
    { id: 5, image: "https://via.placeholder.com/150?text=Dish+5", name: "Món ăn 5", price: "300,000 VND" },
    { id: 6, image: "https://via.placeholder.com/150?text=Dish+6", name: "Món ăn 6", price: "350,000 VND" },
    { id: 7, image: "https://via.placeholder.com/150?text=Dish+7", name: "Món ăn 7", price: "400,000 VND" },
    { id: 8, image: "https://via.placeholder.com/150?text=Dish+8", name: "Món ăn 8", price: "450,000 VND" },
];

const Home = () => {
    return (
        <div>
            <Carousel className="mb-4 mt-2">
                <Carousel.Item>
                    <img
                        src="https://via.placeholder.com/800x450?text=Dish+1"
                        alt="Món ăn 1"
                        style={{
                            width: '100%',
                            height: '450px',
                            objectFit: 'cover'
                        }}
                    />
                    <Carousel.Caption>
                        <h3>Mì Ý</h3>
                        <p>Thưởng thức món mì Ý thơm ngon, sốt kem béo ngậy được chế biến hoàn hảo.</p>
                        <Button variant="primary">Đặt Ngay</Button>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        src="https://via.placeholder.com/800x450?text=Dish+2"
                        alt="Món ăn 2"
                        style={{
                            width: '100%',
                            height: '450px',
                            objectFit: 'cover'
                        }}
                    />
                    <Carousel.Caption>
                        <h3>Bít Tết Nướng</h3>
                        <p>Bít tết mềm ngon được nướng theo yêu cầu của bạn, kèm rau củ tươi ngon.</p>
                        <Button variant="primary">Đặt Ngay</Button>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        src="https://via.placeholder.com/800x450?text=Dish+3"
                        alt="Món ăn 3"
                        style={{
                            width: '100%',
                            height: '450px',
                            objectFit: 'cover'
                        }}
                    />
                    <Carousel.Caption>
                        <h3>Salad Tươi Mát</h3>
                        <p>Hỗn hợp rau xanh, trái cây và hạt với sốt nhẹ nhàng, làm mới khẩu vị của bạn.</p>
                        <Button variant="primary">Đặt Ngay</Button>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            {/* ss2 */}
            <Row className="align-items-center mb-4">
                <Col>
                    <h2 className="text-left">Món ăn nổi bậc</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="link" href='/dish-list' className="text-primary">Xem thêm</Button>
                </Col>
            </Row>
            <Swiper
                spaceBetween={20}
                slidesPerView={6}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
            >
                {dishesData.map(dish => (
                    <SwiperSlide key={dish.id}>
                        <div className="hover-card">
                            <Card className="card-hover">
                                <div className="hover-card-image-container">
                                    <Card.Img variant="top" src={dish.image} />
                                    <div className="hover-card-overlay">
                                        <Card.Body className="hover-card-body">
                                            <Card.Title>{dish.name}</Card.Title>
                                            <Card.Text>{dish.price}</Card.Text>
                                            <Button variant="primary">Thêm món</Button>
                                        </Card.Body>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <BookTable />
        </div>
    )

}

export default Home;