import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../img/Logo2.png';
import './Nav.css';

function Navegador() {
  return (
    <Navbar className='mr-1 shadow-sm bg-white rounded mb-2' bg="white" expand="lg" shadow>
      <Container className='navcontainer'>
        <Navbar.Brand href="#home">
          <img
            src={logo}
            width="40"
            height="40"
            className="logo d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        <Navbar.Brand href="/">Adolfo C. De Boeck</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto text-center nav-centered"> {/* Se agrega la clase "nav-centered" */}
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href='/about'>About me</Nav.Link>
            <Nav.Link href="/dataanalytics">Data Analytics</Nav.Link>
            <Nav.Link href="/mern">MERN projects</Nav.Link>
            <Nav.Link href="/composition">Composition</Nav.Link>
            <Nav.Link href="/mern">Jazz guitar project</Nav.Link>
            <Nav.Link href="/mern">Other projects</Nav.Link>
            <Nav.Link href="/mern">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navegador;
