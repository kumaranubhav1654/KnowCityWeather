import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import WeatherCard from '../components/WeatherCard';
import {
  API_BASE,
  getConfig,
  getHealth,
  getSchedule,
  getTest,
  getWeather,
  postAdvice,
  postMessage,
  postSmartAlert,
  putSchedule,
  runScheduleNow,
} from '../lib/api';
import {
  formatScheduleLabel,
  parseTimeInput,
  timeToCron,
  toTimeInputValue,
} from '../lib/cronSchedule';

export default function Home() {
  const [city, setCity] = useState('Bangalore');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const [serverOnline, setServerOnline] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [config, setConfig] = useState(null);
  const [testInfo, setTestInfo] = useState(null);

  const [reminders, setReminders] = useState('');
  const [advice, setAdvice] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(false);

  const [phone, setPhone] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [scheduleTime, setScheduleTime] = useState('07:00');
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [scheduleMeta, setScheduleMeta] = useState(null);
  const [scheduleSaving, setScheduleSaving] = useState(false);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 5000);
  };

  const loadConfig = useCallback(async () => {
    try {
      const res = await getConfig();
      if (res.success) {
        setConfig(res.data);
        if (res.data.defaultCity) setCity(res.data.defaultCity);
        if (res.data.defaultWhatsAppTo) setPhone(res.data.defaultWhatsAppTo);
      }
    } catch {
      /* backend may be offline */
    }
  }, []);

  const checkServer = useCallback(async () => {
    setConnectionError(null);
    try {
      await getHealth();
      setServerOnline(true);
      await loadConfig();
    } catch (err) {
      setServerOnline(false);
      const hint =
        API_BASE.includes('localhost') &&
        typeof window !== 'undefined' &&
        !window.location.hostname.includes('localhost')
          ? ' Set NEXT_PUBLIC_API_URL on Vercel to your Render URL and redeploy.'
          : ' Render free tier may take up to 60s to wake up — try Refresh status.';
      setConnectionError(
        (err.message || 'Network error') + hint
      );
    }
  }, [loadConfig]);

  const loadWeather = useCallback(async (targetCity) => {
    const q = (targetCity ?? city).trim();
    if (!q) return;

    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await getWeather(q);
      if (res.success) {
        setWeather(res.data);
      } else {
        throw new Error(res.error || 'Failed to load weather');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Could not fetch weather. Is the backend running on port 3001?';
      setWeatherError(msg);
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  }, [city]);

  const handleGenerateAdvice = async () => {
    setAdviceLoading(true);
    setAdvice('');
    try {
      const res = await postAdvice({
        city: city.trim(),
        desiredReminders: reminders.trim(),
      });
      if (res.success) {
        setAdvice(res.data.advice);
        if (!weather && res.data.weather) setWeather(res.data.weather);
        showToast('success', 'AI advice generated.');
      } else {
        throw new Error(res.error);
      }
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || 'Failed to generate advice';
      showToast('error', msg);
    } finally {
      setAdviceLoading(false);
    }
  };

  const handleSendCustom = async () => {
    if (!phone.trim() || !customMessage.trim()) {
      showToast('error', 'Enter a phone number and message.');
      return;
    }
    setActionLoading(true);
    try {
      const res = await postMessage({
        to: phone.trim(),
        message: customMessage.trim(),
      });
      if (res.success) {
        showToast('success', 'WhatsApp message sent.');
        setCustomMessage('');
      } else {
        throw new Error(res.error);
      }
    } catch (err) {
      showToast(
        'error',
        err.response?.data?.error || err.message || 'Failed to send message'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleSmartAlert = async () => {
    if (!phone.trim()) {
      showToast('error', 'Enter your WhatsApp number (with country code).');
      return;
    }
    setActionLoading(true);
    try {
      const res = await postSmartAlert({
        to: phone.trim(),
        city: city.trim(),
        desiredReminders: reminders.trim(),
        message: advice.trim() || undefined,
      });
      if (res.success) {
        setAdvice(res.data.advice);
        if (res.data.weather) setWeather(res.data.weather);
        showToast('success', 'Smart alert sent to WhatsApp.');
      } else {
        throw new Error(res.error);
      }
    } catch (err) {
      showToast(
        'error',
        err.response?.data?.error || err.message || 'Failed to send smart alert'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const loadSchedule = useCallback(async () => {
    try {
      const res = await getSchedule();
      if (res.success) {
        setScheduleMeta(res.data);
        setScheduleEnabled(res.data.enabled);
        setScheduleTime(toTimeInputValue(res.data.hour, res.data.minute));
        if (res.data.city) setCity(res.data.city);
        if (res.data.phone) setPhone(res.data.phone);
      }
    } catch {
      /* schedule API unavailable */
    }
  }, []);

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setScheduleSaving(true);
    try {
      const res = await putSchedule({
        enabled: scheduleEnabled,
        time: scheduleTime,
        city: city.trim(),
        phone: phone.trim(),
        desiredReminders: reminders.trim(),
      });
      if (res.success) {
        setScheduleMeta(res.data);
        showToast(
          'success',
          scheduleEnabled
            ? `Scheduled daily at ${res.data.label}`
            : 'Daily schedule paused'
        );
      } else {
        throw new Error(res.error);
      }
    } catch (err) {
      showToast(
        'error',
        err.response?.data?.error || err.message || 'Failed to save schedule'
      );
    } finally {
      setScheduleSaving(false);
    }
  };

  const handleRunScheduleNow = async () => {
    setScheduleSaving(true);
    try {
      await putSchedule({
        time: scheduleTime,
        city: city.trim(),
        phone: phone.trim(),
        desiredReminders: reminders.trim(),
      });
      const res = await runScheduleNow();
      if (res.success) {
        if (res.data.weather) setWeather(res.data.weather);
        if (res.data.advice) setAdvice(res.data.advice);
        showToast('success', 'Cron job ran — check WhatsApp.');
      } else {
        throw new Error(res.error);
      }
    } catch (err) {
      showToast(
        'error',
        err.response?.data?.error || err.message || 'Failed to run job'
      );
    } finally {
      setScheduleSaving(false);
    }
  };

  const schedulePreview = (() => {
    try {
      const { hour, minute } = parseTimeInput(scheduleTime);
      return {
        cron: timeToCron(hour, minute),
        label: formatScheduleLabel(hour, minute),
      };
    } catch {
      return { cron: '—', label: '—' };
    }
  })();

  const handleRunTest = async () => {
    try {
      const res = await getTest();
      setTestInfo(res);
      showToast('success', 'Backend test endpoint OK.');
    } catch (err) {
      showToast('error', err.message || 'Test endpoint failed');
    }
  };

  useEffect(() => {
    const init = async () => {
      setConnectionError(null);
      try {
        await getHealth();
        setServerOnline(true);
        const res = await getConfig();
        if (res.success) {
          setConfig(res.data);
          const defaultCity = res.data.defaultCity || 'Bangalore';
          const defaultPhone = res.data.defaultWhatsAppTo || '';
          setCity(defaultCity);
          setPhone(defaultPhone);
          await loadWeather(defaultCity);
          await loadSchedule();
        }
      } catch (err) {
        setServerOnline(false);
        const hint =
          API_BASE.includes('localhost') &&
          typeof window !== 'undefined' &&
          !window.location.hostname.includes('localhost')
            ? ' Add NEXT_PUBLIC_API_URL=https://knowcityweather-pazk.onrender.com on Vercel → redeploy.'
            : ' Wait ~60s if Render was sleeping, then click Refresh status.';
        setConnectionError((err.message || 'Cannot reach backend') + hint);
      }
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    loadWeather(city);
  };

  return (
    <>
      <Head>
        <title>KnowCityWeather — Dashboard</title>
        <meta
          name="description"
          content="Weather dashboard with AI advice and WhatsApp alerts"
        />
      </Head>

      <div className="min-h-screen bg-[#0b1220] text-slate-100">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        {toast && (
          <div
            className={`fixed right-4 top-4 z-50 max-w-sm rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.text}
          </div>
        )}

        <header className="relative border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                KnowCityWeather
              </h1>
              <p className="mt-0.5 text-sm text-slate-400">
                Weather · AI advice · WhatsApp alerts
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill
                label="Backend"
                ok={serverOnline === true}
                warn={serverOnline === null}
                fail={serverOnline === false}
              />
              {config && (
                <>
                  <StatusPill label="Twilio" ok={config.hasTwilio} />
                  <StatusPill label="Gemini" ok={config.hasGemini} />
                </>
              )}
              {scheduleMeta && (
                <StatusPill
                  label={
                    scheduleMeta.enabled && scheduleMeta.isRunning
                      ? `Cron ${scheduleMeta.label}`
                      : 'Cron paused'
                  }
                  ok={scheduleMeta.enabled && scheduleMeta.isRunning}
                  fail={!scheduleMeta.enabled}
                />
              )}
              <button
                type="button"
                onClick={checkServer}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10"
              >
                Refresh status
              </button>
            </div>
          </div>
        </header>

        {connectionError && (
          <div className="relative mx-auto max-w-6xl px-4 pt-4">
            <div className="rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
              <p className="font-medium">Cannot reach backend</p>
              <p className="mt-1 text-red-200/90">{connectionError}</p>
              <p className="mt-2 text-xs text-red-200/70">
                Calling: <code className="text-red-100">{API_BASE}/api/health</code>
              </p>
            </div>
          </div>
        )}

        <main className="relative mx-auto max-w-6xl px-4 py-8">
          <div className="mb-8 grid gap-4 lg:grid-cols-2">
            <form
              onSubmit={handleSearch}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-sky-300">
                <span>📍</span> City search
              </h2>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                City
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bangalore, London"
                  className="flex-1 rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
                <button
                  type="submit"
                  disabled={weatherLoading}
                  className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-400 disabled:opacity-50"
                >
                  {weatherLoading ? '…' : 'Get weather'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => loadWeather(city)}
                disabled={weatherLoading}
                className="mt-2 text-sm text-slate-400 hover:text-white"
              >
                ↻ Refresh weather
              </button>
            </form>

            <form
              onSubmit={handleSaveSchedule}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-300">
                <span>⏰</span> Daily WhatsApp cron
              </h2>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="mb-3 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <p className="mb-3 rounded-lg bg-black/25 px-3 py-2 text-xs text-slate-400">
                <span className="text-slate-300">Cron:</span>{' '}
                <code className="text-amber-200">{schedulePreview.cron}</code>
                <span className="mx-2 text-slate-600">·</span>
                Daily at{' '}
                <span className="text-amber-200">{schedulePreview.label}</span>
                {scheduleMeta?.timezone && (
                  <span className="text-slate-500">
                    {' '}
                    ({scheduleMeta.timezone})
                  </span>
                )}
              </p>
              <label className="mb-3 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={scheduleEnabled}
                  onChange={(e) => setScheduleEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 accent-amber-500"
                />
                Enable daily schedule
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={scheduleSaving || !serverOnline}
                  className="flex-1 rounded-xl bg-amber-600 py-3 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {scheduleSaving ? 'Saving…' : 'Save schedule'}
                </button>
                <button
                  type="button"
                  onClick={handleRunScheduleNow}
                  disabled={scheduleSaving || !serverOnline}
                  className="rounded-xl border border-amber-500/40 px-4 py-3 text-sm font-medium text-amber-200 hover:bg-amber-500/10 disabled:opacity-50"
                >
                  Run now
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Uses current city, phone, and AI reminders. Default: 7:00 AM (
                <code>0 7 * * *</code>).
              </p>
            </form>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <section className="lg:col-span-3 space-y-6">
              <WeatherCard
                weather={weather}
                loading={weatherLoading}
                error={weatherError}
                onRetry={() => loadWeather(city)}
              />

              <Panel title="Backend diagnostics" icon="🔧">
                <p className="mb-3 text-sm text-slate-400">
                  API base: <code className="text-sky-300">{API_BASE}</code>
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleRunTest}
                    className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
                  >
                    Run /api/test
                  </button>
                  <button
                    type="button"
                    onClick={checkServer}
                    className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
                  >
                    Ping /api/health
                  </button>
                </div>
                {testInfo && (
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs text-emerald-200">
                    {JSON.stringify(testInfo, null, 2)}
                  </pre>
                )}
              </Panel>
            </section>

            <section className="lg:col-span-2 space-y-6">
              <Panel title="AI weather advice" icon="🤖">
                <p className="mb-3 text-sm text-slate-400">
                  Uses Gemini via <code className="text-sky-300">POST /api/advice</code>
                </p>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Extra reminders (optional)
                </label>
                <textarea
                  value={reminders}
                  onChange={(e) => setReminders(e.target.value)}
                  rows={3}
                  placeholder="e.g. commute at 9am, gym in the evening…"
                  className="mb-3 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleGenerateAdvice}
                  disabled={adviceLoading}
                  className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
                >
                  {adviceLoading ? 'Generating…' : 'Generate advice'}
                </button>
                {!config?.hasGemini && config && (
                  <p className="mt-2 text-xs text-amber-400">
                    Add GEMINI_API_KEY to backend .env
                  </p>
                )}
                {advice && (
                  <div className="mt-4 rounded-xl border border-violet-400/30 bg-violet-500/10 p-4">
                    <p className="mb-2 text-xs font-medium uppercase text-violet-300">
                      Preview (editable)
                    </p>
                    <textarea
                      value={advice}
                      onChange={(e) => setAdvice(e.target.value)}
                      rows={6}
                      className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-100 focus:outline-none"
                    />
                  </div>
                )}
              </Panel>

              <Panel title="WhatsApp alerts" icon="📱">
                <p className="mb-3 text-sm text-slate-400">
                  Twilio sandbox — include country code (e.g. +91…)
                </p>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+9198XXXXXXXX"
                  className="mb-4 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                />

                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Custom message
                </label>
                {/* <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  placeholder="Static alert text…"
                  className="mb-3 w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendCustom}
                  disabled={actionLoading} //|| !config?.hasTwilio
                  className="mb-3 w-full rounded-xl border border-emerald-500/50 py-2.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50"
                >
                  Send custom message
                </button> */}

                <button
                  type="button"
                  onClick={handleSmartAlert}
                  disabled={ actionLoading } //|| !config?.hasTwilio || !config?.hasGemini
                  className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {actionLoading ? 'Sending…' : 'Send smart alert'}
                </button>
                <p className="mt-2 text-xs text-slate-500">
                  Smart alert: weather → AI → WhatsApp (
                  <code>POST /api/alert/smart</code>). Uses preview text if
                  filled, otherwise generates fresh advice.
                </p>
                {!config?.hasTwilio && config && (
                  <p className="mt-2 text-xs text-amber-400">
                    Add Twilio credentials to backend .env
                  </p>
                )}
              </Panel>
            </section>
          </div>
        </main>

        <footer className="relative mt-12 border-t border-white/10 py-6 text-center text-sm text-slate-500">
          KnowCityWeather · Next.js + Express · OpenWeather · Gemini · Twilio
        </footer>
      </div>
    </>
  );
}

function Panel({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function StatusPill({ label, ok, warn, fail }) {
  let bg = 'bg-slate-600';
  let dot = 'bg-slate-400';
  if (ok) {
    bg = 'bg-emerald-500/20';
    dot = 'bg-emerald-400';
  } else if (fail) {
    bg = 'bg-red-500/20';
    dot = 'bg-red-400';
  } else if (warn) {
    bg = 'bg-amber-500/20';
    dot = 'bg-amber-400';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${bg} text-slate-200`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
