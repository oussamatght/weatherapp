import "tailwindcss";

function Ap({ time, name, humidity }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          🌤 Weather App
        </h1>

        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-700">{name}</span>
          <span className="text-5xl font-bold text-blue-600">{time}</span>
        </div>

        <div className="flex justify-between items-center border-t pt-4 mt-4">
          <span className="text-gray-600 text-sm">💧 Humidity</span>
          <span className="text-gray-800 font-medium">{humidity}%</span>
        </div>
      </div>
    </div>
  );
}

export default Ap;
