import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import css from "./Footer.css";


export default function Footer() {
  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted footer'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
   
        

       
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MDBIcon color='secondary' icon='gem' className='me-3' />
                Adolfo C. De Boeck
              </h6>
              <p>
              «El objeto no es hacer arte, es estar en ese maravilloso estado que hace que el arte sea inevitable». – Robert Henri 
              </p>
            </MDBCol>

            

            <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4 footer'>
              <h6 className='text-uppercase fw-bold mb-4'>Links de interés</h6>
              <p>
                <a href='https://www.youtube.com/channel/UCwnQNOW5COOFxgVXi4Yiw-A' className='text-reset footer'>
                  Youtube Channel
                </a>
              </p>
              <p>
                <a href='https://adolfodeboeck.wixsite.com/website' className='text-reset footer'>
                contemporary music
                </a>
              </p>
             
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contacto</h6>
              <p>
                <MDBIcon color='secondary' icon='home' className='me-2' />Tucumán, Argentina.              </p>
              <p>
                <MDBIcon color='secondary' icon='envelope' className='me-3' />adolfodeboeck@gmail.com
              </p>
              <p>
                <MDBIcon color='secondary' icon='phone' className='me-3' /> + 054 3814 138 086 
              </p>
              
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='footer text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2023 Copyright | 
        <a className='footer text-reset fw-bold' href='https://mdbootstrap.com/'>
          Diseño web: Adolfo C. De Boeck
        </a>
      </div>
    </MDBFooter>
  );
}