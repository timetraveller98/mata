"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Carousel, Image } from "react-bootstrap";

const TopCarousel = () => {
  const [imageSrc, setImageSrc] = useState({
    img1: "/1.png",
    img2: "/2.png",
  });
  useEffect(() => {
    const updateImageSrc = () => {
      if (window.innerWidth < 480) {
        setImageSrc({
          img1: "/4.png",
          img2: "/5.png",
        });
      } else {
        setImageSrc({
          img1: "/1.png",
          img2: "/2.png",
        });
      }
    };
    updateImageSrc();
    window.addEventListener("resize", updateImageSrc);
    return () => window.removeEventListener("resize", updateImageSrc);
  }, []);

  return (
    <div style={{ backgroundColor: "#f2c409" }}>
      <Carousel>
        <Carousel.Item interval={2000}>
          <Link href={"/"} style={{ textDecoration: "none", color: "black" }}>
            <Image src={imageSrc.img1} alt="banner1" fluid />
          </Link>
        </Carousel.Item>
        <Carousel.Item interval={2000}>
          <Link href={"/"} style={{ textDecoration: "none", color: "black" }}>
            <Image src={imageSrc.img2} alt="banner2" fluid />
          </Link>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default TopCarousel;
