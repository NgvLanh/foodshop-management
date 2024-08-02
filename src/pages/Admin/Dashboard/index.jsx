import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { BsCurrencyDollar, BsFillCartCheckFill, BsGraphUpArrow, BsPiggyBank } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const lineData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [
        {
            label: 'Chi Phí',
            data: [12000000, 15000000, 10000000, 18000000, 20000000, 16000000, 17000000, 14000000, 19000000, 22000000, 21000000, 23000000],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
        },
        {
            label: 'Doanh Số',
            data: [20000000, 25000000, 22000000, 30000000, 28000000, 27000000, 29000000, 26000000, 31000000, 35000000, 34000000, 37000000],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
        },
    ],
};

const lineOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chi Phí và Doanh Số Theo Tháng',
        },
    },
};

// Dữ liệu cho bảng doanh thu từ hóa đơn
const revenueData = [
    { invoice: 'Hóa Đơn 001', revenue: '1,000,000 VND' },
    { invoice: 'Hóa Đơn 002', revenue: '2,500,000 VND' },
    { invoice: 'Hóa Đơn 003', revenue: '3,200,000 VND' },
    { invoice: 'Hóa Đơn 004', revenue: '1,800,000 VND' },
    { invoice: 'Hóa Đơn 005', revenue: '2,700,000 VND' },
];

const Dashboard = () => {
    return (
        <div className="bg-light w-100">
            <Container fluid style={{ padding: "10px 10px 10px 30px", background: "#f7f4f4", height: '100vh', borderTopLeftRadius: "10px" }}>
                <Row className="justify-content-center my-4" style={{ padding: "27px 10px 10px 10px", backgroundColor: "#ffffff", borderRadius: "10px" }}>
                    <Col xs={10} style={{ paddingBottom: "20px" }}>
                        <span className="til1" style={{ fontWeight: "bold", color: "#394064" }}>Doanh Thu Hôm Nay</span>
                    </Col>
                    <Col xs={2} style={{ display: "flex", justifyContent: "right" }}>
                        <span className="link" style={{ marginLeft: "auto" }}>
                            <Link to={'/admin/dashboard'}>Admin</Link> / Dashboard
                        </span>
                    </Col>
                    <Col md={3} xs={12} className="mb-3 d-flex justify-content-center">
                        <Card className="shadow-lg w-100" style={{ height: "170px", backgroundColor: "#ffe2e6" }}>
                            <Card.Body className="d-flex justify-content-around align-items-center">
                                <div>
                                    <h2 className="fs-3">230</h2>
                                    <p className="fs-5">Món Ăn</p>
                                </div>
                                <BsFillCartCheckFill size={48} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} xs={12} className="mb-4 d-flex justify-content-center">
                        <Card className="shadow-lg w-100" style={{ height: "170px", backgroundColor: "#fff4de" }}>
                            <Card.Body className="d-flex justify-content-around align-items-center">
                                <div>
                                    <h2 className="fs-3">2303</h2>
                                    <p className="fs-5">Đơn Hàng</p>
                                </div>
                                <BsCurrencyDollar size={48} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} xs={12} className="mb-4 d-flex justify-content-center">
                        <Card className="shadow-lg w-100" style={{ height: "170px", backgroundColor: "#dcfce7" }}>
                            <Card.Body className="d-flex justify-content-around align-items-center">
                                <div>
                                    <h2 className="fs-3">12,000,000 VND</h2>
                                    <p className="fs-5">Tổng Tiền</p>
                                </div>
                                <BsPiggyBank size={48} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} xs={12} className="mb-4 d-flex justify-content-center">
                        <Card className="shadow-lg w-100" style={{ height: "170px", backgroundColor: "#f4e8ff" }}>
                            <Card.Body className="d-flex justify-content-around align-items-center">
                                <div>
                                    <h2 className="fs-3">20%</h2>
                                    <p className="fs-5">Tăng Trưởng</p>
                                </div>
                                <BsGraphUpArrow size={48} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="pt-1">
                    <Col md={7}>
                        <Card className="shadow-lg rounded">
                            <Card.Body>
                                <Line data={lineData} options={lineOptions} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={5}>
                        <Card className="shadow-lg rounded">
                            <Card.Body>
                                <h5 className="mb-4">Doanh Thu Từ Hóa Đơn</h5>
                                <Table bordered hover striped className="table-custom">
                                    <thead>
                                        <tr>
                                            <th>Hóa Đơn</th>
                                            <th>Doanh Thu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {revenueData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.invoice}</td>
                                                <td>{item.revenue}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;
