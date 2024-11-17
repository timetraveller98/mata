import NavbarData from "./Navbar";
import { Container, Row, Col } from "react-bootstrap";
const Header = () => {
  return (
    <div className="bg-light sticky-top">
    <Container>
      <Row>
        <Col md={12}>
          <NavbarData />
        </Col>
      </Row>
    </Container>
    </div>
  );
};
export default Header;
