import './App.css';
import React, { useState } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

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
    <Row>
        <Col sm>
          <Card>
              <Card.Header> Step 1: Spotify Log In</Card.Header>
              <Card.Body>
                <Card.Text>
                  <Login />
                  <h2 id='permissions'>Permission information</h2>
                  <b>View Spotify account data</b> - allows this app to access your profile.<br />
                  <p>Permission can be revoked <a href='https://www.spotify.com/uk/account/apps/'> here</a> by clicking "Remove Access" for "Profile Viewer".</p>  
                </Card.Text>
              </Card.Body>
            </Card>
        </Col>
    </Row>
  )
}

function ResultsCard(props) {
    return(
          <Row>
            <Col sm>
              <Card>
                <Card.Header> Results</Card.Header>
                <Card.Body>
                  <p> <a href={props['profile'][0].external_urls.spotify} >{props['profile'][0].display_name}</a> | {props['profile'][0].email} | Spotify {props['profile'][0].product}</p>
                  <h3>Your Top Artists</h3>
                  <Row xs={1} sm={3} md={5} className="g-4">
                    {props['profile'][1].items.map((artist, index) => (
                      <Col>
                        <Card style={{ width: '14rem' }}>
                          <Card.Img variant="top" src={artist.images[0].url} />
                          <Card.Body>
                            <Card.Title>{index+1}. {artist.name}</Card.Title>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))} 
                  </Row>
                  <h3>Your Top Songs</h3>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Position</th>
                        <th>Song Name</th>
                        <th>Artist</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props['profile'][2].items.map((song, index) => (
                        <tr>
                          <td>{index+1}</td>
                          <td>{song.name}</td>
                          <td>{song.artists[0].name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {/* <Row xs={1} md={5} className="g-4">
                    {props['profile'][2].items.map((song, index) => (
                      <Col>
                        <Card style={{ width: '12rem' }}>
                          <Card.Img variant="top" src={song.album.images[0].url} />
                          <Card.Body>
                            <Card.Title>{index+1}. {song.name}</Card.Title>
                            <Card.Text>
                              {song.artists[0].name}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}  
                  </Row>*/}
              </Card.Body>
            </Card>
            </Col>
          </Row>
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
        {showResult === false && <button id='testBtn' onClick={generate}>Click to get your top artists and songs</button>}
        {showResult && <ResultsCard  profile = {profileData}/>}
        </Container>
      </body>
    </div>
  );
}

export default App;
