import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HikeNew = () => {
  const [hike, setHike] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setHike({ ...hike, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files);
  };

  const submitHike = async (formData) => {
    const response = await axios.post("http://localhost:3000/hikes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("hike[title]", hike.title);
    formData.append("hike[location]", hike.location);
    formData.append("hike[price]", hike.price);
    formData.append("hike[description]", hike.description);
    if (image) {
      Array.from(image).forEach((file) => {
        formData.append("image", file);
      });
    }

    try {
      await submitHike(formData);
      navigate("/hikes");
    } catch (error) {
      console.error("Error creating hike:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        New Hike
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Box mb={2}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                required
                name="title"
                value={hike.title}
                onChange={handleChange}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Location"
                variant="outlined"
                fullWidth
                required
                name="location"
                value={hike.location}
                onChange={handleChange}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Hike Price"
                variant="outlined"
                fullWidth
                required
                name="price"
                type="text"
                value={hike.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                required
                name="description"
                multiline
                rows={4}
                value={hike.description}
                onChange={handleChange}
              />
            </Box>
            <Box mb={2}>
              <Typography variant="body1">Choose Images</Typography>
              <input
                type="file"
                id="image"
                name="image"
                multiple
                onChange={handleFileChange}
              />
            </Box>
            <Box mb={2}>
              <Button
                variant="contained"
                color="success"
                type="submit"
                fullWidth
              >
                Add Hike
              </Button>
            </Box>
          </form>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/hikes")}
          >
            All Hikes
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HikeNew;
