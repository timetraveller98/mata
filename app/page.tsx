import { Container, Row, Col } from "react-bootstrap";
import Details from "@/components/Details";
import { NextPage } from "next";

const Home: NextPage = () => {


  return (
    <div>
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={12}>
            <header aria-label="Bhandara location">
              <h4 className="text-center my-4 fw-semibold">Bhandara Location</h4>
            </header>
          </Col>
        </Row>
      </Container>

      <Container fluid>
        <Row>
          <Col md={12}>
            <Details />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
