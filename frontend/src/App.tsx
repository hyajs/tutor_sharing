import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'
import TutorList from './pages/TutorList'
import TutorDetail from './pages/TutorDetail'
import TutorApply from './pages/TutorApply'
import UserCenter from './pages/UserCenter'
import MapSearch from './pages/MapSearch'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/Admin/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tutors" element={<TutorList />} />
        <Route path="tutors/:id" element={<TutorDetail />} />
        <Route path="map" element={<MapSearch />} />
        <Route path="apply" element={<TutorApply />} />
        <Route path="user" element={<UserCenter />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
