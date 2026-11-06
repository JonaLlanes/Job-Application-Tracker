import { useEffect, useState } from "react";
import { createApplication, deleteApplication, listApplications, updateApplication } from "./api.js";
import { STATUSES, isFollowUpDue, needsFollowUp, sortApplications } from "./applications.js";
import ApplicationCard from "./components/ApplicationCard.jsx";
import ApplicationForm from "./components/ApplicationForm.jsx";
import ConfirmDelete from "./components/ConfirmDelete.jsx";
import StatusFilters from "./components/StatusFilters.jsx";

export default function App() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadApplications() {
    const next = await listApplications();
    setApplications(next);
  }

  useEffect(() => {
    loadApplications()
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  const filters = [
    { id: "All", label: "All", count: applications.length },
    ...STATUSES.map((status) => ({
      id: status,
      label: status,
      count: applications.filter((application) => application.status === status).length,
    })),
    {
      id: "Needs Follow-Up",
      label: "Needs Follow-Up",
      count: applications.filter((application) => needsFollowUp(application)).length,
    },
  ];

  const visible = sortApplications(
    applications.filter((application) => {
      if (filter === "All") {
        return true;
      }
      if (filter === "Needs Follow-Up") {
        return needsFollowUp(application);
      }
      return application.status === filter;
    })
  ).map((application) => ({
    ...application,
    followUpDue: isFollowUpDue(application),
  }));

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(application) {
    setEditing(application);
    setFormOpen(true);
  }

  async function saveApplication(values) {
    if (editing) {
      await updateApplication(editing._id, values);
    } else {
      await createApplication(values);
    }

    await loadApplications();
    setFormOpen(false);
    setEditing(null);
  }

  async function confirmDelete() {
    await deleteApplication(pendingDelete._id);
    await loadApplications();
    setPendingDelete(null);
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Personal</p>
          <h1>Job Application Tracker</h1>
        </div>
        <button type="button" className="primary" onClick={openCreate}>
          Add application
        </button>
      </header>

      <StatusFilters filters={filters} value={filter} onChange={setFilter} />

      {error ? <p className="form-error">{error}</p> : null}

      {loading ? <p className="empty">Loading applications…</p> : null}

      {!loading && applications.length === 0 ? (
        <p className="empty">No applications yet. Add one to start tracking.</p>
      ) : null}

      {!loading && applications.length > 0 && visible.length === 0 ? (
        <p className="empty">Nothing matches this filter.</p>
      ) : null}

      <section className="list">
        {visible.map((application) => (
          <ApplicationCard
            key={application._id}
            application={application}
            onEdit={openEdit}
            onDelete={setPendingDelete}
          />
        ))}
      </section>

      {formOpen ? (
        <ApplicationForm
          application={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={saveApplication}
        />
      ) : null}

      {pendingDelete ? (
        <ConfirmDelete
          application={pendingDelete}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </main>
  );
}
