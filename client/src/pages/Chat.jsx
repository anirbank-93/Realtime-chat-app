import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// API function
import { JSON_API } from '../services/api';

// Constants
import { API_URL } from '../constants/config';

// Components
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [currentChat, setCurrentChat] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let chatUser;

    if (!localStorage.getItem('chat-app-user')) {
      navigate('/login');
    } else {
      chatUser = JSON.parse(localStorage.getItem('chat-app-user'));
      setIsLoaded(true);
      setCurrentUser(chatUser);
    }

    if (chatUser && chatUser.isAvatarImageSet === true) {
      const getContacts = async () => {
        const user = await JSON.parse(localStorage.getItem('chat-app-user'));
        let res = await JSON_API['getContacts']({ id: user._id });

        if (res.isSuccess) {
          setContacts(res.data.data);
        } else {
          navigate('/set-avatar');
        }
      };

      getContacts();
    }
  }, []);

  // Component did update
  useEffect(() => {
    if (currentUser) {
      socket.current = io(API_URL);
      socket.current.emit('add-user', currentUser._id);
    }
  }, [currentUser]);

  const handleChatChange = (user) => {
    setCurrentChat(user);
  };

  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoaded && currentChat === '' ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
};

export default Chat;
