import React, { useContext, useEffect, useMemo, useState } from "react";
import { AdminContext } from "@/store/AdminContext";
import { AppContext } from "@/store/AppContext";
import Avatar from "@/components/common/Avatar";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Skeleton from "@/components/common/Skeleton";
import StatusBadge from "@/components/common/StatusBadge";
import Tabs from "@/components/common/Tabs";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";
import Icon from "@/components/common/Icon";

const FILTERS = {
  all: () => true,
  upcoming: (a) => !a.cancelled && !a.isCompleted,
  completed: (a) => !a.cancelled && a.isCompleted,
  cancelled: (a) => a.cancelled,
};

const AdminAppointmentsView = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toCancel, setToCancel] = useState(null);
  useDocumentTitle("Appointments");

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  const list = appointments || [];
  const counts = useMemo(
    () => Object.fromEntries(Object.entries(FILTERS).map(([k, fn]) => [k, list.filter(fn).length])),
    [list]
  );
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list
      .filter(FILTERS[filter])
      .filter(
        (a) =>
          !q ||
          a.userData.name.toLowerCase().includes(q) ||
          a.docData.name.toLowerCase().includes(q)
      );
  }, [list, filter, search]);

  return (
    <div className="animate-fade-up">
      <PageHeader title="Appointments" subtitle={`${list.length} total bookings`} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Tabs
          active={filter}
          onChange={setFilter}
          tabs={[
            { key: "all", label: "All", count: counts.all },
            { key: "upcoming", label: "Upcoming", count: counts.upcoming },
            { key: "completed", label: "Completed", count: counts.completed },
            { key: "cancelled", label: "Cancelled", count: counts.cancelled },
          ]}
        />
        <SearchInput value={search} onChange={setSearch} placeholder="Search patient or doctor" />
      </div>

      <div className="card overflow-hidden">
        <div className="hidden grid-cols-[2.2fr_0.6fr_1.6fr_2fr_0.8fr_1fr_0.5fr] gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-muted md:grid">
          <p>Patient</p>
          <p>Age</p>
          <p>Date & time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
          <p />
        </div>

        {appointments === null ? (
          <div className="space-y-3 p-6">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <EmptyState
            title="No appointments found"
            text={
              search || filter !== "all"
                ? "Try a different filter or search."
                : "Bookings will show up here."
            }
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {shown.map((item) => (
              <li
                key={item._id}
                className="grid items-center gap-x-3 gap-y-2 px-6 py-3.5 text-sm transition hover:bg-slate-50 md:grid-cols-[2.2fr_0.6fr_1.6fr_2fr_0.8fr_1fr_0.5fr]"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={item.userData.image} name={item.userData.name} />
                  <p className="truncate font-semibold">{item.userData.name}</p>
                </div>
                <p className="text-ink-soft">
                  <span className="text-ink-muted md:hidden">Age: </span>
                  {calculateAge(item.userData.dob)}
                </p>
                <p className="text-ink-soft">
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>
                <div className="flex items-center gap-3">
                  <Avatar src={item.docData.image} name={item.docData.name} />
                  <p className="truncate">{item.docData.name}</p>
                </div>
                <p className="font-medium">
                  {currency}
                  {item.amount}
                </p>
                <div>
                  <StatusBadge item={item} />
                </div>
                <div className="md:text-right">
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => setToCancel(item)}
                      className="rounded-full p-2 text-ink-muted transition hover:bg-red-50 hover:text-red-500"
                      aria-label="Cancel appointment"
                    >
                      <Icon name="x" className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={!!toCancel}
        danger
        title="Cancel this appointment?"
        message={
          toCancel
            ? `${toCancel.userData.name}'s visit with ${toCancel.docData.name} on ${slotDateFormat(toCancel.slotDate)} will be cancelled and the slot freed.`
            : ""
        }
        confirmLabel="Cancel appointment"
        onConfirm={() => cancelAppointment(toCancel._id)}
        onClose={() => setToCancel(null)}
      />
    </div>
  );
};

export default AdminAppointmentsView;
