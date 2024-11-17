"use client";
import { Container, Row, Col } from "react-bootstrap";
import LangarForm from "./Form";
import About from "./About";
const Upload = () => {
  return (
    <div className="">
      <Container>
        <Row>
          <Col md={6}>
            <About />
          </Col>
          <Col md={6}>
            <LangarForm />
          </Col>
          <Col md={12}>
          <div>
            <p className="text-center fw-semibold mt-3"> Note :- कृपा करके इस पर किसी भी प्रकार की गलत जानकारी या चित्र ना डाले ये आप सभी के लिए है</p>
          </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Upload;
