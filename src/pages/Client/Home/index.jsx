import { Button, Card, Carousel, Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import './style.css'
import BookTable from "../BookTable";
import { useEffect, useState } from "react";
import response from '../../../config/apiConfig'
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";


const Home = () => {

    const [dishes, setDishes] = useState([]);
    
    useEffect(() => {
        fetchDataDishes();
    }, []);

    const fetchDataDishes = async () => {
        const res = await response({
            path: 'dishes'
        });
        setDishes(res.data);
    }


    return (
        <div>
            <Carousel className="mb-4 mt-2">
                {
                    dishes.slice(0, 3).reverse().map((dish) => (
                        <Carousel.Item key={dish.id} className="carousel-item-overlay">
                            <img
                                src={`assets/images/${dish.image}`}
                                alt={`${dish.name}`}
                                style={{
                                    width: '100%',
                                    height: '650px',
                                    objectFit: 'cover',
                                }}
                            />
                            <div className="overlay"></div>
                            <Carousel.Caption>
                                <h3>{dish.name}</h3>
                                <p>{dish.description}</p>
                                <Link to={'/dish-list'} style={{ color: 'white', textDecoration: 'none' }}>Xem thêm</Link>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))
                }
            </Carousel>

            {/* ss2 */}
            <Row className="align-items-center mb-4">
                <Col className="text-left">
                    <h3>Món ăn nổi bậc</h3>
                </Col>
                <Col className="text-end">
                    <Button variant="link" href='/dish-list' className="text-primary">Xem thêm</Button>
                </Col>
            </Row>
            <Swiper
                spaceBetween={20}
                slidesPerView={5}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
            >
                {dishes.map(dish => (
                    <SwiperSlide key={dish.id}>
                        <div className="hover-card">
                            <Card className="card-hover">
                                <div className="hover-card-image-container">
                                    <Card.Img src={`assets/images/${dish.image}`} />
                                    <div className="hover-card-overlay">
                                        <Card.Body className="hover-card-body">
                                            <Card.Title>{dish.name}</Card.Title>
                                            <Card.Text>{dish.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Card.Text>
                                            <Button style={{ opacity: '0.7' }}>
                                                <FaShoppingCart size={18} />
                                            </Button>
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