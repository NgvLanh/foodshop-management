import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import request from '../../../config/apiConfig';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fillDataCustomer();
  }, []);

  const fillDataCustomer = async () => {
    try {
      const fill = await request({
        path: 'customers'
      });
      setCustomers(fill.data);
    } catch (error) {
      console.log('Error get customer:' + error);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await request({
        method: 'DELETE',
        path: `customers/${customerId}`
      });
      setCustomers(customers.filter((customer) => customer.id !== customerId));
      toast.success('Customer deleted successfully');
    } catch (error) {
      toast.error('Failed to delete customer');
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xóa không?',
      buttons: [
        {
          label: 'Có',
          onClick: () => handleDelete(id)
        },
        {
          label: 'Không'
        }
      ]
    });
  };

  const handleToggleActive = async (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    const updatedCustomer = { ...customer, activated: !customer.activated };

    try {
      await request({
        method: 'PUT',
        path: `customers/${customerId}`,
        data: updatedCustomer
      });
      setCustomers(customers.map((customer) =>
        customer.id === customerId ? updatedCustomer : customer
      ));
      toast.success('Customer status updated');
    } catch (error) {
      toast.error('Failed to update customer status');
    }
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
          <Form inline className="mb-4">
            <Form.Control
              type="text"
              placeholder="Tìm kiếm theo số điện thoại..."
              value={search}
              onChange={handleSearchChange}
              className="mr-sm-2"
            />

          </Form>
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
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={customer.activated}
                          onChange={() => handleToggleActive(customer.id)}
                        />
                      </td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => confirmDelete(customer.id)}>
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
