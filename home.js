// Arrays to store temperature and humidity data
let temperatureData = [];
let humidityData = [];

// Temperature Line Chart
const ctxLineTemp = document.getElementById('lineChartTemp').getContext('2d');
const lineChartTemp = new Chart(ctxLineTemp, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Temperature (°C)',
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      data: temperatureData
    }]
  },
  options: {
    scales: {
      x: { title: { display: true, text: 'Time (s)' }},
      y: { title: { display: true, text: 'Temperature (°C)' }}
    }
  }
});

// Humidity Line Chart
const ctxLineHumidity = document.getElementById('lineChartHumidity').getContext('2d');
const lineChartHumidity = new Chart(ctxLineHumidity, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Humidity (%)',
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      data: humidityData
    }]
  },
  options: {
    scales: {
      x: { title: { display: true, text: 'Time (s)' }},
      y: { title: { display: true, text: 'Humidity (%)' }}
    }
  }
});

// Pie Chart for Temperature vs Humidity
const ctxPie = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(ctxPie, {
  type: 'pie',
  data: {
    labels: ['Temperature', 'Humidity'],
    datasets: [{
      label: 'Temperature vs Humidity',
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
      data: [0, 0] // Will update with real data
    }]
  }
});

// Utility functions to calculate min, max, and average
function calculateMin(data) {
  return Math.min(...data);
}

function calculateMax(data) {
  return Math.max(...data);
}

function calculateAverage(data) {
  return (data.reduce((a, b) => a + b, 0) / data.length).toFixed(2);
}

// Function to update charts and values
function updateCharts(temperature, humidity) {
  const now = new Date();
  const time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

  // Update Temperature Chart and Value
  lineChartTemp.data.labels.push(time);
  lineChartTemp.data.datasets[0].data.push(temperature);
  document.getElementById('tempValue').innerHTML = temperature + '°C';
  lineChartTemp.update();

  // Update Humidity Chart and Value
  lineChartHumidity.data.labels.push(time);
  lineChartHumidity.data.datasets[0].data.push(humidity);
  document.getElementById('humidityValue').innerHTML = humidity + '%';
  lineChartHumidity.update();

  // Update Pie Chart
  pieChart.data.datasets[0].data = [temperature, humidity];
  pieChart.update();

  // Update Max, Min, and Average Values for Temperature
  document.getElementById('maxTemp').innerHTML = calculateMax(temperatureData) || 'N/A';
  document.getElementById('minTemp').innerHTML = calculateMin(temperatureData) || 'N/A';
  document.getElementById('avgTemp').innerHTML = calculateAverage(temperatureData) || 'N/A';

  // Update Max, Min, and Average Values for Humidity
  document.getElementById('maxHumidity').innerHTML = calculateMax(humidityData) || 'N/A';
  document.getElementById('minHumidity').innerHTML = calculateMin(humidityData) || 'N/A';
  document.getElementById('avgHumidity').innerHTML = calculateAverage(humidityData) || 'N/A';
}

// Function to fetch data from the ESP32
function fetchData() {
  fetch('http://<ESP32_IP_ADDRESS>/data')
    .then(response => response.json())
    .then(data => {
      const temperature = data.temperature;
      const humidity = data.humidity;
      temperatureData.push(temperature);
      humidityData.push(humidity);
      updateCharts(temperature, humidity);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Fetch data every 5 seconds
setInterval(fetchData, 5000);
