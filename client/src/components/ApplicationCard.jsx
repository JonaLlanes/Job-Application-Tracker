import { display, formatDate } from "../applications.js";

function jobHref(link) {
  if (!link) {
    return "";
  }
  if (/^https?:\/\//i.test(link)) {
    return link;
  }
  return `https://${link}`;
}

export default function ApplicationCard({ application, onEdit, onDelete }) {
  const due = Boolean(application.followUpDue);

  return (
    <article className={`card${due ? " card-due" : ""}`}>
      <header className="card-header">
        <div>
          <h2>{application.company}</h2>
          <p className="role">{application.role}</p>
        </div>
        {due ? <span className="due-mark">⚠ Follow Up</span> : null}
      </header>

      <div className="badges">
        <span className={`badge status status-${application.status.toLowerCase()}`}>
          {application.status}
        </span>
        <span className={`badge priority priority-${application.priority.toLowerCase()}`}>
          {application.priority}
        </span>
      </div>

      <dl className="details">
        <div>
          <dt>Location</dt>
          <dd>{display(application.location)}</dd>
        </div>
        <div>
          <dt>Salary</dt>
          <dd>{display(application.salary)}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{display(application.source)}</dd>
        </div>
        <div>
          <dt>Date applied</dt>
          <dd>{formatDate(application.dateApplied)}</dd>
        </div>
        <div>
          <dt>Follow-up</dt>
          <dd>{formatDate(application.followUpDate)}</dd>
        </div>
        <div>
          <dt>Job link</dt>
          <dd>
            {application.jobLink ? (
              <a href={jobHref(application.jobLink)} target="_blank" rel="noreferrer">
                {application.jobLink}
              </a>
            ) : (
              "—"
            )}
          </dd>
        </div>
      </dl>

      <div className="notes">
        <h3>Notes</h3>
        <p>{display(application.notes)}</p>
      </div>

      <div className="card-actions">
        <button type="button" onClick={() => onEdit(application)}>
          Edit
        </button>
        <button type="button" className="danger" onClick={() => onDelete(application)}>
          Delete
        </button>
      </div>
    </article>
  );
}
