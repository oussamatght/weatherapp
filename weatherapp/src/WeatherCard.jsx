export default function WeatherCard({ weather, unit }) {
  const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  const tempUnit = unit === "metric" ? "°C" : "°F";

  return (
    <div className="weather-card">
      <img src={icon} alt="weather" className="weather-icon" />
      <h2 className="city">{weather.name}</h2>
      <h3 className="temp">{Math.round(weather.main.temp)}{tempUnit}</h3>
      <p className="desc">{weather.weather[0].description}</p>
      <div className="details">
        <p>💧 {weather.main.humidity}%</p>
        <p>🌬 {weather.wind.speed} m/s</p>
      </div>
    </div>
  );
}
