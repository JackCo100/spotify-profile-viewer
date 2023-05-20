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
          <Card>
              <Card.Header> Step 1: Spotify Log In</Card.Header>
              <Card.Body>
                <Card.Text>
                  <Login />
                  <br /><br />
                  <h5><b>Permission information</b></h5>
                  <b>View Spotify account data</b> - allows this app to access your profile in order to create a playlist.<br />
                  <b>Create, edit and follow playlists</b> - allows this app to create your personalized playlist and save it to your profile.        
                  <p>Permission can be revoked <a href='https://www.spotify.com/uk/account/apps/'> here</a> by clicking "Remove Access" for "Route Playlist Generator".</p>  
                </Card.Text>
              </Card.Body>
            </Card>
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

                </Card.Body>
              </Card>
            </Col>
            </Row>
        </Container>
    );
}


function App() {
  return (
    <div className="App">
      <MainNav />
      <body>
        <LoginCard />
        
      </body>
    </div>
  );
}

export default App;
