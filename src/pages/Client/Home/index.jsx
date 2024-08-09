import { Col, Row } from "react-bootstrap";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './style.css';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import request from "../../../config/apiConfig";
import { FaCarTunnel } from "react-icons/fa6";

const Home = () => {
    const [dishes, setDishes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDataDishes();
    }, []);

    const fetchDataDishes = async () => {
        try {
            const res = await request({ path: 'dishes/status-true' });
            console.log(res);
            setDishes(res || []);
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };



    return (
        <div>
            <Row className="align-items-center mb-4">
                <Col className="text-left">
                    <h3>Món ăn nổi bậc</h3>
                </Col>
                <Col className="text-end">
                    <Button variant="link" href='/dish-list' className="text-primary">Xem thêm</Button>
                </Col>
            </Row>

            <Row>
                {dishes?.map(dish => (
                    <Col key={dish.id} sm={3}>
                        <Link to={`/dishes/${dish.id}`} style={{ textDecoration: 'none' }}>
                            <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    component="img"
                                    alt="green iguana"
                                    height="170"
                                    image={`/assets/images/${dish.image}`}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {dish.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {dish.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Share</Button>
                                    <Button size="medium">
                                        <FaShoppingCart size={20} />
                                    </Button>
                                </CardActions>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Home;
