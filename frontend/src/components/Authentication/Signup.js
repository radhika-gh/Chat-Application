import { FormControl, VStack, FormLabel ,Input, useStatStyles, InputGroup, InputRightElement, Button} from '@chakra-ui/react';
import React, { useState } from 'react'
import { useToast } from "@chakra-ui/react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [confirmpassword, setConfirmpassword]=useState("");
    const [password, setPassword]=useState("");
    const [pic, setPic] = useState("");
    const [show, setShow] = useState(false);
    const[loading,setLoading]= useState(false);
    const toast = useToast();
    const handleClick =()=>setShow(!show);
   
    const navigate = useNavigate(); 

const postDetails = (pics) => {
  setLoading(true);
  if (pics === undefined) {
    toast({
      title: "Please Select an Image!",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false); // Reset loading state if no image is selected
    return;
  }

  // Check for valid image types//dw5iiyxin
  if (pics.type === "image/jpeg" || pics.type === "image/png") {
    const data = new FormData()
      data.append("file", pics)
      data.append("upload_preset", "Chatter-Box")
      data.append("cloud_name", "dw5iiyxin");
      axios
        .post("https://api.cloudinary.com/v1_1/dw5iiyxin/image/upload", data)
        .then((response) => {
          console.log("Cloudinary response:", response);
          setPic(response.data.url.toString());
          setLoading(false);
          toast({
            title: "Image uploaded successfully!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((error) => {
          console.log("Cloudinary error:", error);
          setLoading(false);
        });
  } else {
    toast({
      title: "Please Select an Image!",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
    return;
  }
};


const submitHandler = async () => {
  setLoading(true);

  // Trim input fields to avoid issues with leading/trailing spaces
  if (
    !name.trim() ||
    !email.trim() ||
    !password.trim() ||
    !confirmpassword.trim()
  ) {
    toast({
      title: "Please fill all the fields",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
    return;
  }

  // Check if passwords match
  if (password !== confirmpassword) {
    toast({
      title: "Passwords do not match!",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
    return;
  }

  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/user",
      { name, email, password, pic },
      config
    );

    toast({
      title: "Registration Successful!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
    setLoading(false);
    navigate("/chats");
  } catch (error) {
    toast({
      title: "Error Occurred!",
      description:
        error.response && error.response.data.message
          ? error.response.data.message
          : "Something went wrong!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
  }
};



  return (
    <VStack spacing="5px" color="black">
      <FormControl id="firstname" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm your password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
        type="file"
        p={1.5}
        accept="image/*"
        onChange={(e)=>postDetails(e.target.files[0])}

        />
      </FormControl>
      <Button
      colorScheme="pink"
      width="100%"
      style={{marginTop:15}}
      onClick={submitHandler}
      isLoading={loading}>
        Sign Up
      </Button>
    </VStack>
  );
  
};

export default Signup
