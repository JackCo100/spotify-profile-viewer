import './App.css';
import React, { useState } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

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
function Login() { //check if logged in to Spotify - then display username if logged in 
  var loggedInCookie = document.cookie
  .split("; ")
  .find((row) => row.startsWith("spotify_token="))
  ?.split("=")[1]; 

  if(loggedInCookie !=null){
    return( "Spotify account connected ✅")
  } else {
    return (
      <a href='http://localhost:5000/login' className="spotify_btn"> Connect to Spotify </a>
    );
  }
  
}
function LoginCard(){
  return(
    <Container fluid>
    <Row>
        <Col sm>
          <Card>
              <Card.Header> Step 1: Spotify Log In</Card.Header>
              <Card.Body>
                <Card.Text>
                  <Login />
                  <br /><br />
                  <h5><b>Permission information</b></h5>
                  <b>View Spotify account data</b> - allows this app to access your profile.<br />
                  <p>Permission can be revoked <a href='https://www.spotify.com/uk/account/apps/'> here</a> by clicking "Remove Access" for "Profile Viewer".</p>  
                </Card.Text>
              </Card.Body>
            </Card>
        </Col>
    </Row>
    </Container>
  )
}

function ResultsCard(props) {
    return(
      <Container fluid>
          <Row>
            <Col sm>
              <Card>
                <Card.Header> Results</Card.Header>
                <Card.Body>
                <p> <a href={props['profile'][0].external_urls.spotify} >{props['profile'][0].display_name}</a> | {props['profile'][0].email} | Spotify {props['profile'][0].product}</p>
                <h2>Your Top Artists</h2>
                <Row xs={1} md={2} className="g-4">
                  {props['profile'][1].items.map((artist, index) => (
                    <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={artist.images[0].url} />
                    <Card.Body>
                      <Card.Title>{index+1}. {artist.name}</Card.Title>
                    </Card.Body>
                  </Card>
                  ))} 
                </Row>
              </Card.Body>
            </Card>
            </Col>
            </Row>
        </Container>
    );
}


function App() {
  const [showResult, setShowResult] = useState(false)
  const [profileData, setProfileData]  = useState([])
  var loggedInCookie = document.cookie
  .split("; ")
  .find((row) => row.startsWith("spotify_token="))
  ?.split("=")[1]; 
  const generate = () => {
    fetch("/profile", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': loggedInCookie
      },
    })
    .then(response => response.json())
    .then( json => setProfileData(json))
    .then(() => setShowResult(true))
  }
  return (
    <div className="App">
      <MainNav />
      <body>
        <Container fluid>
        <LoginCard />
        <button id='testBtn' onClick={generate}>Click</button>
        {showResult && <ResultsCard  profile = {profileData}/>}
        </Container>
      </body>
    </div>
  );
}

export default App;
