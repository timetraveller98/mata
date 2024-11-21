"use client";
import { Langar } from "@prisma/client";
import { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import DistrictState from "@/app/utils/state.json";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getStorage, deleteObject, ref, listAll } from "firebase/storage";
import app from "@/app/libs/firebase";

const Details= ({ langars }:any) => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const filtered = langars.filter((langar: any) => {
    const matchesState = state ? langar.state === state : true;
    const matchesDistrict = district ? langar.district === district : true;
    return matchesState && matchesDistrict;
  });

  const handleState = (event: any) => {
    setState(event.target.value);
  };

  const handleDistrict = (event: any) => {
    setDistrict(event.target.value);
  };

  useEffect(() => {
    const deleteData = async () => {
      try {
        const res = await fetch("/api/remove", { method: "DELETE" });
        await res.json();
      } catch (error) {
        console.error("Failed to delete data:", error);
      }
    };

    const deleteImage = async () => {
      try {
        const existingImageUrls = langars.filter((item:any) => item.imgUrl).map((item:any )=> item.imgUrl);
        const storage = getStorage(app);
        const storageRef = ref(storage, '');
        const allImages = await listAll(storageRef);
        const deletePromises = allImages.items.map(async (imageRef) => {
          if (!existingImageUrls.includes(imageRef.fullPath)) {
            try {
              await deleteObject(imageRef);
              console.log("Image deleted from Firebase:", imageRef.fullPath);
            } catch (error) {
              console.error("Error deleting image from Firebase:", error);
            }
          }
        });
        await Promise.all(deletePromises)
        console.log("All images not referenced in MongoDB have been deleted from Firebase.");
      } catch (error) {
        console.error("Error occurred during the deletion process:", error);
      }
    };
    deleteData();
    deleteImage();
  }, []);
  return (
    <div>
      <Container>
        <Row>
          <Col xs={6}>
            <FormControl
              fullWidth
              className="m-1 my-3"
              required
              variant="outlined"
            >
              <InputLabel id="state-label">State</InputLabel>
              <Select
                labelId="state-label"
                id="state-select"
                value={state}
                label="State"
                required
                onChange={handleState}
              >
                {DistrictState.map((item: any) => (
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
              disabled={!state}
              variant="outlined"
              required
            >
              <InputLabel id="district-label">District</InputLabel>
              <Select
                labelId="district-label"
                id="district-select"
                value={district}
                label="District"
                required
                onChange={handleDistrict}
              >
                {DistrictState.filter((item) => item.state === state).map(
                  (item) =>
                    item.districts.map((data) => (
                      <MenuItem value={data} key={data}>
                        {data}
                      </MenuItem>
                    ))
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
            filtered.map((item:any) => (
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
                        .reduce((acc: any, curr) => acc + curr, "") || "Chhole"}
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
