"use client";

import { Langar } from "@prisma/client";
import { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import DistrictState from "@/app/utils/state.json";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getStorage, deleteObject, ref, listAll } from "firebase/storage";
import app from "@/app/libs/firebase";

interface LangarProps {
  langars: Langar[];
}

const Details: React.FC<LangarProps> = ({ langars }) => {
  const [state, setState] = useState<string>("");
  const [district, setDistrict] = useState<string>("");

  const filtered = langars.filter((langar) => {
    const matchesState = !state || langar.state === state;
    const matchesDistrict = !district || langar.district === district;
    return matchesState && matchesDistrict;
  });

  const handleState = (event:any) => {
    setState(event.target.value as string);
    setDistrict(""); // Reset district when state changes
  };

  const handleDistrict = (event:any) => {
    setDistrict(event.target.value as string);
  };

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
                {DistrictState.find((item) => item.state === state)?.districts.map(
                  (data) => (
                    <MenuItem value={data} key={data}>
                      {data}
                    </MenuItem>
                  )
                )}
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
                      className="py-3 object-cover"
                      fluid
                    />
                  </div>
                  <div className="my-2">
                    <h6>
                      <strong>Bhandara Name:</strong> {item.name}
                    </h6>
                    <h6>
                      <strong>Address:</strong> {item.address}, {item.district},{" "}
                      {item.state}, {item.pincode}
                    </h6>
                    <h6>
                      <strong>Timing:</strong> {item.time}
                    </h6>
                    <h6>
                      <strong>Roti:</strong>{" "}
                      {item.roti && item.puri
                        ? "Roti, Puri"
                        : item.roti
                        ? "Roti"
                        : "Puri"}
                    </h6>
                    <h6>
                      <strong>Chawal:</strong>{" "}
                      {item.chawal && item.biryani
                        ? "Chawal, Biryani"
                        : item.chawal
                        ? "Chawal"
                        : "Biryani"}
                    </h6>
                    <h6>
                      <strong>Daal:</strong>{" "}
                      {item.dal && item.kadi
                        ? "Daal, Kadhi"
                        : item.dal
                        ? "Daal"
                        : "Kadhi"}
                    </h6>
                    <h6>
                      <strong>Sabji:</strong>{" "}
                      {[
                        item.chhole && "Chhole",
                        item.kaddu && "Kaddu",
                        item.paneer && "Paneer",
                        item.gobhi && "Mix Veg",
                        item.aloo && "Aloo",
                      ]
                        .filter(Boolean)
                        .join(", ") || "Chhole"}
                    </h6>
                    <h6>
                      <strong>Sweet:</strong>{" "}
                      {item.halwa && item.kheer
                        ? "Halwa, Kheer"
                        : item.halwa
                        ? "Halwa"
                        : "Kheer"}
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
