import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous error
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
      // Redirect to /hikes after successful login
      navigate("/hikes");
    } catch (error) {
      console.error(error);
      setError(error.response?.data.message || "An error occurred");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card sx={{ boxShadow: 3 }}>
          <CardMedia
            component="img"
            image="https://t3.ftcdn.net/jpg/03/99/27/46/360_F_399274698_ybhYwqtuApPlEHs06cqA7IyewtjCmoib.jpg"
            alt="Hike Image"
          />
          <CardContent>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
              onSubmit={handleSubmit}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
