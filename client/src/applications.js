export const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];
export const PRIORITIES = ["High", "Medium", "Low"];

export function startOfToday(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function calendarDay(value) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isFollowUpDue(application, today = startOfToday()) {
  if (!application.followUpDate) {
    return false;
  }

  return calendarDay(application.followUpDate).getTime() <= today.getTime();
}

export function needsFollowUp(application, today = startOfToday()) {
  return (
    Boolean(application.followUpDate) &&
    isFollowUpDue(application, today) &&
    application.status !== "Rejected" &&
    application.status !== "Offer"
  );
}

function followUpBucket(application, today) {
  if (!application.followUpDate) {
    return 3;
  }

  const day = calendarDay(application.followUpDate).getTime();
  const start = today.getTime();

  if (day < start) {
    return 0;
  }
  if (day === start) {
    return 1;
  }
  return 2;
}

export function sortApplications(applications, today = startOfToday()) {
  return [...applications].sort((a, b) => {
    const bucketDiff = followUpBucket(a, today) - followUpBucket(b, today);
    if (bucketDiff !== 0) {
      return bucketDiff;
    }

    if (followUpBucket(a, today) === 3) {
      const aApplied = a.dateApplied ? new Date(a.dateApplied).getTime() : 0;
      const bApplied = b.dateApplied ? new Date(b.dateApplied).getTime() : 0;
      if (aApplied !== bApplied) {
        return bApplied - aApplied;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    return new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime();
  });
}

export function toInputDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function display(value) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || "—";
}
