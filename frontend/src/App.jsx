import React from 'react'
import AuthPage from './pages/AuthPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Feed from './pages/feed';
import MainPage from './pages/MainPage';
import LogoutModal from './pages/LogoutModal';
import Hero from './pages/Hero';
import appStore from './utils/appStore';
import { Provider } from 'react-redux';
import ProfilePage from './pages/ProfilePage';
import Connection from './pages/Connection';
import UserProfile from './pages/UserProfile';
import RecommendationsPage from './pages/RecommendationPage';
import SearchPage from './pages/SearchPage';
import Chat from './pages/Chat';
const App = () => {
  
  return (
    <Provider store={appStore}> 
      <div>
        <Routes>
           <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<Hero/>}> 
           
             <Route path="/" element={<MainPage />} />
             <Route path="/profile" element={<ProfilePage />} />
             <Route path="/connections" element={<Connection />} />
              <Route path="/logout" element={<LogoutModal />} />
              <Route path="/profile/:id" element={<UserProfile />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/chat/:userId" element={<Chat />} />
          </Route>
          
          
         
         

        </Routes>
      </div>
   </Provider>
  )
}

export default App
