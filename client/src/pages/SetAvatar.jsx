import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
// import axios from 'axios';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

import 'react-toastify/dist/ReactToastify.css';

import loader from '../assets/loader.gif';
// import { AVATAR_GEN } from '../constants/data';
import { JSON_API } from '../services/api';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

const toastOptions = {
  position: 'bottom-right',
  autoClose: 8000,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
};

const SetAvatar = () => {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  useEffect(() => {
    if (!localStorage.getItem('chat-app-user')) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const data = [];

    async function fetchImg() {
      for (let i = 0; i < 4; i++) {
        // Generate random avatars
        /** https://www.dicebear.com/how-to-use/js-library */
        const avatar = createAvatar(lorelei, {
          seed: 'Felix',
          flip: false,
        });

        // await axios
        //   .get(`${AVATAR_GEN}/${Math.round(Math.random() * 1000)}`)
        await avatar
          .toDataUri()
          .then((file) => {
            console.log('Avatar file from api', file);
            // const buffer = new Buffer(file.data);
            // data.push(buffer.toString('base64'));
            data.push(file);
          })
          .catch((err) => {
            console.log('Avatar get error due to ', err);
          });
      }
    }
    fetchImg();
    setAvatars(data);
    setIsLoading(false);
  }, []);

  const setProfilePicture = async () => {
    console.log(selectedAvatar);
    if (selectedAvatar === undefined) {
      toast.error('Please select an avatar.', toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem('chat-app-user'));
      // console.log('local user data on set avatar', user);
      try {
        let response = await JSON_API['userSetAvatar']({
          id: user._id,
          avatarImage: avatars[selectedAvatar],
        });
        // console.log('set profile image response', response?.data?.data);

        if (response.isSuccess) {
          user.isAvatarImageSet = true;
          user.avatarImage = response.data.data.image;
          localStorage.setItem('chat-app-user', JSON.stringify(user));
          navigate('/chat');
        }
      } catch (err) {
        console.log('set profile pic err', err.message);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader.gif" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an avatar as your profile picture.</h1>
            <div className="avatars">
              {avatars.map((item, idx) => {
                return (
                  <div
                    className={`avatar ${
                      selectedAvatar == idx ? 'selected' : ''
                    }`}
                    key={idx}
                  >
                    <img
                      src={item} // `data:image/svg+xml;base64, ${}`
                      alt="avatar"
                      key={item}
                      onClick={() => setSelectedAvatar(idx)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as profile picture.
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
};

export default SetAvatar;
