import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { RefreshCcw } from 'lucide-react';

export function BMI() {
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [bmi, setBmi] = useState(0);
  const [message, setMessage] = useState('');

  const calcBmi = (event) => {
    event.preventDefault();

    if (!weight || !height || weight <= 0 || height <= 0) {
      alert('Please enter a valid weight and height');
      return;
    }

    let bmiValue = (weight / (height * height) * 703);
    setBmi(parseFloat(bmiValue.toFixed(1)));

    if (bmiValue < 25) {
      setMessage('You are underweight');
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setMessage('You are a healthy weight');
    } else {
      setMessage('You are overweight');
    }
  };

  const reload = () => {
    setWeight(0);
    setHeight(0);
    setBmi(0);
    setMessage('');
  };

  const chartOptions = {
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: { enabled: true }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: -2,
            fontSize: '22px',
            color: '#333',
            formatter: function (val) {
              return val + "%"; // Show value
            }
          }
        }
      }
    },
    grid: { padding: { top: -10 } },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91]
      },
    },
    labels: ['BMI'],
    colors: [bmi < 25 ? '#3b82f6' : bmi < 30 ? '#22c55e' : '#ef4444']
  };

  // Convert BMI to percentage for the chart (approx mapping: 0-40 scale)
  const chartSeries = [Math.min((bmi / 40) * 100, 100)];

  return (
    <div className="flex flex-col items-center justify-center p-6 mt-10">
      <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">BMI Calculator</h2>

        <form onSubmit={calcBmi} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
            <input
              type="number"
              value={weight || ''}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your weight"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (in)</label>
            <input
              type="number"
              value={height || ''}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your height"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type='submit'
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
            >
              Calculate
            </button>
            <button
              onClick={reload}
              className="flex items-center justify-center w-12 h-10 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition duration-200"
              type='button'
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </form>

        {bmi > 0 && (
          <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
              <ReactApexChart options={chartOptions} series={chartSeries} type="radialBar" height={250} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pt-8 text-center">
                <span className="text-3xl font-bold text-gray-800">{bmi}</span>
              </div>
            </div>

            <div className={`mt-[-20px] px-4 py-2 rounded-full font-medium ${bmi < 25 ? 'bg-blue-100 text-blue-800' :
                bmi < 30 ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
              }`}>
              {message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
