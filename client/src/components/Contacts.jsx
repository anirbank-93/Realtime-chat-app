import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BiPowerOff } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

// Assets
import Logo from '../assets/logo.svg';

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff39;
      min-height: 5rem;
      width: 90%;
      cursor: pointer;
      border-radius: 0.2rem;
      padding: 0.4rem;
      gap: 1rem;
      align-items: center;
      display: flex;
      transition: 0.5s ease-in-out;
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
    .selected {
      background-color: #9186f3;
    }
  }
  .current-user {
    background-color: #0d0d30;
    display: flex;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    .logout-btn {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
      h3 {
        color: #e9ff33;
        margin-bottom: 0;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 05.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
      .logout-btn {
        h3 {
          font-size: 0.75rem;
        }
      }
    }
  }
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    color: #ebe7ff;
  }
`;

const Contacts = ({ contacts, currentUser, changeChat }) => {
  const navigate = useNavigate();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const logout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Snappy</h3>
          </div>
          <div className="contacts">
            {contacts.map((item, idx) => {
              return (
                <div
                  className={`contact ${
                    idx === currentSelected ? 'selected' : ''
                  }`}
                  key={idx}
                  onClick={() => changeCurrentChat(idx, item)}
                >
                  <div className="avatar">
                    <img src={item.avatarImage} alt="avatar" />
                  </div>
                  <div className="username">
                    <h3>{item.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            {/* <div className="avatar"> */}
            <div className="avatar">
              <img src={currentUserImage} alt="avatar" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
            <div className="logout-btn">
              <h3>Logout</h3>
              <LogoutBtn>
                <BiPowerOff onClick={logout} />
              </LogoutBtn>
            </div>
            {/* </div> */}
          </div>
        </Container>
      )}
    </>
  );
};

export default Contacts;
