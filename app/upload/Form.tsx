"use client";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DistrictState from "@/app/utils/state.json";
import toast from "react-hot-toast";
import app from "@/app/libs/firebase";
const LangarForm = () => {
  const [img, setImg] = useState<File | null>(null);
  const [imgPerc, setImgPerc] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [puri, setPuri] = useState(false);
  const [roti, setRoti] = useState(false);
  const [dal, setDal] = useState(false);
  const [kadi, setKadi] = useState(false);
  const [chhole, setChhole] = useState(false);
  const [chawal, setChawal] = useState(false);
  const [biryani, setBiryani] = useState(false);
  const [kaddu, setKaddu] = useState(false);
  const [halwa, setHalwa] = useState(false);
  const [kheer, setKheer] = useState(false);
  const [paneer, setPaneer] = useState(false);
  const [gobhi, setGobhi] = useState(false);
  const [aloo, setAloo] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [time, setTime] = useState("Afternoon");
  const [state, setState] = useState("Haryana");
  const [district, setDistrict] = useState("Panchkula");
  const [pincode, setPincode] = useState("134116");
  const [loading, setLoading] = useState(false);
  
  const [errorName, setErrorName] = useState(false);
  const [errorAddress, setErrorAddress] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [errorDistrict, setErrorDistrict] = useState(false);
  const [errorTime, setErrorTime] = useState(false);
  const [errorPincode, setErrorPincode] = useState(false);
  const router = useRouter();

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setErrorName(event.target.value.trim() === "");
  };
  const handleAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
    setErrorAddress(event.target.value.trim() === "");
  };

  const handleState = (event: any) => {
    setState(event.target.value);
    setErrorState(event.target.value.trim() === "");
  };

  const handleDistrict = (event: any) => {
    setDistrict(event.target.value);
    setErrorDistrict(event.target.value.trim() === "");
  };

  const handleTime = (event: any) => {
    setTime(event.target.value);
    setErrorTime(event.target.value.trim() === "");
  };
  const handlePincode = (event: any) => {
    setPincode(event.target.value);
    setErrorPincode(event.target.value.trim() === "");
  };

  useEffect(() => {
    if (img) {
      uploadFile(img, "imgUrl");
    }
  }, [img]);

  const uploadFile = (file: File, fileType: string) => {
    const storage = getStorage(app);
    const folder = fileType === "imgUrl" ? "langar/" : "other/";
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, folder + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgPerc(Math.round(progress));

        switch (snapshot.state) {
          case "paused":
            break;
          case "running":
            break;
          default:
            break;
        }
      },
      (error) => {
        console.error("Upload error: ", error);
        switch (error.code) {
          case "storage/unauthorized":
            toast.error("You don't have permission to upload this file.");
            break;
          case "storage/canceled":
            toast.error("File upload canceled.");
            break;
          case "storage/unknown":
            toast.error("An unknown error occurred.");
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
        });
      }
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorName(name.trim() === "");
    setErrorState(state.trim() === "");
    setErrorDistrict(district.trim() === "");
    setErrorAddress(address.trim() === "");
    setErrorTime(time.trim() === "");
    setErrorPincode(pincode.trim() === "");
    try {

      if (
        name.trim() === "" ||
        address.trim() === "" ||
        state.trim() === "" ||
        time.trim() === "" ||
        pincode.trim() === "" ||
        district.trim() === ""
      ) {
        return toast.error("These field are required");
      }
      let response = await fetch("/api/langar", {
        method: "POST",
        body: JSON.stringify({
          puri,
          roti,
          dal,
          kadi,
          chhole,
          chawal,
          biryani,
          kaddu,
          halwa,
          kheer,
          paneer,
          gobhi,
          aloo,
          name,
          address,
          time,
          state,
          district,
          pincode,
          imgUrl,
        }),
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      if (response.ok) {
        toast.success("Succesfully Added");
        router.push("/");
        router.refresh()
      } else if (
        response.status === 400 ||
        response.status === 404 ||
        response.status === 411 ||
        response.status === 409 ||
        response.status === 410
      ) {
        const errorMessage =
          responseData.message || "An unexpected error occurred.";
        toast.error(errorMessage);
      } else {
        const errorMessage =
          responseData.message || "An unexpected error occurred.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <Container fluid>
        <Row className="border shadow my-3 py-4 rounded px-4">
          <Col md={12}>
            <h5 className="fw-semibold text-center">Upload Bhandara Detail</h5>
          </Col>

          <Col md={6}>
            <TextField
              fullWidth
              value={name}
              onChange={handleName}
              error={errorName}
              label="Bhandara Name"
              variant="outlined"
              type="text"
              autoComplete="off"
              className="m-1 my-3"
              required
            />
          </Col>
          <Col md={6}>
            <TextField
              fullWidth
              value={address}
              onChange={handleAddress}
              error={errorAddress}
              label="Address"
              variant="outlined"
              type="text"
              autoComplete="off"
              className="m-1 my-3"
              required
            />
          </Col>
          <Col md={6}>
            <FormControl
              fullWidth
              className="m-1 my-3"
              required
              variant="outlined"
              error={errorState}

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
          <Col md={6}>
            <FormControl
              fullWidth
              className="m-1 my-3"
              disabled={!state}
              variant="outlined"
              required
              error={errorDistrict}
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
          <Col md={6}>
            <TextField
              fullWidth
              value={pincode}
              onChange={handlePincode}
              error={errorPincode}
              label="Pincode"
              variant="outlined"
              type="text"
              autoComplete="off"
              className="m-1 my-3"
              required
            />
          </Col>
          <Col md={6}>
            <FormControl
              fullWidth
              className="m-1 my-3"
              required
              variant="outlined"
              error={errorTime}
            >
              <InputLabel id="state-label">Time</InputLabel>
              <Select
                labelId="state-label"
                id="state-select"
                value={time}
                label="Time"
                required
                onChange={handleTime}
                error={errorTime}
              >
                <MenuItem value="Morning">Morning</MenuItem>
                <MenuItem value="Afternoon">Afternoon</MenuItem>
                <MenuItem value="Evening">Evening</MenuItem>
              </Select>
            </FormControl>
          </Col>
          <Col md={12}>
          <p className="ms-1  mt-2 fw-semibold">Roti</p>
          <p className="text-[13px]">
            अगर भंडारे में पूरी है तो पूरी के ऑप्शन पर टिक करें या अगर रोटी है तो रोटी के ऑप्शन पर टिक करें और दोनो है तो दोनो को टिक करें</p>
          </Col>
          <Col md={12}>
          <FormControlLabel control={<Checkbox onChange={(e) => {setRoti(e.target.checked)}} />} label="Roti" />
          <FormControlLabel control={<Checkbox onChange={(e) => {setPuri(e.target.checked)}} />} label="Puri" />
          </Col>
          <Col md={12}>
          <p className="ms-1 mt-2 fw-semibold">Chawal</p>
          <p className="text-[13px]">
          अगर भंडारे में चावल है तो चावल के ऑप्शन पर टिक करें या अगर बिरयानी है तो बिरयानी के ऑप्शन पर टिक करें और दोनो है तो दोनो को टिक करें</p>
          </Col>
          <Col md={12}>
          <FormControlLabel control={<Checkbox onChange={(e) => {setChawal(e.target.checked)}} />} label="Chawal" />
          <FormControlLabel control={<Checkbox onChange={(e) => {setBiryani(e.target.checked)}} />} label="Biryani" />
          </Col>
          <Col md={12}>
          <p className="ms-1  mt-2 fw-semibold">Dal</p>
          <p className="text-[13px]">
          अगर भंडारे में दाल है तो दाल के ऑप्शन पर टिक करें या अगर कढ़ी है तो कढ़ी के ऑप्शन पर टिक करें और दोनो है तो दोनो को टिक करें</p>
          </Col>
          <Col md={12}>
          <FormControlLabel control={<Checkbox onChange={(e) => {setDal(e.target.checked)}} />} label="Daal" />
          <FormControlLabel control={<Checkbox onChange={(e) => {setKadi(e.target.checked)}} />} label="Kadhi" />
          </Col>
          <Col md={12}>
          <p className="ms-1 mt-2 fw-semibold">Sabji</p>
          <p className="text-[13px]">
          भंडारे में चल रही सब्जी पर टिक करें</p>
          </Col>
          <Col md={12}>
          <FormControlLabel control={<Checkbox onChange={(e) => {setAloo(e.target.checked)}}/>} label="Aloo" />
          <FormControlLabel control={<Checkbox onChange={(e) => {setChhole(e.target.checked)}}/>} label="Chhole" />
          <FormControlLabel control={<Checkbox onChange={(e) => {setGobhi(e.target.checked)}}/>} label="Mix Veg" />
          <FormControlLabel control={<Checkbox onChange={(e) => {setPaneer(e.target.checked)}}/>} label="Paneer" />
          <FormControlLabel control={<Checkbox onChange={(e) => {setKaddu(e.target.checked)}}/>} label="Kaddu" />
          </Col>
          <Col md={12}>
          <p className="ms-1 mt-2 fw-semibold">Sweet</p>
          <p className="text-[13px]">
          अगर भंडारे में हलवा है तो हलवा के ऑप्शन पर टिक करें या अगर खीर है तो खीर के ऑप्शन पर टिक करें और दोनो है तो दोनो को टिक करें</p>
          </Col>
          <Col md={12}>
          <FormControlLabel control={<Checkbox onChange={(e) => {setHalwa(e.target.checked)}} />} label="Halwa" />
          <FormControlLabel control={<Checkbox onChange={(e) => {setKheer(e.target.checked)}} />} label="Kheer" />
          </Col>
          <Col md={12}>
            <div className="my-3 text-dark">
              <label htmlFor="img" className="text-dark me-3">
                Langar Location Image :{" "}
              </label>{" "}
              {imgPerc > 0 && "Uploading: " + imgPerc + "%"}
              <input
                type="file"
                accept="image/*"
                className="text-dark"
                id="img"
                required
                onChange={(e: any) => setImg(e.target.files?.[0])}
              />
            </div>
          </Col>
          <Col md={12}>
            <div className="d-flex justify-content-center align-items-center">
              <Button
                variant="contained"
                color="inherit"
                className="mt-4"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default LangarForm;
