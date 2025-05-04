
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import instance from '../../axios';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
].sort();

const stateOptions = indianStates.map(state => ({
  value: state,
  label: state,
}));

const ApplyForexCard = () => {
  const [formData, setFormData] = useState({
    pan: '',
    dob: '',
    phoneNumber: '',
    gender: '',
    salary: '',
    address: '',
    state: '',
    country: '',
    file: null,
  });

  const [selectedState, setSelectedState] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatCurrency = (value) => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'salary') {
      // Remove commas and ensure numeric value
      const cleanValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        salary: cleanValue ? formatCurrency(cleanValue) : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('File size should be under 5MB');
      return;
    }
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('id');

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const phoneRegex = /^[6-9][0-9]{9}$/;

    const numericSalary = parseFloat(formData.salary.replace(/,/g, ''));

    if (!panRegex.test(formData.pan)) {
      toast.error('Enter valid PAN card number (e.g., ABCDE1234F)');
      return;
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error('Enter a valid 10-digit phone number starting from 6-9');
      return;
    }

    if (isNaN(numericSalary) || numericSalary <= 0) {
      toast.error('Salary should be a positive number');
      return;
    }

    if (!selectedState) {
      toast.error('Please select a state');
      return;
    }

    if (!formData.file) {
      toast.error('Please upload a salary proof document');
      return;
    }

    setLoading(true);

    const fullForm = new FormData();
    fullForm.append('pan', formData.pan);
    fullForm.append('dob', formData.dob);
    fullForm.append('phoneNumber', formData.phoneNumber);
    fullForm.append('gender', formData.gender);
    fullForm.append('salary', numericSalary.toString()); // send number to backend
    fullForm.append('address', formData.address);
    fullForm.append('state', selectedState.value);
    fullForm.append('country', formData.country);
    fullForm.append('file', formData.file);

    try {
      await instance.put(`/application/card/${userId}`, fullForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Forex card application submitted!', { autoClose: 1500 });
      setTimeout(() => navigate('/userdashboard'), 1700);
    } catch (err) {
      if (err.response?.status === 500) {
        toast.error('Internal server error. Please try again later.');
      } else {
        toast.error(err.response?.data || 'Application failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="shadow p-4 bg-white rounded" style={{ width: '100%', maxWidth: '700px' }}>
        <form onSubmit={handleSubmit} style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.7 : 1 }}>
          <h3 className="mb-4 text-center">Apply for Forex Card</h3>

          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <input type="text" className="form-control" name="pan" value={formData.pan} onChange={handleChange} placeholder="PAN Card Number" required />
            </div>
            <div className="col-md-6 mb-3">
              <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <input type="tel" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
            </div>
            <div className="col-md-6 mb-3">
              <select className="form-select" name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Monthly Salary (e.g. 50,000)"
              required
            />
          </div>

          <div className="mb-3">
            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
          </div>

          <div className="mb-3">
            <Select options={stateOptions} value={selectedState} onChange={setSelectedState} placeholder="Select State" />
          </div>

          <div className="mb-3">
            <input type="text" className="form-control" name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />
          </div>

          <div className="mb-3">
            <input type="file" className="form-control" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
          </div>

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyForexCard;
