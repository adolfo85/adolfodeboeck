import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import css from "./Formulario.css";

function Formulario() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <div className="formcontainer">
      <p>Pasos para realizar la compra:</p>
      <p>1-Llenar el formulario con tus datos personales.</p>
      <p>
        2-Mencionar el/los tracks que quisieras recibir en la casilla "tracks"
      </p>
      <p>
        3-Presionar el botón "send": Al enviar los datos, podemos responder a tu
        correo con el link de cobro
      </p>
      <p>4-Una vez acreditado, enviamos los links de descarga. </p>

      <Form netlify noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>First name/Nombre</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="First name/Nombre"
              defaultValue="Mark"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Last name/Apellido</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Last name/Apellido"
              defaultValue="Otto"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" placeholder="City" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Tracks que deseas obtener:</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form.Group>

          <Form.Group
            className="mb-4 md-4 mr-6"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Email </Form.Label>
            <Form.Control type="email" placeholder="name@example.com" />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3">
          <Form.Check
            required
            label="Agree to terms and conditions"
            feedback="You must agree before submitting."
            feedbackType="invalid"
          />
        </Form.Group>
        <Button type="submit">Submit form</Button>
      </Form>
    </div>
  );
}

export default Formulario;
