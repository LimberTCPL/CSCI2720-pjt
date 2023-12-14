import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import coverVid from '../vid/coverVid.mp4';
import '../style.css';
import styles from './componentStyle/home.module.css';

class Home extends Component {
    constructor(){
      super()
      this.handleChange = this.handleChange.bind(this)
    }
  
    handleChange() {
      this.props.handleChange();
      console.log('hi')
    }
      render() {
          return (
              <>
              <div style={{position: 'relative'}}>
                <div style={{
                  position: 'relative',
                  height: "0",
                  zIndex: "-1",}}>
                  <video className='videoTag' autoPlay loop muted style={{width: '100vw', height: '100vh', display:'flex', position: 'absolute'}}>
                  <source src={coverVid} type='video/mp4'/>
                  Your browser does not support the video tag.
                  </video>
                </div>
    
                <div style={{position: 'relative'}}>
                  <nav class="nav flex-column-expand-lg bg-light" style={{marginLeft: '8vw', marginTop: '5vh', display: 'inline-block', padding: '0', position: 'sticky', height: 0}}>
                    <ul class ="navbar-nav ">
                      {/*<li style={{height: '8vh', width: '12vw', justifyContent: 'center', alignItems: 'center', fontSize: '1.5vw', margin: '0.5vh', padding: 0, borderRadius: '2vh', border: 0, position: 'sticky'}}><Link class="nav-link" to="/" >Home</Link></li>*/}
                      <li class={styles.homeNavButtons} onClick={this.handleChange}><Link class="nav-link" to="/map">Map</Link></li>
                      <li class={styles.homeNavButtons} onClick={this.handleChange}><Link class="nav-link" to="/locations">Locations</Link></li>
                      <li class={styles.homeNavButtons} onClick={this.handleChange}><Link class="nav-link" to="/events">Events</Link></li>
                    </ul>
                  </nav> 
                  <h1 style={{marginTop: '90vh', zIndex: '100', float: 'right', paddingRight: '8vw', fontSize: "3vw", color:'purple'}}>Modern Event-Location System</h1>
                </div>
              </div>
              </>
          )
      }
}

export default Home;