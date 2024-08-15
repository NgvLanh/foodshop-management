import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { BsCurrencyDollar, BsFillCartCheckFill, BsGraphUpArrow, BsPiggyBank } from "react-icons/bs";
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import request from "../../../config/apiConfig";

const ApexChart = ({ data }) => {
    const [state, setState] = useState({
        series: [
            {
                name: "Doanh thu",
                data: data, // Use the passed data
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
                    "Tháng 8",
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
            colors: ["#888DF2"],
            fill: {
                colors: ["#94A2F2"],
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
    const [invoices, setInvoices] = useState([]);
    const [invoicesTotal, setInvoicesTotal] = useState(0);
    const [invoicesCount, setInvoicesCount] = useState(0);
    const [invoicesTotalToDay, setInvoicesTotalToDay] = useState(0);
    const [invoicesCountToDay, setInvoicesCountToDay] = useState(0);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchDataPayments();
    }, []);

    const fetchDataPayments = async () => {
        try {
            const res = await request({
                path: "invoices",
                header: 'Bearer ',
            });

            setInvoices(res);
            setInvoicesCount(res.length);

            const today = new Date().toISOString().split('T')[0];

            let totalToDay = 0;
            let countToDay = 0;

            res.forEach((invoice) => {
                const invoiceDate = new Date(invoice.date).toISOString().split('T')[0];
                if (invoiceDate === today) {
                    totalToDay += invoice.amount;
                    countToDay += 1;
                }
            });

            setInvoicesTotalToDay(totalToDay);
            setInvoicesCountToDay(countToDay);

            const total = res.reduce((acc, invoice) => acc + invoice.amount, 0);
            setInvoicesTotal(total);

            // Prepare data for chart
            const monthlyData = Array(12).fill(0); // Initialize array for 12 months

            res.forEach((invoice) => {
                const month = new Date(invoice.date).getMonth(); // Get month (0-11)
                if (invoice.amount !== 0) {
                    monthlyData[month] += invoice.amount; // Accumulate the amount for each month
                }
            });
            setChartData(monthlyData);
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
                    <Col xs={12} style={{ paddingBottom: "20px" }}>
                        <span
                            className="til1"
                            style={{ fontWeight: "bold", color: "#394064" }}
                        >
                            Doanh Thu Hôm Nay
                        </span>
                    </Col>

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
                                        Hoá đơn hôm nay
                                    </p>
                                    <h2
                                        className="fs-3"
                                        style={{ fontSize: "24px", color: "#161C25" }}
                                    >
                                        {invoicesCountToDay}
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
                                        Doanh thu hôm nay
                                    </p>
                                    <h2
                                        className="fs-3"
                                        style={{ fontSize: "24px", color: "#161C25" }}
                                    >
                                        {invoicesCount !== 0 &&
                                            invoicesTotalToDay.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
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
                                        {invoices.length}
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
                                        backgroundColor: "#FFE4E4",
                                        borderRadius: "35px",
                                        color: "#F93B5B",
                                        padding: "10px",
                                    }}
                                />
                                <div className="d-flex flex-column align-items-center row">
                                    <p
                                        className="fs-5"
                                        style={{ color: "#3B4F6F", fontFamily: "serif" }}
                                    >
                                        Tổng doanh thu
                                    </p>
                                    <h2
                                        className="fs-3"
                                        style={{ fontSize: "24px", color: "#161C25" }}
                                    >
                                        {invoicesTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </h2>
                                </div>
                            </Card.Body>
                            <Card.Footer
                                style={{
                                    backgroundColor: "#F93B5B",
                                    paddingTop: "30px",
                                    borderRadius: "14px",
                                }}
                            ></Card.Footer>
                        </Card>
                    </Col>

                    <Col md={7}>
                        <Card className="rounded">
                            <Card.Body>
                                <ApexChart data={chartData} />
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={5}>
                        <Card className="rounded">
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
                                        {invoices.map((payment) => (
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
