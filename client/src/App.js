import './App.css';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function MainNav(){
  return(
    <Navbar bg="dark" variant="dark" expand="lg" className='MainNav'>
      <Container fluid>
        <Navbar.Brand href="#home">Spotify Profile Viewer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

function App() {
  return (
    <div className="App">
      <MainNav />
      <body>
        aaaa
      </body>
    </div>
  );
}

export default App;
