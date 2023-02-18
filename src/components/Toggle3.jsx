
import foto from '../img/foto mia color.jpeg'
import './Toogle3.css'

function Toogle3() {
 

  return (
    <>

  <div className='containerdiv container Regular shadow'>

    <div className=' mt-5 row'>

      <img src={foto} className="fotoportada rounded float-right col-lg-7 Regular shadow p-4 mt-3 " alt="..."></img>
    <p className="lead col-lg-5 mt-3"> Mi nombre es Adolfo De Boeck y actualmente recido en San Miguel de Tucumán, Argentina. Estudié la carrera de programación Full Stack en Rolling Code, actualmente me inclino hacia el análisis de datos manejando lenguajes como Phyton, MySQL, así también herramientas como Excel y diferentes formas de visualización de datos. 
Por otro lado, soy odontólogo (UNT) y curso mi cuarto año de cursos de capacitación en ortodoncia en PRODONOA. También Licenciado y Profesor en música orientación composición (UNLP), y participo como colaborador en proyectos de investigación en esa institución. 
Como verás, me apasiona perfeccionarme en diferentes ámbitos y, en algún punto, hacer que todas esas aristas se toquen para sacar lo mejor de mí en cada proyecto.
Mi meta es seguir aprendiendo distintas tecnologías, sobre todo en el área de análisis y ciencia de datos. Creo que esto último nos permite valorar lo que tenemos para, desde ahí, poder crecer, comprender lo que nos rodea, y tomar las decisiones que sean más oportunas en cualquier ámbito. 
        </p>

    </div>
  </div>
    
     
    </>
  );
}
export default Toogle3;