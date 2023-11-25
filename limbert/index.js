import React from 'react'
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const data = [
  {filename: "cuhk-2013.jpg", year:2013, remarks: "Sunset over CUHK"}, 
  {filename: "cuhk-2017.jpg", year:2017, remarks: "Bird's-eye view of CUHK"},
  {filename: "sci-2013.jpg", year:2013, remarks: "The CUHK Emblem"}, 
  {filename: "shb-2013.jpg", year:2013, remarks: "The Engineering Buildings"},
  {filename: "stream-2009.jpg", year:2009, remarks: "Nature hidden in the campus"},
  ];

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={auth: false, name: ''}
  }
  componentWillMount(){
    console.log('start')
    axios.get('http://localhost:8081')
    .then(res => {
      if(res.data.Status === "Login"){
        this.setState({auth: true});
      } else {
        this.setState({auth: false});
      }
        
    })
  }
  handleLogout(e){
    axios.defaults.withCredentials = true;
    console.log("send");
    axios.get('http://localhost:8081/Logout')
    .then(res => {
      console.log(res.data.Status);
      if(res.data.Status === "Logout"){
        window.location.reload('/');
      } else {
        alert("error");
      }
    }).catch( err => console.log(err))
  }
  render() {
    return (
      <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav col-auto">
            <li className="nav-item"> <Link className="nav-link" to="/">Home</Link> </li>
            <li className="nav-item"> <Link className="nav-link" to="/Gallery">Gallery</Link> </li>
            <li className="nav-item"> <Link className="nav-link" to="/Slideshow">Slideshow</Link> </li>
            <li className="nav-item"> <Link className="nav-link" to="/Login">Login</Link></li>
          </ul>
          <div style={this.state.auth ? {display: "inline-block"} : {display: "none"}}>
            <ul className="navbar-nav col-auto ml-auto">
            <li className="nav-link"><Link className="nav-link" to="/admin">admin</Link></li>
            <li className="nav-item"><button className="nav-link" onClick={(e) => this.handleLogout(e)}>logout</button></li>
            </ul>
          </div>
        </div>
        </nav>
        <hr />

        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/Gallery" element={<Gallery name="CUHK pictures"  />} />
          <Route path="/Slideshow" element={<Slideshow />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

class Home extends React.Component {
  render() {
    return (
      <>
    <h2>Home</h2>
    <img src='Component_diagram.png' alt="component diagram" className="w-100" />
    </>
    )
  }
}

class Gallery extends React.Component{
  render(){
      return(
          <>
              <Title name={this.props.name}/>
              <Galleryslot />
              
          </>
      )
  }
}

class Title extends React.Component {
  render() {
      return (
          <header className="bg-warning">
              <h1 className="display-4 text-center">{this.props.name}</h1>
          </header>
      );
  }
}

class Galleryslot extends React.Component {
  render() {
      return (
          <main className="container" >
              {data.map((file,index) => <FileCard i={index} key={index}/>)}
          </main>
      );
  }
}

class FileCard extends React.Component {
  
  constructor(props) {
      super(props);
      this.state = { selected: -1 };
      }
  
  handleClick(index, e) {
      if (this.state.selected !== index) {
          this.setState({ selected: index });
        } else {
          this.setState({ selected: -1 });
        }
  }

  render() {
      let i = this.props.i;
      return (
              <div className="card d-inline-block m-2" style={{width:this.state.selected===i ? 400 : 200}} onMouseEnter={(e) => this.handleClick(i, e)} onMouseLeave={(e) => this.handleClick(i, e)}>
                  <img src={"images/"+data[i].filename} alt={"images/"+data[i].remarks} className="w-100" />
                  <div className="card-body">
                      <h6 className="card-title">{data[i].filename}</h6>
                      <p className="card-text">{data[i].year}</p>
                  </div>
              </div>
      );
  }
}

class Slideshow extends React.Component {
  render() {
    return(
    <>
      <Slideslot />
    </>
    )
  }
}

class Slideslot extends React.Component{
  render(){
    return(
      <main className="slider">
        <Slidecard />
      </main>
    )
  }
}

class Slidecard extends React.Component{
  constructor(props) {
    super(props);
    this.state = {currentImageID: 0,intervalID: 0,speed: 1500}; // initialization
  }
  nextslide = () => {
    this.setState({currentImageID: this.state.currentImageID === data.length-1? 0 : this.state.currentImageID+1})
    console.log(this.state.speed)
  }
  Autoplay(event) {
    if(event===1){
      this.setState({intervalID: setInterval(this.nextslide, this.state.speed)})
        }else{
      clearInterval(this.state.intervalID)
      this.setState({intervalID: 0})
    }
    }
  Speedcontrolfast(event){
      this.setState({speed: this.state.speed-200 < 200 ? 200 : this.state.speed-200})
    if(this.state.intervalID !== 0){
      clearInterval(this.state.intervalID)
      this.setState({intervalID: 0})
    }
    this.Autoplay()
  }
  Speedcontrolslow(event){
    this.setState({speed: this.state.speed+200 > 60000 ? 60000 : this.state.speed+200})
  if(this.state.intervalID !== 0){
    clearInterval(this.state.intervalID)
    this.setState({intervalID: 0})
  }
  this.Autoplay()
}
  shuffslide = () => {
    this.setState({currentImageID: Math.floor((Math.random()*10)%5)})
  }
  Shuffleplay(event){
    this.setState({intervalID: setInterval(this.shuffslide, this.state.speed)})
  }
  render(){
    return( 
      <><header>
        <div>
          <button type="button" className="btn btn-primary" onClick={(e) => this.Autoplay(1)}>Start slideshow</button>
          <button type="button" className="btn btn-secondary" onClick={(e) => this.Autoplay(0)}>Stop slideshow</button>
          <button type="button" className="btn btn-success" onClick={(e) => this.Speedcontrolfast(e)}>Faster</button>
          <button type="button" className="btn btn-danger" onClick={(e) => this.Speedcontrolslow(e)}>Slower</button>
          <button type="button" className="btn btn-warning" onClick={(e) => this.Shuffleplay(e)}>Shuffle</button>
        </div>
      </header>
      <div id="carouselExampleSlidesOnly" className="carousel slide" data-ride="carousel">
      <div className="carousel-inner" style={{ width: "600px" }}>
        <div className="carousel-item active">
          <img src={"images/" + data[this.state.currentImageID].filename} alt={"images/"+data[this.state.currentImageID].remarks} className="w-100" />
          <div className="carousel-caption d-none d-md-block">
          <h2 className="card-title">{data[this.state.currentImageID].filename}</h2></div>
          </div>
      </div>
      </div></>
      
    );
  }
}

class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state={loginID: '', loginpwd: ''}

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })      
  }

  handleSubmit(e) {
    axios.defaults.withCredentials = true;
    e.preventDefault();
    
    axios.post('http://localhost:8081/Login', this.state)
    .then(res => {
      if(res.data.Status === "Login"){
        window.location.href = '/admin';
      } else {
        alert(res.data.Message)
      }
    })
    .catch(err => console.log(err));
    //let data = await response.text();
    //console.log(data)
    
  }
  
  render(){
    
    return(
      <>
      <h1>Login</h1>
      <p>Click the submit button to send a request to the server</p>
      <form id="myForm" onSubmit={this.handleSubmit}>
        <label htmlFor="loginID">Login ID:</label>
        <input type="text" name='loginID' value={this.state.loginID} onChange={this.handleChange}></input>
        <br />
        <label htmlFor="loginID">Login password:</label>
        <input type="password" name="loginpwd" value={this.state.loginpwd} onChange={this.handleChange}></input>
        <br />
        <input type="submit" value="Submit" />
      </form>
      </>
    );
}
}

class Admin extends React.Component{
  constructor(props){
    super(props);
    this.state={auth: false, name: ''}
  }
  componentDidMount(){
    console.log('start')
    axios.get('http://localhost:8081')
    .then(res => {
      if(res.data.Status === "Login"){
        this.setState({auth: true});
        this.setState({name: res.data.name});
      } else {
        this.setState({auth: false});
      }
    })
  }
  render(){

    return(
      <>
      { this.state.auth ?
        <div id="admin">You are admin
        </div>
        :
        <div id="admin">You are not admin
        </div>
      }
      </>
      
    )
  }
}

function NoMatch() {
    let location = useLocation();
    return (
    <div>
    <h3> No Match for <code>{location.pathname}</code></h3>
    </div>
    );
}

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App />);

