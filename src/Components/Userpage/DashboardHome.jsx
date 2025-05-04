import React, { useState, useEffect } from 'react';
import axios from '../../axios'; // Ensure this is the correct import for your axios instance
import './DashboardHome.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardHome = () => {
  const [name, setName] = useState('User'); // Default to 'User' if no name is fetched
  const [forexRates, setForexRates] = useState({
    USD: { rate: 82.45, change: 0.25, volume: 1250000, high: 82.65, low: 82.35, trend: 'up'  },
    EUR: { rate: 89.12, change: -0.15, volume: 980000, high: 89.25, low: 88.95, trend: 'down' },
    GBP: { rate: 104.23, change: 0.10, volume: 750000, high: 104.40, low: 104.10, trend: 'up' },
    JPY: { rate: 0.58, change: -0.02, volume: 650000, high: 0.59, low: 0.57, trend: 'down' },
    AUD: { rate: 54.67, change: 0.18, volume: 450000, high: 54.80, low: 54.50, trend: 'up' },
   
  });

  // Initialize market indicators with more varied values
  const [marketIndicators, setMarketIndicators] = useState({
    volatility: { value: 45.2, trend: 'up', change: 1.2 },
    liquidity: { value: 78.5, trend: 'down', change: -0.8 },
    sentiment: { value: 65.8, trend: 'up', change: 0.9 },
    momentum: { value: 72.3, trend: 'up', change: 0.5 },
    strength: { value: 68.7, trend: 'down', change: -0.6 }
  });

  // Initialize chart data with 60 points for smoother line
  const initialChartData = {
    labels: Array.from({ length: 60 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'USD/INR',
      data: Array.from({ length: 60 }, () => 82.45 + (Math.random() - 0.5) * 0.2),
      borderColor: '#2ecc71',
      backgroundColor: 'rgba(46, 204, 113, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#2ecc71',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
      pointBackgroundColor: '#2ecc71',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointStyle: 'circle'
    }]
  };

  const [chartData, setChartData] = useState(initialChartData);

  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  // Fetch the user's name on component mount
  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const userResponse = await axios.get(`/user/${userId}`);
          setName(userResponse.data.name); // Set the fetched name
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    } else {
      console.error('User ID not found in localStorage');
    }

    // Update data every second
    const interval = setInterval(() => {
      // Update forex rates
      setForexRates(prevRates => {
        const newRates = { ...prevRates };
        Object.keys(newRates).forEach(currency => {
          const change = (Math.random() - 0.5) * 0.02;
          const newRate = Number((newRates[currency].rate + change).toFixed(2));
          newRates[currency].rate = newRate;
          newRates[currency].change = Number(change.toFixed(2));
          newRates[currency].high = Math.max(newRate, newRates[currency].high);
          newRates[currency].low = Math.min(newRate, newRates[currency].low);
          newRates[currency].volume = Math.floor(newRates[currency].volume * (1 + (Math.random() - 0.5) * 0.05));
          newRates[currency].trend = change >= 0 ? 'up' : 'down';
        });
        return newRates;
      });

      // Update market indicators with more dynamic changes
      setMarketIndicators(prevIndicators => {
        const newIndicators = { ...prevIndicators };
        Object.keys(newIndicators).forEach(indicator => {
          // Generate a random change between -1.5 and 1.5
          const change = (Math.random() - 0.5) * 3;
          const newValue = Number((newIndicators[indicator].value + change).toFixed(1));
          
          // Ensure value stays within reasonable bounds (20-95)
          newIndicators[indicator].value = Math.min(Math.max(newValue, 20), 95);
          
          // Ensure change is never exactly 0
          const adjustedChange = change === 0 ? (Math.random() > 0.5 ? 0.1 : -0.1) : change;
          newIndicators[indicator].change = Number(adjustedChange.toFixed(1));
          newIndicators[indicator].trend = adjustedChange >= 0 ? 'up' : 'down';
        });
        return newIndicators;
      });

      // Update chart data
      setChartData(prevData => {
        const newData = [...prevData.datasets[0].data];
        const lastValue = newData[newData.length - 1];
        const change = (Math.random() - 0.5) * 0.1;
        const newValue = lastValue + change;
        
        if (newData.length >= 60) {
          newData.shift();
        }
        
        newData.push(newValue);

        const newLabels = [...prevData.labels];
        if (newLabels.length >= 60) {
          newLabels.shift();
        }
        const currentTime = new Date();
        newLabels.push(`${currentTime.getSeconds()}:${currentTime.getMilliseconds().toString().padStart(3, '0')}`);

        const gradientColor = newValue > lastValue ? 
          'rgba(46, 204, 113, 0.1)' : 
          'rgba(231, 76, 60, 0.1)';

        return {
          labels: newLabels,
          datasets: [{
            ...prevData.datasets[0],
            data: newData,
            backgroundColor: gradientColor,
            borderColor: newValue > lastValue ? '#2ecc71' : '#e74c3c',
            pointHoverBackgroundColor: newValue > lastValue ? '#2ecc71' : '#e74c3c',
            pointBackgroundColor: newValue > lastValue ? '#2ecc71' : '#e74c3c'
          }]
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [userId]);

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-success' : 'text-danger';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'bi-arrow-up-circle-fill text-success' : 'bi-arrow-down-circle-fill text-danger';
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const handleLogout = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-home">
      <div className="welcome-section mb-4">
        <h2>Welcome back, {name}! 👋</h2>
        <p>Track your forex rates and market indicators in real-time</p>
      </div>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <i className="bi bi-currency-exchange"></i>
                  Live Forex Rates
                </h5>
                
              </div>
              <div className="forex-rates">
                {Object.entries(forexRates).map(([currency, data]) => (
                  <div key={currency} className="forex-rate-item">
                    <div className="currency-info">
                      <div className="currency-header">
                        <div className="currency-title">
                          <span className="currency">{currency}/INR</span>
                        </div>
                        <span className={`change ${getChangeColor(data.change)}`}>
                          <i className={`bi ${getChangeIcon(data.change)}`}></i>
                          {Math.abs(data.change)}%
                        </span>
                      </div>
                      <div className="rate-container">
                        <span className="rate">{data.rate}</span>
                        <div className="price-range">
                          <small>H: {data.high.toFixed(2)}</small>
                          <small>L: {data.low.toFixed(2)}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-speedometer2"></i>
                Market Indicators
              </h5>
              <div className="indicators-container">
                {Object.entries(marketIndicators).map(([indicator, data]) => (
                  <div key={indicator} className="indicator-item">
                    <div className="indicator-name">{indicator}</div>
                    <div className="indicator-value">
                      {data.value}
                      <small className={`ms-2 ${getChangeColor(data.change)}`}>
                        ({data.change > 0 ? '+' : ''}{data.change})
                      </small>
                    </div>
                    <div className="indicator-trend">
                      <i className={`bi ${getTrendIcon(data.trend)}`}></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">
                  <i className="bi bi-graph-up-arrow"></i>
                  USD/INR Trend
                </h5>
                <div className="chart-controls">
                  <span className="current-value">
                    {chartData.datasets[0].data[chartData.datasets[0].data.length - 1].toFixed(4)}
                  </span>
                  <span className={`change-value ${chartData.datasets[0].data[chartData.datasets[0].data.length - 1] > chartData.datasets[0].data[chartData.datasets[0].data.length - 2] ? 'text-success' : 'text-danger'}`}>
                    {((chartData.datasets[0].data[chartData.datasets[0].data.length - 1] - chartData.datasets[0].data[chartData.datasets[0].data.length - 2]) / chartData.datasets[0].data[chartData.datasets[0].data.length - 2] * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="chart-container">
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                      duration: 0
                    },
                    interaction: {
                      mode: 'index',
                      intersect: false,
                    },
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleColor: '#fff',
                        titleFont: {
                          size: 14,
                          weight: 'bold'
                        },
                        bodyFont: {
                          size: 13
                        },
                        callbacks: {
                          label: function(context) {
                            const value = context.parsed.y;
                            const prevValue = context.dataset.data[context.dataIndex - 1] || value;
                            const change = ((value - prevValue) / prevValue) * 100;
                            return [
                              `Value: ${value.toFixed(4)}`,
                              `Change: ${change.toFixed(2)}%`
                            ];
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                          drawBorder: false,
                          borderDash: [5, 5]
                        },
                        ticks: {
                          callback: function(value) {
                            return value.toFixed(4);
                          },
                          font: {
                            size: 11,
                            family: "'Inter', sans-serif"
                          },
                          padding: 10,
                          color: '#666'
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        },
                        ticks: {
                          font: {
                            size: 11,
                            family: "'Inter', sans-serif"
                          },
                          maxRotation: 0,
                          padding: 10,
                          color: '#666'
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get currency names
const getCurrencyName = (currency) => {
  const names = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    AUD: 'Australian Dollar',
    SGD: 'Singapore Dollar',
    AED: 'UAE Dirham',
    CHF: 'Swiss Franc',
    CAD: 'Canadian Dollar',
    NZD: 'New Zealand Dollar',
    CNY: 'Chinese Yuan',
    HKD: 'Hong Kong Dollar'
  };
  return names[currency] || currency;
};

export default DashboardHome;
