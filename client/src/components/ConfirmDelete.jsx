import { useState } from "react";

export default function ConfirmDelete({ application, onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setDeleting(true);
    setError("");

    try {
      await onConfirm();
    } catch (deleteError) {
      setError(deleteError.message);
      setDeleting(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onCancel}>
      <div
        className="modal confirm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-delete-title">Delete application?</h2>
        <p>
          This removes <strong>{application.company}</strong> — {application.role}.
        </p>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="modal-actions">
          <button type="button" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button type="button" className="danger" onClick={handleConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
