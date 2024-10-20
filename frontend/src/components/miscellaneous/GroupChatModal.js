import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import React, { useState } from 'react'
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName]=useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const {user, chats, setChats}=ChatState();
    const handleSearch=async(query)=>{
        setSearch(query);
        if(!query){
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,},

        };
        const {data}= await axios.get(`./api/user?search=${search}`,config);
        console.log(data);
        setLoading(false);
        setSearchResult(data);
     } catch (error) {
            toast({
              title: "Error Occured!",
              description: "Failed to Load the Search Results",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
        }
    };
    const handleSubmit = async() => {
        if(!groupChatName||!selectedUsers)
        {
            toast({
              title: "Please fill all the feilds",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
        }
try {
     const config = {
       headers: {
         Authorization: `Bearer ${user.token}`,
       },
     };
     const {data}= await axios.post(`./api/chat/group`,{
        name:groupChatName,
        users: JSON.stringify(selectedUsers.map((U)=>U._id)),
     },config);

     setChats([data,...chats]);
     onClose();
     toast({
       title: "New Group Created Successfully!",
       status: "success",
       duration: 5000,
       isClosable: true,
       position: "bottom",
     });

} catch (error) {
    toast({
      title: "Failed to Create the Group!",
      description: error.response.data,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    
}
    };
    const handleGroup = (usertoadd) => {
        if(selectedUsers.includes(usertoadd)){
            toast({
              title: "Already added to the Group",
              
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
        }
            setSelectedUsers([...selectedUsers,usertoadd])
        
    };
const handleDelete = (delu) => {
    setSelectedUsers(selectedUsers.filter(sel=>sel._id!==delu._id))
};

 return (
   <>
     <span onClick={onOpen}>{children}</span>

     <Modal isOpen={isOpen} onClose={onClose}>
       <ModalOverlay />
       <ModalContent>
         <ModalHeader
           fontSize="35px"
           fontFamily="Work sans"
           display="flex"
           justifyContent="center"
         >
           New Group Chat
         </ModalHeader>
         <ModalCloseButton />
         <ModalBody display="flex" flexDir="column" alignItems="center">
           <FormControl>
             <Input
               placeholder="Group Name"
               mb={3}
               onChange={(e) => setGroupChatName(e.target.value)}
             />
           </FormControl>
           <FormControl>
             <Input
               placeholder="Add members"
               mb={1}
               onChange={(e) => handleSearch(e.target.value)}
             />
           </FormControl>
           <Box w="100%" display= "flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
               <UserBadgeItem
                 key={user._id}
                 user={u}
                 handleFunction={() => handleDelete(u)}
               />
             ))}
           </Box>

           {loading ? (
             <div>loading</div>
           ) : (
             searchResult
               ?.slice(0, 4)
               .map((user) => (
                 <UserListItem
                   key={user._id}
                   user={user}
                   handleFunction={() => handleGroup(user)}
                 />
               ))
           )}
         </ModalBody>

         <ModalFooter>
           <Button colorScheme="pink" mr={3} onClick={handleSubmit}>
             Create Group
           </Button>
         </ModalFooter>
       </ModalContent>
     </Modal>
   </>
 );
}

export default GroupChatModal
