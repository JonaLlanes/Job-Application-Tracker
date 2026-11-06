import { useState } from "react";
import { PRIORITIES, STATUSES, toInputDate } from "../applications.js";

const EMPTY = {
  company: "",
  role: "",
  status: "Saved",
  priority: "Medium",
  dateApplied: "",
  followUpDate: "",
  location: "",
  salary: "",
  source: "",
  jobLink: "",
  notes: "",
};

function fromApplication(application) {
  if (!application) {
    return EMPTY;
  }

  return {
    company: application.company ?? "",
    role: application.role ?? "",
    status: application.status ?? "Saved",
    priority: application.priority ?? "Medium",
    dateApplied: toInputDate(application.dateApplied),
    followUpDate: toInputDate(application.followUpDate),
    location: application.location ?? "",
    salary: application.salary ?? "",
    source: application.source ?? "",
    jobLink: application.jobLink ?? "",
    notes: application.notes ?? "",
  };
}

export default function ApplicationForm({ application, onClose, onSubmit }) {
  const [values, setValues] = useState(() => fromApplication(application));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const editing = Boolean(application);

  function update(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await onSubmit(values);
    } catch (submitError) {
      setError(submitError.message);
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-form-title"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 id="application-form-title">{editing ? "Edit application" : "Add application"}</h2>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="form-grid">
          <label>
            Company
            <input name="company" value={values.company} onChange={update} autoFocus />
          </label>
          <label>
            Role
            <input name="role" value={values.role} onChange={update} />
          </label>
          <label>
            Status
            <select name="status" value={values.status} onChange={update}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select name="priority" value={values.priority} onChange={update}>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date applied
            <input type="date" name="dateApplied" value={values.dateApplied} onChange={update} />
          </label>
          <label>
            Follow-up date
            <input type="date" name="followUpDate" value={values.followUpDate} onChange={update} />
          </label>
          <label>
            Location
            <input name="location" value={values.location} onChange={update} />
          </label>
          <label>
            Salary
            <input
              name="salary"
              value={values.salary}
              onChange={update}
              placeholder="$120k–$140k"
            />
          </label>
          <label className="span-2">
            Source
            <input
              name="source"
              value={values.source}
              onChange={update}
              placeholder="LinkedIn, Company Site, Referral - John"
            />
          </label>
          <label className="span-2">
            Job link
            <input name="jobLink" value={values.jobLink} onChange={update} />
          </label>
          <label className="span-2">
            Notes
            <textarea name="notes" rows="4" value={values.notes} onChange={update} />
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="primary" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
