import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { JSON_API } from '../services/api';

// Components
import ChatInput from './ChatInput';
// import Messages from './Messages';

const Container = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      justify-content: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
    .sender {
      display: flex;
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .receiver {
      display: flex;
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  //console.log('chat person', currentChat);
  const scrollRef = useRef();
  const [messages, setmessages] = useState([]);
  const [arrivingMessage, setarrivingMessage] = useState(null);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-receive', (msg) => {
        setarrivingMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  // Component did update
  useEffect(() => {
    // if (currentChat) {
    async function getMessages() {
      let res = await JSON_API['exchangedMessages']({
        from: currentUser._id,
        to: currentChat._id,
      });
      // console.log(res);

      if (res.isSuccess) {
        setmessages(res.data);
      } else {
        toast.error('Could not fetch messages. Something went wrong');
      }
    }
    getMessages();
    // }
    arrivingMessage && setmessages((prev) => [...prev, arrivingMessage]);
  }, [currentChat, arrivingMessage]);

  // useEffect(() => {
  //   arrivingMessage && setmessages((prev) => [...prev, arrivingMessage]);
  // }, [arrivingMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: 'smooth' });
  }, [messages]);

  const handleSendMsg = async (msg) => {
    let res = await JSON_API['addMessage']({
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    if (res.isSuccess) {
      // console.log(res.data.data);
      let data = {
        msg: res.data.data.message,
        from: res.data.data.users[0],
        to: res.data.data.users[1],
      };
      socket.current.emit('send-msg', data);
      let msgs = [...messages];
      msgs.push({ fromSelf: true, message: res.data.data.message });
      setmessages(msgs);
    } else {
      toast.error('Something went wrong');
    }
  };

  return (
    // return inside fragments to add conditional rendering
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img src={currentChat.avatarImage} alt="user_img" />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
          </div>
          <div className="chat-messages">
            {messages.map((msg, idx) => {
              return (
                <div
                  ref={scrollRef}
                  key={uuidv4()}
                  className={`message ${msg.fromSelf ? 'sender' : 'receiver'}`}
                >
                  <div className="content">
                    <p>{msg.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
};

export default ChatContainer;
