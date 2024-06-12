'use client';
// pages/index.js
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Navbar, Nav, Card, Dropdown, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [timeframe, setTimeframe] = useState('This Month');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const data = useSelector((state) => state.accountData);
  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Container fluid>
      <Row>
        <Col
          md={2}
          className={`bg-dark text-white min-vh-100 ${sidebarOpen ? '' : 'd-none'}`}
          id="sidebar"
        >
          <Navbar variant="dark">
            <Navbar.Brand href="#home">Dashboard</Navbar.Brand>
          </Navbar>
          <Nav defaultActiveKey="/home" className="flex-column">
            <Nav.Link href="#users" className="text-white">
              Users
            </Nav.Link>
            <Nav.Link href="#properties" className="text-white">
              Properties
            </Nav.Link>
            <Nav.Link href="#devices" className="text-white">
              Devices
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={sidebarOpen ? 10 : 12}>
          <Navbar bg="light" expand="lg" style={{padding:'4px'}}>
            <Button variant="primary" onClick={toggleSidebar} className="me-2">
              <span>
                {' '}
                <FontAwesomeIcon icon={faBars} style={{ width: '20px' }} />{' '}
              </span>
            </Button>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav>
                <div style={{padding:'2px'}}>Hi {data.email}  <FontAwesomeIcon icon={faUser} style={{ width: '20px' }}></FontAwesomeIcon> </div>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Container className="mt-4">
            <Row className="mb-4">
              <Col>
                <Card className="bg-smoke-white">
                  <Card.Body>
                    <Row>
                      <Col>
                        <Card style={{ textAlign: 'center' }}>
                          <h5 style={{ paddingTop: '10px' }}>10,495</h5>
                          <p>Properties</p>
                        </Card>
                      </Col>
                      <Col>
                        <Card style={{ textAlign: 'center' }}>
                          <h5 style={{ paddingTop: '10px' }}>30,942</h5>
                          <p>Properties</p>
                        </Card>
                      </Col>
                      <Col>
                        <Card style={{ textAlign: 'center' }}>
                          <h5 style={{ paddingTop: '10px' }}>45,269</h5>
                          <p>Support Members</p>
                        </Card>
                      </Col>
                      <Col>
                        <Card style={{ textAlign: 'center' }}>
                          <h5 style={{ paddingTop: '10px' }}>20,965</h5>
                          <p>Tags Used</p>
                        </Card>
                      </Col>
                      <Col className="text-end">
                        <Dropdown onSelect={(e) => setTimeframe(e)}>
                          <Dropdown.Toggle variant="secondary">{timeframe}</Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item eventKey="This Month">This Month</Dropdown.Item>
                            <Dropdown.Item eventKey="Last Month">Last Month</Dropdown.Item>
                            <Dropdown.Item eventKey="This Year">This Year</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <h5>Statistics</h5>
                    {/* Insert your chart here */}
                    <p>Chart goes here...</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
