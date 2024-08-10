import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import request from '../../../config/apiConfig';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';

const User = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fillDataUser();
  }, []);

  const fillDataUser = async () => {
    try {
      const res = await request({
        path: 'users',
        header: 'Bearer '
      });
      setUsers(res);
    } catch (error) {
      alert(error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await request({
        method: 'DELETE',
        path: `users/${userId}`
      });
      setUsers(users.filter((user) => user.id !== userId));
      toast.success('user deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
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

  const handleToggleActive = async (userId) => {
    const user = users.find((c) => c.id === userId);
    const updatedUser = { ...user, activated: !user.activated };

    try {
      await request({
        method: 'PUT',
        path: `users/${userId}`,
        data: updatedUser
      });
      setUsers(users.map((user) =>
        user.id === userId ? updatedUser : user
      ));
      toast.success('user status updated');
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user?.phoneNumber?.includes(search)
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
          <Card className='rounded-0'>
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
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.fullName}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{user.email}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={user.activated}
                          onChange={() => handleToggleActive(user.id)}
                        />
                      </td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => confirmDelete(user.id)}>
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

export default User;
