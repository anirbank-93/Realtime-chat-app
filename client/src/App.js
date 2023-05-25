import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { useEffect } from 'react';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import SetAvatar from './pages/SetAvatar';
import Chat from './pages/Chat';

// Components
import DataProvider from './context/DataProvider';

function App() {
  // useEffect(() => {
  //   return () => {
  //     window.onbeforeunload = function () {
  //       localStorage.clear();
  //     };
  //   };
  // });

  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/set-avatar" element={<SetAvatar />} />
          <Route exact path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
