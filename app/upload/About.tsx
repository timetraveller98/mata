import { Container, Row, Col, Image } from "react-bootstrap";
const About = () => {
  return (
    <div className="">
      <Container fluid>
        <Row className="">
          <Col md={12}>
            <div className="mt-3">
              <div className="flex justify-center items-center">
                <Image src="/ajay.jpg" alt="Ajay Chauhan" width={250} height={250} className="p-2" fluid roundedCircle/>
              </div>
              <div className="mt-5">
                <h6>
                  <span className="fw-semibold">Created By : </span>Er. Ajay Chauhan
                </h6>
                <h6>
                  <span className="fw-semibold">Designation : </span>Sr. Nextjs
                  Developer
                </h6>
                <h6>
                  <span className="fw-semibold">Contact : </span>+91 7087868780
                </h6>
                <h6>
                  <span className="fw-semibold">Email : </span>
                  chuhan718@gmail.com
                </h6>
                <h6>
                  <span className="fw-semibold">Website : </span>alexsolution.in
                </h6>
                <h6>
                  <span className="fw-semibold">Message : </span>Aap kisi bhi
                  prakaar ki website banwaane ke liye contact kar sakte h.
                </h6>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
