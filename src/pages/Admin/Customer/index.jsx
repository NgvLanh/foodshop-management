import { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

const Customer = () => {
  // Dữ liệu giả lập
  const [customers, setCustomers] = useState([
    { id: 1, fullName: 'Nguyen Van A', phoneNumber: '0123456789', email: 'a@example.com', address: '123 Main St', active: true },
    { id: 2, fullName: 'Tran Thi B', phoneNumber: '0987654321', email: 'b@example.com', address: '456 Second St', active: false }
  ]);
  const [search, setSearch] = useState('');

  const handleDelete = (customerId) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId));
    toast.success('Customer deleted successfully');
  };

  const handleToggleActive = (customerId) => {
    setCustomers(customers.map((customer) =>
      customer.id === customerId ? { ...customer, active: !customer.active } : customer
    ));
    toast.success('Customer status updated');
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.phoneNumber.includes(search)
  );

  return (
    <Container fluid style={{ background: '#f7f4f4', height: '100vh' }}>
      <Toaster />
      <Row className="my-4">
        <Col>
          <h2 className="mb-4">Quản Lý Khách Hàng</h2>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo số điện thoại..."
            value={search}
            onChange={handleSearchChange}
            className="mb-4"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ Tên</th>
                    <th>Số Điện Thoại</th>
                    <th>Email</th>
                    <th>Địa Chỉ</th>
                    <th>Hoạt Động</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>{customer.fullName}</td>
                      <td>{customer.phoneNumber}</td>
                      <td>{customer.email}</td>
                      <td>{customer.address}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={customer.active}
                          onChange={() => handleToggleActive(customer.id)}
                        />
                      </td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(customer.id)}>
                          <FaTrash /> Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Customer;
