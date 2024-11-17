import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
const Footer = () => {
  return (
    <div className="p-4 bg-light">
      <Container >
        <Row>
          {/* <Col md={4}>
            <div className="flex justify-center items-center flex-col">
              <Image
                src="/logo.png"
                alt="mansa devi"
                className="me-5 my-1"
                width={70}
                height={130}
                objectFit="cover"
              />
            </div>
          </Col> */}
        </Row>
        <hr />
        <div className="my-1 text-center fw-bold">© 2024 Langar Website</div>
      </Container>
    </div>
  );
};

export default Footer;
