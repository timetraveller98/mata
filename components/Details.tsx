"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import DistrictState from "@/app/utils/state.json";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getStorage, deleteObject, ref, listAll } from "firebase/storage";
import app from "@/app/libs/firebase";
import axios from "axios";
import { Langar } from "@prisma/client";

const Details = () => {
  const [langars, setLangars] = useState<Langar[]>([]);
  const [state, setState] = useState<string>("");
  const [district, setDistrict] = useState<string>("");

  // Fetch langars data
  useEffect(() => {
    const fetchLangars = async () => {
      try {
        const response = await axios.get("/api/langar");
        setLangars(response.data.data);
      } catch (error: any) {
        const errorMessage = error.response
          ? error.response.data.message
          : error.message;
        console.error("Error fetching langars:", errorMessage);
      }
    };

    fetchLangars();
  }, []);

  // Filter langars based on state and district
  const filtered = langars.filter((langar) => {
    const matchesState = !state || langar.state === state;
    const matchesDistrict = !district || langar.district === district;
    return matchesState && matchesDistrict;
  });

  const handleState = (event: any) => {
    setState(event.target.value as string);
    setDistrict("");
  };

  const handleDistrict = (event: any) => {
    setDistrict(event.target.value as string);
  };

  // Delete outdated data and images
  useEffect(() => {
    const deleteData = async () => {
      try {
        const res = await fetch("/api/remove", { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete data.");
        await res.json();
      } catch (error) {
        console.error("Failed to delete data:", error);
      }
    };

    const deleteImage = async () => {
      try {
        const existingImageUrls = langars
          .filter((item) => item.imgUrl)
          .map((item) => item.imgUrl);

        const storage = getStorage(app);
        const storageRef = ref(storage, "");
        const allImages = await listAll(storageRef);

        const deletePromises = allImages.items.map(async (imageRef) => {
          if (!existingImageUrls.includes(imageRef.fullPath)) {
            await deleteObject(imageRef);
            console.log("Image deleted from Firebase:", imageRef.fullPath);
          }
        });

        await Promise.all(deletePromises);
        console.log("Unused images have been deleted.");
      } catch (error) {
        console.error("Error during image deletion:", error);
      }
    };

    deleteData();
    deleteImage();
  }, [langars]);

  return (
    <div>
      <Container>
        <Row>
          <Col xs={6}>
            <FormControl fullWidth className="m-1 my-3" variant="outlined">
              <InputLabel id="state-label">State</InputLabel>
              <Select
                labelId="state-label"
                id="state-select"
                value={state}
                onChange={handleState}
                label="State"
              >
                {DistrictState.map((item) => (
                  <MenuItem value={item.state} key={item.state}>
                    {item.state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Col>
          <Col xs={6}>
            <FormControl
              fullWidth
              className="m-1 my-3"
              variant="outlined"
              disabled={!state}
            >
              <InputLabel id="district-label">District</InputLabel>
              <Select
                labelId="district-label"
                id="district-select"
                value={district}
                onChange={handleDistrict}
                label="District"
              >
                {DistrictState.find(
                  (item) => item.state === state
                )?.districts.map((data) => (
                  <MenuItem value={data} key={data}>
                    {data}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          {filtered.length === 0 ? (
            <Col>
              <div className="text-center my-4">
                <h4>No bhandara in your area</h4>
              </div>
            </Col>
          ) : (
            filtered.map((item) => (
              <Col md={4} key={item.id}>
                <div className="border shadow bg-blue-50 p-3 my-3 rounded">
                  <div className="flex justify-center items-center">
                    <Image
                      src={item.imgUrl || "/langar.jpg"}
                      alt={item.name}
                      width={400}
                      height={400}
                      className=" py-3 object-cover"
                      fluid
                    />
                  </div>
                  <div className="my-2">
                    <h6>
                      <span className="fw-semibold"> Bhandara Name : </span>
                      {item.name}
                    </h6>
                    <h6>
                      <span className="fw-semibold">Address :</span>{" "}
                      {item.address}, {item.district}, {item.state},
                      {item.pincode}
                    </h6>
                    <h6>
                      <span className="fw-semibold"> Timing : </span>
                      {item.time}
                    </h6>
                    <h6>
                      <span className="fw-semibold"> Roti : </span>
                      {item.roti && item.puri
                        ? "Roti, Puri"
                        : item.roti
                        ? "Roti"
                        : item.puri
                        ? "Puri"
                        : "Roti"}
                    </h6>
                    <h6>
                      <span className="fw-semibold"> Chawal : </span>
                      {item.chawal && item.biryani
                        ? "Chawal, Biryani"
                        : item.chawal
                        ? "Chawal"
                        : item.biryani
                        ? "Biryani"
                        : "Chawal"}
                    </h6>
                    <h6>
                      <span className="fw-semibold">Daal : </span>
                      {item.dal && item.kadi
                        ? "Daal, Kadhi"
                        : item.dal
                        ? "Daal"
                        : item.kadi
                        ? "Kadhi"
                        : "Kadhi"}
                    </h6>

                    <h6>
                      <span className="fw-semibold">Sabji : </span>
                      {[
                        item.chhole && "Chhole",
                        item.kaddu && "Kaddu",
                        item.paneer && "Paneer",
                        item.gobhi && "Mix Veg",
                        item.aloo && "Aloo",
                      ]
                        .filter(Boolean)
                        .map((sabji, index, arr) =>
                          index === arr.length - 1 ? sabji : `${sabji}, `
                        )
                        .join("") || "Chhole"}
                    </h6>

                    <h6>
                      <span className="fw-semibold"> Sweet : </span>
                      {item.halwa && item.kheer
                        ? "Halwa, Kheer"
                        : item.halwa
                        ? "Halwa"
                        : item.kheer
                        ? "Kheer"
                        : "Halwa"}
                    </h6>
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Details;
