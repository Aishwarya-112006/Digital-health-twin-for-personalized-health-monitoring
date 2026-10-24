import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  HeartPulse,
  Menu,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  X,
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowRight,
  LogOut,
} from "lucide-react";
import "./App.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const SESSION_KEY = "swasthya-demo-session";

const DEMO_USERNAME = "demo";
const DEMO_PASSWORD = "HealthDemo@123";

const METRICS = [
  { key: "BMXBMI", label: "Body mass index", unit: "kg/m²" },
  { key: "BPXOSY1", label: "Systolic pressure", unit: "mmHg" },
  { key: "BPXODI1", label: "Diastolic pressure", unit: "mmHg" },
  { key: "LBXGH", label: "HbA1c", unit: "%" },
  { key: "BMXWT", label: "Weight", unit: "kg" },
  { key: "BMXHT", label: "Height", unit: "cm" },
  { key: "LBXTC", label: "Total cholesterol", unit: "mg/dL" },
];

function displayValue(value, unit = "") {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  return `${value}${unit ? ` ${unit}` : ""}`;
}

function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "active"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Dashboard state
  const [apiStatus, setApiStatus] = useState("checking");
  const [participants, setParticipants] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Demo login
  function handleLogin(event) {
    event.preventDefault();

    const enteredUsername = username.trim();

    if (
      enteredUsername === DEMO_USERNAME &&
      password === DEMO_PASSWORD
    ) {
      sessionStorage.setItem(SESSION_KEY, "active");
      setLoginError("");
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
    } else {
      setLoginError(
        "Invalid credentials. Please check the username and password."
      );
    }
  }

  // Logout
  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setLoginError("");
    setMobileMenuOpen(false);
  }

  // API helper
  async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    return response.json();
  }

  // Load participant list
  async function loadParticipants() {
    try {
      setError("");

      const data = await fetchJson(
        `${API_BASE}/api/participants?limit=100`
      );

      setParticipants(data);

      if (data.length > 0) {
        setSelectedId((currentId) => {
          if (
            currentId &&
            data.some(
              (participant) =>
                String(participant.SEQN) === currentId
            )
          ) {
            return currentId;
          }

          return String(data[0].SEQN);
        });
      } else {
        setSelectedId("");
        setProfile(null);
      }

      setApiStatus("connected");
    } catch {
      setError(
        `Could not load participants. Check that FastAPI is running at ${API_BASE}.`
      );
      setApiStatus("disconnected");
    }
  }

  // Load selected participant's health profile
  async function loadProfile(id) {
    if (!id) return;

    setLoading(true);
    setError("");
    setProfile(null);

    try {
      const data = await fetchJson(
        `${API_BASE}/api/participants/${encodeURIComponent(id)}`
      );

      setProfile(data);
      setApiStatus("connected");
    } catch (err) {
      setError(
        `Could not load participant ${id}. ${err.message}`
      );
      setApiStatus("disconnected");
    } finally {
      setLoading(false);
    }
  }

  // Initialize the dashboard API connection after login
  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;

    async function initialize() {
      try {
        await fetchJson(`${API_BASE}/api/health`);

        if (!cancelled) {
          setApiStatus("connected");
          await loadParticipants();
        }
      } catch {
        if (!cancelled) {
          setApiStatus("disconnected");
          setError(
            "The backend is unavailable. Start the FastAPI server and retry."
          );
        }
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  // Fetch the selected participant whenever the ID changes
  useEffect(() => {
    if (isLoggedIn && selectedId) {
      loadProfile(selectedId);
    }
  }, [isLoggedIn, selectedId]);

  // Derived dashboard data
  const healthData = profile?.health_data || {};

  const filteredParticipants = participants.filter((participant) =>
    String(participant.SEQN).includes(search.trim())
  );

  const availableMetrics = METRICS.filter(
    (metric) =>
      healthData[metric.key] !== null &&
      healthData[metric.key] !== undefined &&
      healthData[metric.key] !== ""
  );

  const missingCount = METRICS.length - availableMetrics.length;

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <main className="login-page">
        <section className="login-art-panel">
          <a
            className="brand login-brand"
            href="#login"
            aria-label="SwasthyaDrishti"
          >
            <span className="brand-mark">
              <Activity size={20} />
            </span>
            <span>SwasthyaDrishti</span>
          </a>

          <div className="login-art-content">
            <p className="eyebrow">YOUR HEALTH, IN A NEW LIGHT</p>

            <h1>
              A clearer view
              <br />
              of <span>health.</span>
            </h1>

            <p>
              Explore health information through a digital
              representation designed to make data easier to
              understand.
            </p>

            <div className="login-art-visual" aria-hidden="true">
              <div className="login-orbit login-orbit-one" />
              <div className="login-orbit login-orbit-two" />

              <div className="login-art-core">
                <HeartPulse size={58} strokeWidth={1.3} />
              </div>

              <span className="login-art-dot login-dot-one" />
              <span className="login-art-dot login-dot-two" />
              <span className="login-art-dot login-dot-three" />
            </div>

            <div className="login-feature">
              <span className="login-feature-icon">
                <ShieldCheck size={19} />
              </span>

              <div>
                <strong>Data-led exploration</strong>
                <p>Understand the available health measurements.</p>
              </div>
            </div>
          </div>

          <p className="login-art-footer">
            An academic Digital Health Twin prototype
          </p>
        </section>

        <section className="login-form-panel">
          <div className="login-form-container">
            <div className="login-mobile-brand">
              <span className="brand-mark">
                <Activity size={20} />
              </span>
              <span>SwasthyaDrishti</span>
            </div>

            <div className="login-heading">
              <span className="login-heading-icon">
                <LockKeyhole size={21} />
              </span>

              <p className="eyebrow">WELCOME BACK</p>

              <h2>Sign in to continue.</h2>

              <p>
                Enter the demo credentials to explore the health
                dashboard.
              </p>
            </div>

            <form
              className="demo-login-form"
              onSubmit={handleLogin}
            >
              <div className="login-field">
                <label htmlFor="login-username">Username</label>

                <div className="login-input-wrap">
                  <UserRound size={18} />

                  <input
                    id="login-username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="login-password">Password</label>

                <div className="login-input-wrap">
                  <LockKeyhole size={18} />

                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />

                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="login-error" role="alert">
                  <ShieldCheck size={17} />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                className="login-submit-button"
                type="submit"
              >
                Sign in to dashboard
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="demo-credentials">
              <div className="demo-credentials-heading">
                <ShieldCheck size={17} />
                <strong>Demo access</strong>
              </div>

              <p>Use these credentials to access the prototype.</p>

              <div className="demo-credential-row">
                <span>Username</span>
                <code>demo</code>
                <button
                  type="button"
                  onClick={() => setUsername("demo")}
                  aria-label="Fill demo username"
                >
                  Use
                </button>
              </div>

              <div className="demo-credential-row">
                <span>Password</span>
                <code>HealthDemo@123</code>
                <button
                  type="button"
                  onClick={() => setPassword("HealthDemo@123")}
                  aria-label="Fill demo password"
                >
                  Use
                </button>
              </div>
            </div>

            <p className="login-disclaimer">
              This is a frontend-only demonstration login. It is
              not a production authentication system.
            </p>
          </div>
        </section>
      </main>
    );
  }

  // DASHBOARD PAGE
  return (
    <div className="app-shell">
      <header className="topbar">
        <a
          className="brand"
          href="#overview"
          aria-label="SwasthyaDrishti home"
        >
          <span className="brand-mark">
            <Activity size={20} />
          </span>
          <span>SwasthyaDrishti</span>
        </a>

        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        <nav
          className={
            mobileMenuOpen
              ? "nav-links nav-open"
              : "nav-links"
          }
        >
          <a
            href="#overview"
            onClick={() => setMobileMenuOpen(false)}
          >
            Overview
          </a>

          <a
            href="#profile"
            onClick={() => setMobileMenuOpen(false)}
          >
            Health profile
          </a>

          <a
            href="#insights"
            onClick={() => setMobileMenuOpen(false)}
          >
            Insights
          </a>

          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>
        </nav>

        <div className="dashboard-account">
          <span className="dashboard-user-icon">
            <UserRound size={17} />
          </span>

          <span className="dashboard-user-label">Demo user</span>

          <button
            className="logout-button"
            onClick={handleLogout}
            title="Sign out"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        <div className={`connection-status ${apiStatus}`}>
          <span className="status-dot" />

          {apiStatus === "connected"
            ? "API connected"
            : apiStatus === "checking"
              ? "Connecting..."
              : "API disconnected"}
        </div>
      </header>

      <main>
        <section className="hero-section" id="overview">
          <div className="hero-copy">
            <p className="eyebrow">
              DIGITAL HEALTH TWIN · PROTOTYPE
            </p>

            <h1>
              Know your health.
              <br />
              <span>See the bigger picture.</span>
            </h1>

            <p className="hero-description">
              Explore an individual health profile built from
              available health measurements, with clear information
              and transparent insights.
            </p>

            <a href="#profile" className="primary-button">
              Explore health profile <ArrowDownRight size={18} />
            </a>

            <div className="hero-note">
              <ShieldCheck size={18} />
              <span>
                Data-led exploration. Human-centred understanding.
              </span>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="art-grid" />
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />

            <div className="art-core">
              <HeartPulse size={56} strokeWidth={1.2} />
            </div>

            <div className="art-node node-one" />
            <div className="art-node node-two" />
            <div className="art-node node-three" />

            <span className="art-label label-one">HEALTH DATA</span>
            <span className="art-label label-two">
              PERSONAL PROFILE
            </span>
            <span className="art-label label-three">INSIGHTS</span>
          </div>
        </section>

        <section className="overview-section section-frame">
          <div className="section-heading">
            <div>
              <p className="eyebrow">AT A GLANCE</p>
              <h2>Your health, in context.</h2>
            </div>

            <p className="section-description">
              A snapshot of the selected participant's available
              records.
            </p>
          </div>

          <div className="overview-grid">
            <article className="overview-card">
              <span className="card-icon">
                <UserRound size={20} />
              </span>

              <p className="card-label">Loaded participant</p>

              <strong>
                {profile ? profile.participant_id : "—"}
              </strong>

              <span className="card-footnote">
                NHANES participant ID
              </span>
            </article>

            <article className="overview-card">
              <span className="card-icon">
                <Activity size={20} />
              </span>

              <p className="card-label">Available indicators</p>

              <strong>
                {profile ? availableMetrics.length : "—"}
              </strong>

              <span className="card-footnote">
                From {METRICS.length} selected measurements
              </span>
            </article>

            <article className="overview-card">
              <span className="card-icon">
                <ShieldCheck size={20} />
              </span>

              <p className="card-label">Connection</p>

              <strong className="connection-value">
                {apiStatus === "connected"
                  ? "Connected"
                  : apiStatus === "checking"
                    ? "Checking"
                    : "Offline"}
              </strong>

              <span className="card-footnote">
                FastAPI data service
              </span>
            </article>
          </div>
        </section>

        <section
          className="profile-section section-frame"
          id="profile"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">PARTICIPANT PROFILE</p>
              <h2>A closer look at the data.</h2>
            </div>

            <button
              className="secondary-button"
              onClick={() => selectedId && loadProfile(selectedId)}
              disabled={loading || !selectedId}
            >
              <RefreshCw
                size={16}
                className={loading ? "spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div className="participant-toolbar">
            <label htmlFor="participant-search">
              Find a participant
            </label>

            <div className="search-control">
              <Search size={18} />

              <input
                id="participant-search"
                type="search"
                placeholder="Search participant ID..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <label htmlFor="participant-select">
              Participant ID
            </label>

            <select
              id="participant-select"
              value={selectedId}
              onChange={(event) =>
                setSelectedId(event.target.value)
              }
            >
              {filteredParticipants.map((participant) => (
                <option
                  key={participant.SEQN}
                  value={String(participant.SEQN)}
                >
                  {participant.SEQN}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="error-panel" role="alert">
              <p>{error}</p>

              <button
                className="secondary-button"
                onClick={loadParticipants}
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          )}

          {loading && (
            <p className="state-message">
              Loading health profile...
            </p>
          )}

          {!loading && profile && (
            <>
              <div className="profile-banner">
                <div>
                  <p className="eyebrow">SELECTED RECORD</p>

                  <h3>
                    Participant {profile.participant_id}
                  </h3>

                  <p>
                    Measurements shown only when present in the
                    source data.
                  </p>
                </div>

                <div className="record-badge">
                  <span className="status-dot" />
                  Record loaded
                </div>
              </div>

              <div className="metric-grid">
                {METRICS.map((metric, index) => {
                  const value = healthData[metric.key];

                  const available =
                    value !== null &&
                    value !== undefined &&
                    value !== "";

                  return (
                    <article
                      className="metric-card"
                      key={metric.key}
                    >
                      <div className="metric-card-top">
                        <span>{metric.label}</span>

                        {index % 2 === 0 ? (
                          <ArrowUpRight size={17} />
                        ) : (
                          <ArrowDownRight size={17} />
                        )}
                      </div>

                      <strong
                        className={
                          available ? "" : "unavailable"
                        }
                      >
                        {displayValue(
                          value,
                          available ? metric.unit : ""
                        )}
                      </strong>

                      <span className="metric-source">
                        {metric.key}
                      </span>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {!loading && !profile && !error && (
            <p className="state-message">
              Select a participant to view their health profile.
            </p>
          )}
        </section>

        <section
          className="insights-section section-frame"
          id="insights"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">DATA QUALITY & INSIGHTS</p>
              <h2>Understand what is available.</h2>
            </div>
          </div>

          <div className="insights-grid">
            <article className="insight-card insight-primary">
              <span className="insight-number">01 / PROFILE</span>

              <h3>Available measurements</h3>

              <p>
                {profile
                  ? `${availableMetrics.length} of ${METRICS.length} selected indicators have recorded values for this participant.`
                  : "Choose a participant to inspect the available measurements."}
              </p>
            </article>

            <article className="insight-card">
              <span className="insight-number">
                02 / COMPLETENESS
              </span>

              <h3>Missing information</h3>

              <p>
                {profile
                  ? `${missingCount} of the selected indicators are unavailable in this record. Missing values are not treated as zero.`
                  : "Missing information will be identified after a profile is loaded."}
              </p>
            </article>

            <article className="insight-card">
              <span className="insight-number">
                03 / INTERPRETATION
              </span>

              <h3>Context matters</h3>

              <p>
                Measurements provide a snapshot, not a diagnosis.
                Clinical interpretation requires appropriate
                context and professional review.
              </p>
            </article>
          </div>
        </section>

        <section
          className="about-section section-frame"
          id="about"
        >
          <div>
            <p className="eyebrow">ABOUT THE PROJECT</p>

            <h2>
              A foundation for a more personal view of health.
            </h2>
          </div>

          <p>
            SwasthyaDrishti is an academic Digital Health Twin
            prototype using available NHANES survey and examination
            data. This initial version connects a React interface
            to a FastAPI data service. Longitudinal tracking,
            predictive models and live wearable integration are
            future development goals, not features of this version.
          </p>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#overview">
          <span className="brand-mark">
            <Activity size={18} />
          </span>

          SwasthyaDrishti
        </a>

        <p>
          Academic prototype using NHANES data. For educational
          and informational purposes only; not a medical diagnosis.
        </p>
      </footer>
    </div>
  );
}

export default App;