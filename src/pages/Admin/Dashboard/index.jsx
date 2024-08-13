import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { BsCurrencyDollar, BsFillCartCheckFill, BsGraphUpArrow, BsPiggyBank, } from "react-icons/bs";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import request from "../../../config/apiConfig";

const ApexChart = () => {
    const [state, setState] = useState({
        series: [
            {
                name: "Revenue",
                data: [11, 32, 45, 32, 34, 52, 41, 78, 34, 32, 32, 23], // Adjust this data to reflect yearly data
            },
        ],
        options: {
            chart: {
                height: 700,
                type: "area",
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            xaxis: {
                type: "category",
                categories: [
                    "Tháng 1",
                    "Tháng 2",
                    "Tháng 3",
                    "Tháng 4",
                    "Tháng 5",
                    "Tháng 6",
                    "Tháng 7",
                    "Tháng 8", // Adjust these categories to the years you want to display
                    "Tháng 9",
                    "Tháng 10",
                    "Tháng 11",
                    "Tháng 12",
                ],
            },
            tooltip: {
                x: {
                    format: "yyyy",
                },
            },
            colors: ["#888DF2"], // Thay đổi màu sắc ở đây
            fill: {
                colors: ["#94A2F2"], // Thay đổi màu sắc nền của biểu đồ
            },
        },
    });

    return (
        <div id="chart">
            <ReactApexChart
                options={state.options}
                series={state.series}
                type="area"
                height={500}
            />
        </div>
    );
};

const Dashboard = () => {
    const [payments, setPayments] = useState([]);
    const [paymentsTotal, setPaymentsTotal] = useState(0);
    const [paymentsCount, setPaymentsCount] = useState(0);
    var count = 0;
    // Fetch invoices data from API
    useEffect(() => {
        fetchDataPayments();
    }, []);

    const fetchDataPayments = async () => {
        try {
            const res = await request({
                path: "payments",
                header: 'Bearer '
            });
            setPayments(res);
            res.forEach(element => {
                count += element.amount;
                setPaymentsCount(count)
            });
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="bg-light w-100">
            <Container
                fluid
                style={{
                    padding: "10px 10px 10px 30px",
                    background: "#f7f4f4",
                    height: "100vh",
                    borderTopLeftRadius: "10px",
                }}
            >
                <Row
                    className="justify-content-center my-4"
                    style={{
                        padding: "27px 10px 10px 10px",
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                    }}
                >
                    <Col xs={10} style={{ paddingBottom: "20px" }}>
                        <span
                            className="til1"
                            style={{ fontWeight: "bold", color: "#394064" }}
                        >
                            Doanh Thu Hôm Nay
                        </span>
                    </Col>
                    <Col xs={2} style={{ display: "flex", justifyContent: "right" }}>
                        <span className="link" style={{ marginLeft: "auto" }}>
                            <Link to={"/admin/dashboard"}>Admin</Link> / Dashboard
                        </span>
                    </Col>
                    {/* Card for "Món Ăn" */}
                    <Col md={3} xs={12} className="mb-3 d-flex justify-content-center">
                        <Card
                            className="w-100"
                            style={{
                                height: "170px",
                                backgroundColor: "#FFFFFF",
                                borderRadius: "14px",
                            }}
                        >
                            <Card.Body className="d-flex justify-content-around align-items-center">
                                <BsFillCartCheckFill
                                    size={30}
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        backgroundColor: "#E9EDFB",
                                        borderRadius: "35px",
                                        color: "#3359DC",
                                        padding: "10px",
                                    }}
                                />
                                <div className="d-flex flex-column align-items-center row">
                                    <p
                                        className="fs-5"
                                        style={{ color: "#3B4F6F", fontFamily: "serif" }}
                                    >
                                       Số hoá đơn theo ngày 
                                    </p>
                                    <h2
                                        className="fs-3"
                                        style={{ fontSize: "24px", color: "#161C25" }}
                                    >
                                        {}
                                    </h2>
                                </div>
                            </Card.Body>
                            <Card.Footer
                                style={{
                                    backgroundColor: "#3359DC",
                                    paddingTop: "30px",
                                    borderRadius: "14px",
                                }}
                            ></Card.Footer>
                        </Card>
                    </Col>

                    {/* Card for "Đơn Hàng" */}
                    <Col md={3} xs={12} className="mb-3 d-flex justify-content-center">
                        <Card
                            className="w-100"
                            style={{
                                height: "170px",
                                backgroundColor: "#FFFFFF",
                                borderRadius: "14px",
                            }}
                        >
                            <Card.Body className="d-flex justify-content-around align-items-center">
                                <BsCurrencyDollar
                                    size={30}
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        backgroundColor: "#D6F5F3",
                                        borderRadius: "35px",
                                        color: "#24948C",
                                        padding: "10px",
                                    }}
                                />
                                <div className="d-flex flex-column align-items-center row">
                                    <p
                                        className="fs-5"
                                        style={{ color: "#3B4F6F", fontFamily: "serif" }}
                                    >
                                        Doanh thu theo ngày
                                    </p>
                                    <h2
                                        className="fs-3"
                                        style={{ fontSize: "24px", color: "#161C25" }}
                                    >
                                        {
                                            paymentsCount != 0 &&
                                            paymentsCount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                        }
                                    </h2>
                                </div>
                            </Card.Body>
                            <Card.Footer
                                style={{
                                    backgroundColor: "#24948C",
                                    paddingTop: "30px",
                                    borderRadius: "14px",
                                }}
                            ></Card.Footer>
                        </Card>
                    </Col>

                    {/* Card for "Tổng Tiền" */}
                    <Col md={3} xs={12} className="mb-3 d-flex justify-content-center">
                        <Card
                            className="w-100"
                            style={{
                                height: "170px",
                                backgroundColor: "#FFFFFF",
                                borderRadius: "14px",
                            }}
                        >
                            <Card.Body className="d-flex justify-content-around align-items-center">
                                <BsPiggyBank
                                    size={30}
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        backgroundColor: "#EAEFFB",
                                        borderRadius: "35px",
                                        color: "#153070",
                                        padding: "10px",
                                    }}
                                />
                                <div className="d-flex flex-column align-items-center row">
                                    <p
                                        className="fs-5"
                                        style={{ color: "#3B4F6F", fontFamily: "serif" }}
                                    >
                                       Tổng hoá đơn
                                    </p>
                                    <h2
                                        className="fs-3"
                                        style={{ fontSize: "24px", color: "#161C25" }}
                                    >
                                       {}
                                    </h2>
                                </div>
                            </Card.Body>
                            <Card.Footer
                                style={{
                                    backgroundColor: "#153070",
                                    paddingTop: "30px",
                                    borderRadius: "14px",
                                }}
                            ></Card.Footer>
                        </Card>
                    </Col>

                    {/* Card for "Tăng Trưởng" */}
                    <Col md={3} xs={12} className="mb-3 d-flex justify-content-center">
                        <Card
                            className="w-100"
                            style={{
                                height: "170px",
                                backgroundColor: "#FFFFFF",
                                borderRadius: "14px",
                            }}
                        >
                            <Card.Body className="d-flex justify-content-around align-items-center">
                                <BsGraphUpArrow
                                    size={30}
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        backgroundColor: "#FFF9E5",
                                        borderRadius: "35px",
                                        color: "#FDCF76",
                                        padding: "10px",
                                    }}
                                />
                                <div className="d-flex flex-column align-items-center row">
                                    <p
                                        className="fs-5"
                                        style={{ color: "#3B4F6F", fontFamily: "serif" }}
                                    >
                                        Tổng tiền
                                    </p>
                                    <h2
                                        className="fs-3"
                                        style={{ fontSize: "24px", color: "#161C25" }}
                                    >
                                        {}
                                    </h2>
                                </div>
                            </Card.Body>
                            <Card.Footer
                                style={{
                                    backgroundColor: "#FDCF76",
                                    paddingTop: "30px",
                                    borderRadius: "14px",
                                }}
                            ></Card.Footer>
                        </Card>
                    </Col>

                    {/* ApexChart Component */}
                    <Col md={7}>
                        <Card className="rounded">
                            <Card.Body>
                                <ApexChart /> {/* Use the ApexChart component */}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Table Component */}
                    <Col md={5}>
                        <Card className=" rounded">
                            <Card.Body>
                                <h5 className="mb-4">Doanh Thu Từ Hóa Đơn</h5>
                                <Table bordered hover striped className="table-custom">
                                    <thead>
                                        <tr>
                                            <th>Hóa Đơn</th>
                                            <th>Phương thức</th>
                                            <th>Ngày</th>
                                            <th>Doanh Thu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments?.map((payment) => (
                                            <tr key={payment.id}>
                                                <td>{payment.id}</td>
                                                <td>{payment.paymentMethod}</td>
                                                <td>{payment.date}</td>
                                                <td>{payment.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
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
