import { useState } from "react";

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Loader2,
  HeartPulse,
  RotateCcw,
  ShieldCheck,
  UserRound,
  Scale,
  Droplets,
  FlaskConical,
  TrendingUp,
  Info,
} from "lucide-react";

function DiabetesAssessment({ apiBase }) {
  const initialForm = {
    age: "",
    gender: "",
    bmi: "",
    systolic_bp: "",
    diastolic_bp: "",
    cholesterol: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${apiBase}/api/predict/diabetes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            age: Number(formData.age),
            gender: Number(formData.gender),
            bmi: Number(formData.bmi),
            systolic_bp: Number(formData.systolic_bp),
            diastolic_bp: Number(formData.diastolic_bp),
            cholesterol: Number(formData.cholesterol),
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        const detail = responseData.detail;

        throw new Error(
          Array.isArray(detail)
            ? detail.map((item) => item.msg).join(", ")
            : detail || "Unable to complete assessment."
        );
      }

      // The backend wraps the actual result inside responseData.data.
      setResult(responseData.data);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFormData(initialForm);
    setResult(null);
    setError("");
  }

  const measurements = [
    {
      label: "Age",
      value: `${formData.age} years`,
    },
    {
      label: "Sex",
      value: formData.gender === "1" ? "Male" : "Female",
    },
    {
      label: "BMI",
      value: `${formData.bmi} kg/m²`,
    },
    {
      label: "Systolic BP",
      value: `${formData.systolic_bp} mmHg`,
    },
    {
      label: "Diastolic BP",
      value: `${formData.diastolic_bp} mmHg`,
    },
    {
      label: "Total cholesterol",
      value: `${formData.cholesterol} mg/dL`,
    },
  ];

  // Select an appropriate icon for each health measurement.
  function getInsightIcon(parameter) {
    if (parameter === "BMI") return <Scale size={21} />;
    if (parameter === "Blood Pressure") return <HeartPulse size={21} />;
    if (parameter === "Total Cholesterol") return <Droplets size={21} />;

    return <Activity size={21} />;
  }

  // Use the attention level returned by the backend.
  function getAttentionLabel(attention) {
    if (attention === "high") return "Needs attention";
    if (attention === "moderate") return "Worth monitoring";

    return "Within usual range";
  }

  return (
    <section className="assessment-section" id="assessment">

      {/* Assessment introduction */}
      <div className="assessment-header">
        <div>
          <p className="eyebrow">PERSONALIZED HEALTH MONITORING</p>
          <h2>Personal Health Assessment</h2>
          <p className="assessment-intro">
            Explore your health measurements through simple health
            explanations and an experimental machine-learning assessment.
          </p>
        </div>

        <div className="assessment-header-icon">
          <HeartPulse size={30} />
        </div>
      </div>

      {/* Assessment form */}
      <div className="assessment-layout">
        <div className="assessment-form-card">

          <div className="assessment-card-heading">
            <div className="assessment-heading-icon">
              <Activity size={20} />
            </div>

            <div>
              <h3>Health measurements</h3>
              <p>Enter your measurements in the fields below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="assessment-fields">

              <label className="assessment-field">
                <span>
                  <UserRound size={16} />
                  Age (years)
                </span>

                <input
                  type="number"
                  name="age"
                  min="18"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 45"
                  required
                />
              </label>

              <label className="assessment-field">
                <span>
                  <UserRound size={16} />
                  Sex
                </span>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select sex</option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                </select>
              </label>

              <label className="assessment-field">
                <span>
                  <Scale size={16} />
                  BMI (kg/m²)
                </span>

                <input
                  type="number"
                  name="bmi"
                  min="10"
                  max="80"
                  step="0.1"
                  value={formData.bmi}
                  onChange={handleChange}
                  placeholder="e.g. 29.5"
                  required
                />
              </label>

              <label className="assessment-field">
                <span>
                  <Activity size={16} />
                  Systolic BP (mmHg)
                </span>

                <input
                  type="number"
                  name="systolic_bp"
                  min="50"
                  max="300"
                  step="0.1"
                  value={formData.systolic_bp}
                  onChange={handleChange}
                  placeholder="e.g. 135"
                  required
                />
              </label>

              <label className="assessment-field">
                <span>
                  <Activity size={16} />
                  Diastolic BP (mmHg)
                </span>

                <input
                  type="number"
                  name="diastolic_bp"
                  min="20"
                  max="200"
                  step="0.1"
                  value={formData.diastolic_bp}
                  onChange={handleChange}
                  placeholder="e.g. 85"
                  required
                />
              </label>

              <label className="assessment-field">
                <span>
                  <Droplets size={16} />
                  Total cholesterol (mg/dL)
                </span>

                <input
                  type="number"
                  name="cholesterol"
                  min="50"
                  max="600"
                  step="0.1"
                  value={formData.cholesterol}
                  onChange={handleChange}
                  placeholder="e.g. 220"
                  required
                />
              </label>

            </div>

            <div className="assessment-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="spin" size={17} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Activity size={17} />
                    Generate Assessment
                  </>
                )}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleReset}
                disabled={loading}
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </form>

          {error && (
            <div className="assessment-error">
              <AlertCircle size={19} />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Supporting information */}
        <aside className="assessment-side-card">
          <div className="assessment-side-icon">
            <ShieldCheck size={24} />
          </div>

          <p className="eyebrow">HOW IT WORKS</p>
          <h3>From measurements to health insights</h3>

          <p>
            Your submitted measurements are sent to the FastAPI backend.
            The system generates educational explanations of selected
            health indicators and runs an experimental ML model.
          </p>

          <div className="assessment-process">
            <div>
              <span>01</span>
              <p>Enter health measurements</p>
            </div>

            <div>
              <span>02</span>
              <p>Analyze submitted measurements</p>
            </div>

            <div>
              <span>03</span>
              <p>Explore health insights and model output</p>
            </div>
          </div>

          <div className="assessment-side-note">
            <FlaskConical size={17} />
            <span>Experimental research prototype</span>
          </div>
        </aside>
      </div>

      {/* Assessment result */}
      {result && (
        <div className="assessment-result">

          {/* Health insights section */}
          <div className="health-insights-section">

            <div className="health-insights-heading">
              <div className="result-icon">
                <HeartPulse size={24} />
              </div>

              <div>
                <p className="eyebrow">YOUR HEALTH REPORT</p>
                <h3>Personal Health Insights</h3>
                <p>
                  Understand what your submitted measurements may indicate.
                </p>
              </div>
            </div>

            <div className="health-insights-grid">
              {(result.health_insights || []).map((insight) => (
                <div
                  className={`health-insight-card attention-${insight.attention}`}
                  key={insight.parameter}
                >
                  <div className="health-insight-top">
                    <div className="health-insight-icon">
                      {getInsightIcon(insight.parameter)}
                    </div>

                    <span className={`attention-badge attention-${insight.attention}`}>
                      {getAttentionLabel(insight.attention)}
                    </span>
                  </div>

                  <h4>{insight.parameter}</h4>

                  <strong className="health-insight-value">
                    {insight.value}
                  </strong>

                  <p className="health-insight-status">
                    {insight.status}
                  </p>

                  <p className="health-insight-explanation">
                    {insight.explanation}
                  </p>
                </div>
              ))}
            </div>

            {/* Areas to pay attention to */}
            <div className="health-attention-summary">
              <div className="attention-summary-heading">
                <TrendingUp size={20} />
                <h4>Areas to pay attention to</h4>
              </div>

              {result.health_insights?.some(
                (item) => item.attention === "moderate" || item.attention === "high"
              ) ? (
                <>
                  <p>
                    Some of your submitted measurements are outside
                    commonly used desirable ranges. Consider monitoring
                    these measurements and discussing them with a
                    qualified healthcare professional.
                  </p>

                  <ul>
                    {result.health_insights
                      .filter(
                        (item) =>
                          item.attention === "moderate" ||
                          item.attention === "high"
                      )
                      .map((item) => (
                        <li key={item.parameter}>
                          <strong>{item.parameter}:</strong>{" "}
                          {item.status}
                        </li>
                      ))}
                  </ul>
                </>
              ) : (
                <p>
                  The submitted measurements fall within the reference
                  categories used by this prototype. This does not
                  guarantee that all aspects of your health are normal.
                </p>
              )}
            </div>

            <div className="health-insights-note">
              <Info size={18} />
              <p>
                These observations are based on general adult reference
                categories. They are educational explanations, not a
                diagnosis or a complete evaluation of your health.
              </p>
            </div>
          </div>

          {/* ML model result */}
          <div className="ml-result-section">

            <div className="result-top">
              <div className="result-icon">
                <CheckCircle2 size={24} />
              </div>

              <div>
                <p className="eyebrow">MACHINE LEARNING OUTPUT</p>
                <h3>Experimental Model Assessment</h3>
              </div>
            </div>

            <div className="result-classification">
              <span>Experimental model classification</span>

              <h2>
                {result.prediction === 1
                  ? "Positive pattern identified"
                  : "No positive pattern identified"}
              </h2>

              <p>{result.message}</p>
            </div>

            <div className="result-stats">
              <div className="result-stat">
                <span>Model score</span>
                <strong>
                  {Number(result.model_score).toFixed(3)}
                </strong>
                <small>Uncalibrated model output</small>
              </div>

              <div className="result-stat">
                <span>Classification threshold</span>
                <strong>
                  {Number(result.threshold).toFixed(2)}
                </strong>
                <small>Configured model threshold</small>
              </div>
            </div>

            <div className="submitted-measurements">
              <h4>Submitted measurements</h4>

              <div className="submitted-grid">
                {measurements.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="result-disclaimer">
              <AlertCircle size={19} />
              <p>
                {result.disclaimer} This experimental output should
                not be used to make medical decisions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Permanent research disclaimer */}
      <div className="assessment-research-note">
        <ShieldCheck size={20} />

        <p>
          <strong>Research prototype only.</strong> This model was
          trained using NHANES survey data. Its score is not a
          calibrated personal disease probability, does not predict
          future disease onset, and is not a medical diagnosis.
          Consult a qualified healthcare professional about health
          concerns.
        </p>
      </div>
    </section>
  );
}

export default DiabetesAssessment;