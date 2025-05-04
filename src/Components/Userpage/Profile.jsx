import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPen, FaIdCard, FaBirthdayCake, FaPhone, FaMapMarkerAlt, FaGlobe, FaEnvelope, FaUser } from 'react-icons/fa';
import axios from '../../axios'; // your configured axios instance
import { toast } from 'react-toastify';
import instance from '../../axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [tempState, setTempState] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [serverOtp, setServerOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  const userId = localStorage.getItem('id');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await instance.get(`/user/profile/${userId}`);
        setUserData(response.data);
      } catch (err) {
        toast.error('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const updateProfile = async (updatedData) => {
    try {
      await axios.put(`/user/update-profiledetalis`, updatedData);
      setUserData(updatedData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    }
  };

  const validatePhoneNumber = (phone) => {
    const regex = /^[6-9]\d{9}$/;
    if (!regex.test(phone)) {
      return 'Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits.';
    }
    return '';
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setNewFieldValue(value);
    setEmailError(validateEmail(value));
  };

  const sendOtpToOldEmail = async () => {
    try {
      const response = await instance.post(`/email/send-otp`, null, {
        params: { userId }
      });
      setOtpSent(true);
      toast.success('OTP sent to your old email!');
    } catch (error) {
      toast.error('Failed to send OTP.');
    }
  };
  
  const handleSave = async () => {
    if (!userData) return;

    if (fieldToEdit === 'email') {
      if (emailError) {
        toast.error(emailError);
        return;
      }
      try {
        const response = await instance.patch('/user/verify-otp-and-update-email', null, {
          params: {
            userId,
            otp: enteredOtp,
            newEmail: newFieldValue,
          },
        });

        if (response.status === 200) {
          toast.success('Email updated successfully!');
          setUserData({ ...userData, email: newFieldValue });
          setShowEditModal(false);
        }
      } catch (error) {
        toast.error(error.response?.data || 'Failed to verify OTP or update email.');
      }
      return;
    }

    const updatedUser = { ...userData };

    if (fieldToEdit === 'address') {
      updatedUser.address = newFieldValue;
    } else if (fieldToEdit === 'phone') {
      const error = validatePhoneNumber(newFieldValue);
      if (error) {
        setPhoneError(error);
        return;
      }
      updatedUser.phonenumber = newFieldValue;
    } else if (fieldToEdit === 'state') {
      updatedUser.state = tempState;
    }

    await updateProfile(updatedUser);
    setShowEditModal(false);
    setPhoneError('');
  };

  const openEditModal = (field) => {
    setFieldToEdit(field);
    setNewFieldValue('');
    setTempState('');
    setOtpSent(false);
    setServerOtp('');
    setEnteredOtp('');
    setPhoneError('');
    setEmailError('');
    setShowEditModal(true);
  };

  const getProfileIcon = (gender) => {
    return gender?.toLowerCase() === 'female'
      ? 'https://cdn-icons-png.flaticon.com/512/219/219969.png'
      : 'https://cdn-icons-png.flaticon.com/512/219/219983.png';
  };

  const getFieldIcon = (field) => {
    switch (field) {
      case 'pan':
        return <FaIdCard className="text-primary me-2" />;
      case 'dob':
        return <FaBirthdayCake className="text-primary me-2" />;
      case 'phone':
        return <FaPhone className="text-primary me-2" />;
      case 'address':
        return <FaMapMarkerAlt className="text-primary me-2" />;
      case 'state':
      case 'country':
        return <FaGlobe className="text-primary me-2" />;
      case 'email':
        return <FaEnvelope className="text-primary me-2" />;
      default:
        return <FaUser className="text-primary me-2" />;
    }
  };

  const statesOfIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
  ];

  return (
    <div className="d-flex justify-content-center align-items-center p-4" style={{ minHeight: '100vh' }}>
      <div className="card border-0 rounded-4 shadow-lg p-4 w-100" style={{ maxWidth: '600px', background: '#ffffff' }}>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <img
                src={getProfileIcon(userData.gender)}
                alt="Profile"
                className="rounded-circle"
                width="90"
                height="90"
              />
              <h4 className="mt-3 fw-bold">{userData.name}</h4>
              <div className="position-relative d-inline-block">
                <p className="text-muted">
                  <FaEnvelope className="text-primary me-2" />
                  {userData.email}
                </p>
                <FaPen
                  size={14}
                  className="text-primary position-absolute"
                  style={{ top: '0', right: '-20px', cursor: 'pointer' }}
                  onClick={() => openEditModal('email')}
                />
              </div>
            </div>

            <div className="row g-3">
              {[
                ['PAN', userData.pan, 'pan'],
                ['Date of Birth', userData.dob, 'dob'],
                ['Phone Number', userData.phonenumber, 'phone'],
                ['Address', userData.address, 'address'],
                ['State', userData.state, 'state'],
                ['Country', userData.country, 'country'],
              ].map(([label, value, field], idx) => (
                <div className="col-12" key={idx}>
                  <div className="border rounded-3 p-3 position-relative bg-light">
                    <small className="text-primary d-flex align-items-center">
                      {getFieldIcon(field)}
                      {label}
                    </small>
                    <div className="fw-semibold text-dark mt-2">{value || 'Not Available'}</div>
                    {['address', 'phone', 'state', 'email'].includes(field) && (
                      <FaPen
                        size={12}
                        className="text-secondary position-absolute"
                        style={{ top: '10px', right: '10px', cursor: 'pointer' }}
                        onClick={() => openEditModal(field)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <>
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title d-flex align-items-center">
                      {getFieldIcon(fieldToEdit)}
                      Update {fieldToEdit === 'address' ? 'Address' :
                        fieldToEdit === 'phone' ? 'Phone Number' :
                        fieldToEdit === 'state' ? 'State' : 'Email'}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    {fieldToEdit === 'state' ? (
                      <>
                        <div className="mb-3">
                          <label className="form-label d-flex align-items-center">
                            {getFieldIcon('state')}
                            Old State
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={userData.state}
                            readOnly
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label d-flex align-items-center">
                            {getFieldIcon('state')}
                            New State
                          </label>
                          <select
                            className="form-select"
                            value={tempState}
                            onChange={(e) => setTempState(e.target.value)}
                          >
                            <option value="">Select State</option>
                            {statesOfIndia.map((state, index) => (
                              <option key={index} value={state}>{state}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-3">
                          <label className="form-label d-flex align-items-center">
                            {getFieldIcon(fieldToEdit)}
                            Old {fieldToEdit === 'phone' ? 'Phone Number' : fieldToEdit.charAt(0).toUpperCase() + fieldToEdit.slice(1)}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={fieldToEdit === 'phone' ? userData.phonenumber : userData[fieldToEdit]}
                            readOnly
                          />
                        </div>

                        {fieldToEdit === 'email' ? (
                          <>
                            <div className="mb-3">
                              <label className="form-label d-flex align-items-center">
                                {getFieldIcon('email')}
                                New Email
                              </label>
                              <input
                                type="email"
                                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                value={newFieldValue}
                                onChange={handleEmailChange}
                                placeholder="Enter new email"
                              />
                              {emailError && (
                                <div className="invalid-feedback">{emailError}</div>
                              )}
                            </div>
                            <div className="d-grid mb-3">
                              <button 
                                className="btn btn-warning" 
                                onClick={sendOtpToOldEmail}
                                disabled={!!emailError}
                              >
                                {otpSent ? 'Resend OTP' : 'Send OTP'}
                              </button>
                            </div>
                            {otpSent && (
                              <div className="mb-3">
                                <label className="form-label d-flex align-items-center">
                                  <FaEnvelope className="text-primary me-2" />
                                  Enter OTP
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={enteredOtp}
                                  onChange={(e) => setEnteredOtp(e.target.value)}
                                  placeholder="Enter OTP received"
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="mb-3">
                              <label className="form-label d-flex align-items-center">
                                {getFieldIcon(fieldToEdit)}
                                New {fieldToEdit.charAt(0).toUpperCase() + fieldToEdit.slice(1)}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={newFieldValue}
                                onChange={(e) => setNewFieldValue(e.target.value)}
                                placeholder={`Enter new ${fieldToEdit}`}
                              />
                            </div>
                            {fieldToEdit === 'phone' && phoneError && (
                              <div className="text-danger mt-2">{phoneError}</div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
