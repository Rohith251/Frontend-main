import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';
import ApplyForexCard from './Components/Userpage/ApplyForexCard.jsx';
import Home from './Components/Home.jsx'
import UserDashboard from './Components/Userpage/UserDashboard.jsx';
import PendingPage from './Components/Userpage/PendingPage.jsx';
import ActivateCard from './Components/Userpage/ActivateCard.jsx';
import DashboardHome from './Components/Userpage/DashboardHome.jsx';
import CardDetailsPage from './Components/Userpage/CardDetailsPage.jsx'; 
import BlockedCardPage from './Components/Userpage/BlockedCardPage.jsx';
import Profile from './Components/Userpage/Profile.jsx';
import MakePayment from './Components/Userpage/MakePayment.jsx';
import TransactionHistory from './Components/Userpage/TransactionHistory.jsx';
import ForgotPassword from './Components/ForgetPassword.jsx';
import ForexDashboard from './Components/Userpage/ForexDashboard.jsx';
import AuditorHomePage from './Components/Auditor/Home.jsx';
import AdminDashboard from './Components/Adminpage/AdminDashboard.jsx';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<ForgotPassword/>}/>

          {/* User Dashboard Routes */}
          <Route path="/userdashboard" element={<UserDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="apply" element={<ApplyForexCard />} />
            <Route path="pending" element={<PendingPage />} />
            <Route path="activate" element={<ActivateCard />} />
            <Route path="blocked" element={<BlockedCardPage />} />
            <Route path="details" element={<ForexDashboard />} />
            <Route path="profile" element={<Profile/>}/>
            <Route path="transaction" element={<MakePayment/>}/>
            <Route path="transactionhistory" element={<TransactionHistory/>}/>
          </Route>
          
          {/* Admin Dashboard Route */}
          <Route path='/admindashboard' element={<AdminDashboard/>}/>
          <Route path="/auditor" element={<AuditorHomePage/>}/>
        </Routes>

        {/* Toast Container for notifications */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;
