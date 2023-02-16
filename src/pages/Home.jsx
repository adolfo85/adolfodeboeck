import React from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Sonnet from '../components/Sonnet';
import Sonnet1 from '../components/Sonnet1';
import './Home.css'
import Container from 'react-bootstrap/Container';
import Toogle3 from '../components/Toggle3';

const Home = () =>{
    return(

      
      <Container className='fuid homecontainer'>

        <Toogle3 /> 

        
      <div className='guia'> 

      <Tabs
      defaultActiveKey="profile"
      id="fill-tab-example"
      className="mb-3"
      fill
    >
      <Tab eventKey="home" title="¿Qué podés encontrar en esta página?">
        <Sonnet />
      </Tab>
      <Tab eventKey="profile" title="Secciones">
        <Sonnet1 />
      </Tab>
     
    </Tabs>
      </div>

      

        </Container>
    )
    

}

export default Home