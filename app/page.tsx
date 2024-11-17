import { Container, Row, Col, Image } from "react-bootstrap";
import getLangar from "@/actions/getLangar";
import Details from "@/components/Home";
const Home = async () => {
  const langars = await getLangar();
  return (
    <div className="">
      <Container fluid>
        {/* <Row>
          <Col md={12}>
            <TopCarousel />
          </Col>
        </Row> */}
        <Row>
          <Col md={12}>
            <div>
              <h4 className="text-center my-4 fw-semibold">
                Bhandara Location
              </h4>
            </div>
          </Col>
          {/* <Col>
          <LocationComponent />
          </Col> */}
        </Row>
      </Container>
      <Container fluid>
        <Row>
          <Col md={12}>
            <Details langars={langars} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Home;
