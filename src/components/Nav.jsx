import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../img/Logo.png'
// import About from '../pages/About';
// import { NavLink } from "react-router-dom";
// import { Link } from "react-router-dom";


function Navegador() {
  return (
    <Navbar className='mr-2 shadow-sm bg-white rounded  mb-2' bg="white" expand="lg" shadow>
      <Container >
      <Navbar.Brand href="#home">
            <img
              src= {logo}
              width="90'"
              height="40"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
        <Navbar.Brand href="#home">Adolfo C. De Boeck  </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href='/about'>About me</Nav.Link>
            <Nav.Link href="/link">Data Analytics</Nav.Link>
            <Nav.Link href="/link">Composition</Nav.Link>
            <Nav.Link href="/link">Other projects</Nav.Link>
            <Nav.Link href="/link">Contact</Nav.Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navegador;