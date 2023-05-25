import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import Logo from '../assets/logo.svg';
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from '../context/DataProvider';
import { JSON_API } from '../services/api';

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
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
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
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

let loginInitialValue = {
  usernameOrEmail: '',
  password: '',
};

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(loginInitialValue);
  const { setAccount } = useContext(DataContext);

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/set-avatar');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      let res = await JSON_API['userSignin'](user);

      if (res.isSuccess) {
        setUser(loginInitialValue);
        toast.success('Login successfull', toastOptions);
        localStorage.setItem(
          'chat-app-user',
          JSON.stringify(res.data.userDetails)
        );
        // sessionStorage.setItem('accessToken', `Bearer ${res.data.accessToken}`);
        // sessionStorage.setItem(
        //   'refreshToken',
        //   `Bearer ${res.data.refreshToken}`
        // );

        setAccount({
          username: res.data.username,
          email: res.data.email,
          user_id: res.data._id,
        });
        navigate('/set-avatar');
      } else {
        toast.error(res?.error?.message, toastOptions);
      }
    }
  };

  const handleValidation = () => {
    const { usernameOrEmail, password } = user;

    if (usernameOrEmail == '') {
      toast.error('Username or Email is required.', toastOptions);

      return false;
    }
    if (password == '') {
      toast.error('Password is required.', toastOptions);

      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(e) => handleSubmit(e)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>
          <input
            type="text"
            name="usernameOrEmail"
            id=""
            placeholder="Username or Email"
            value={user.usernameOrEmail}
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            name="password"
            id=""
            placeholder="Password"
            value={user.password}
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Sign In</button>
          <span>
            <Link to="/">Register</Link> to create new account.
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

export default Login;
