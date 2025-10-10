import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [city, setCity] = useState(localStorage.getItem("lastCity") || "");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [unit, setUnit] = useState("metric");
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");

  const API_KEY = import.meta.env.VITE_API_KEY;

  const texts = {
    ar: {
      title: " تطبيق الطقس العالمي",
      searchPlaceholder: "أدخل اسم المدينة...",
      search: "بحث ",
      humidity: "💧 الرطوبة",
      wind: " الرياح",
      forecastTitle: "توقعات الأيام القادمة",
      loading: "⏳ جاري تحميل البيانات...",
      error: " لم يتم العثور على المدينة.",
      allowLocation: "يرجى السماح بالوصول إلى الموقع.",
      dayMode: "☀️ نهاري",
      nightMode: "🌙 ليلي",
      degreeC: "°C",
      degreeF: "°F",
      humidityUnit: "%",
      windUnit: "م/ث",},
    en: {
      title: " Global Weather App",
      searchPlaceholder: "Enter city name...",
      search: "Search ",
      humidity: "💧 Humidity",
      wind: "Wind",
      forecastTitle: " 7-Day Forecast",
      loading: "⏳ Loading weather data...",
      error: " City not found.",
      allowLocation: "Please allow location access.",
      dayMode: "☀️ Light",
      nightMode: "🌙 Dark",
      degreeC: "°C",
      degreeF: "°F",
      humidityUnit: "%",
      windUnit: "m/s",
    },
  };

  const fetchWeather = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=${unit}&lang=${lang}`
      );
      setWeather(response.data);
      localStorage.setItem("lastCity", query);
      fetchForecast(response.data.coord.lat, response.data.coord.lon);
      setError("");
    } catch {
      setError(texts[lang].error);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}&lang=${lang}`
      );
      const daily = response.data.list.filter((item, index) => index % 8 === 0);
      setForecast(daily);
    } catch (error) {
      console.error("Forecast error:", error);
    }
  };

  useEffect(() => {
    if (!city) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchByLocation(latitude, longitude);
        },
        () => setError(texts[lang].allowLocation)
      );
    } else {
      fetchWeather(city);
    }
  }, [unit, lang]);

  const fetchByLocation = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}&lang=${lang}`
      );
      setWeather(response.data);
      setCity(response.data.name);
      fetchForecast(lat, lon);
    } catch {
      setError("تعذر تحديد الموقع تلقائيًا.");
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleUnit = () => setUnit(unit === "metric" ? "imperial" : "metric");
  const toggleLang = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <div
  className={`app ${darkMode ? "dark" : ""} ${weather ? weather.weather[0].main.toLowerCase() : ""}`}
  dir={lang === "ar" ? "rtl" : "ltr"}
>

      <div className="container fade-in">
        <h1 className="title">{texts[lang].title}</h1>

        <div className="controls">
          <input
            type="text"
            placeholder={texts[lang].searchPlaceholder}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={() => fetchWeather(city)}>{texts[lang].search}</button>
          <button onClick={toggleUnit}>
            {unit === "metric" ? texts[lang].degreeC : texts[lang].degreeF}
          </button>
          <button onClick={toggleDarkMode}>
            {darkMode ? texts[lang].dayMode : texts[lang].nightMode}
          </button>
          <button onClick={toggleLang}>{lang === "ar" ? "EN 🇬🇧" : "AR 🇸🇦"}</button>
        </div>

        {loading && <p className="loading">{texts[lang].loading}</p>}
        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-card fade-up">
            <h2>{weather.name}</h2>
            <h3>
              {Math.round(weather.main.temp)}
              {unit === "metric" ? texts[lang].degreeC : texts[lang].degreeF}
            </h3>
            <p>{weather.weather[0].description}</p>
            <div className="info">
              <p>
                {texts[lang].humidity}: {weather.main.humidity}
                {texts[lang].humidityUnit}
              </p>
              <p>
                {texts[lang].wind}: {weather.wind.speed} {texts[lang].windUnit}
              </p>
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="forecast fade-in">
            <h3>{texts[lang].forecastTitle}</h3>
            <div className="forecast-grid">
              {forecast.map((day, i) => (
                <div key={i} className="day-card">
                  <p>
                    {new Date(day.dt_txt).toLocaleDateString(
                      lang === "ar" ? "ar-DZ" : "en-US",
                      { weekday: "long" }
                    )}
                  </p>
                  <p>{Math.round(day.main.temp)}°</p>
                  <p>{day.weather[0].main}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
