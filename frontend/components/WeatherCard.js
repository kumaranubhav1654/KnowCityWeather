export default function WeatherCard({ weather, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="text-center">
          <div className="mb-3 text-4xl animate-pulse">🌤️</div>
          <p className="text-slate-300">Loading weather…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-6 text-red-100">
        <p className="font-medium">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
        Search a city to see live weather.
      </div>
    );
  }

  const iconUrl = weather.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-sky-500/30 via-indigo-600/25 to-violet-700/30 shadow-xl backdrop-blur-md">
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sky-200/90">
              Current conditions
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              {weather.city}, {weather.country}
            </h2>
            <p className="mt-1 capitalize text-slate-200">{weather.description}</p>
          </div>
          {iconUrl && (
            <img src={iconUrl} alt="" className="h-16 w-16 sm:h-20 sm:w-20" />
          )}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6 flex items-end gap-2">
          <span className="text-6xl font-bold tabular-nums text-white sm:text-7xl">
            {Math.round(weather.temperature)}
          </span>
          <span className="mb-2 text-2xl text-sky-100">°C</span>
        </div>
        <p className="mb-6 text-slate-200">
          Feels like {Math.round(weather.feelsLike)}°C
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon="💧" label="Humidity" value={`${weather.humidity}%`} />
          <Stat
            icon="💨"
            label="Wind"
            value={`${Number(weather.windSpeed).toFixed(1)} m/s`}
          />
          <Stat icon="🔽" label="Pressure" value={`${weather.pressure} hPa`} />
          <Stat icon="☁️" label="Clouds" value={`${weather.cloudiness}%`} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-black/20 p-4">
          <div>
            {/* <p icon="🌅" className="text-xs text-slate-400">Sunrise</p> */}
            {/* <p className="font-semibold text-white">{weather.sunrise}</p> */}
            <Stat icon="🌅" label="Sunrise" value={weather.sunrise}/>
          </div>
          <div>
            {/* <p icon="🌇" className="text-xs text-slate-400">Sunset</p> */}
            {/* <p className="font-semibold text-white">{weather.sunset}</p> */}
            <Stat icon="🌇" label="Sunset" value={weather.sunset}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-black/20 px-3 py-3 text-center">
      <div className="text-xl">{icon}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
