import React, { useContext, useEffect, useMemo, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { Avatar, ConfirmDialog, EmptyState, PageHeader, SearchInput, Skeleton, StatusBadge, Tabs } from "../../components/ui";
import useDocumentTitle from "../../utils/useDocumentTitle";
import Icon from "../../components/Icon";

const FILTERS = {
  all: () => true,
  upcoming: (a) => !a.cancelled && !a.isCompleted,
  completed: (a) => !a.cancelled && a.isCompleted,
  cancelled: (a) => a.cancelled,
};

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);
  const [filter, setFilter] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [toCancel, setToCancel] = useState(null);
  useDocumentTitle("Appointments");

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  const list = appointments || [];
  const counts = useMemo(() => Object.fromEntries(Object.entries(FILTERS).map(([k, fn]) => [k, list.filter(fn).length])), [list]);
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter(FILTERS[filter]).filter((a) => !q || a.userData.name.toLowerCase().includes(q));
  }, [list, filter, search]);

  return (
    <div className="animate-fade-up">
      <PageHeader title="Appointments" subtitle={`${list.length} total · ${counts.upcoming} upcoming`} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Tabs
          active={filter}
          onChange={setFilter}
          tabs={[
            { key: "upcoming", label: "Upcoming", count: counts.upcoming },
            { key: "completed", label: "Completed", count: counts.completed },
            { key: "cancelled", label: "Cancelled", count: counts.cancelled },
            { key: "all", label: "All", count: counts.all },
          ]}
        />
        <SearchInput value={search} onChange={setSearch} placeholder="Search patient" />
      </div>

      <div className="card overflow-hidden">
        <div className="hidden grid-cols-[2.2fr_0.9fr_0.6fr_1.8fr_0.8fr_1fr_1fr] gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-muted md:grid">
          <p>Patient</p><p>Payment</p><p>Age</p><p>Date & time</p><p>Fees</p><p>Status</p><p className="text-right">Action</p>
        </div>

        {appointments === null ? (
          <div className="space-y-3 p-6">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : shown.length === 0 ? (
          <EmptyState title={`No ${filter === "all" ? "" : filter + " "}appointments`} text="Nothing to show here right now." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {shown.map((item) => (
              <li key={item._id} className="grid items-center gap-x-3 gap-y-2 px-6 py-3.5 text-sm transition hover:bg-slate-50 md:grid-cols-[2.2fr_0.9fr_0.6fr_1.8fr_0.8fr_1fr_1fr]">
                <div className="flex items-center gap-3">
                  <Avatar src={item.userData.image} name={item.userData.name} />
                  <p className="truncate font-semibold">{item.userData.name}</p>
                </div>
                <div><span className="rounded-full border border-primary-200 px-2.5 py-0.5 text-xs font-medium text-primary-600">{item.payment ? "Online" : "Unpaid"}</span></div>
                <p className="text-ink-soft"><span className="text-ink-muted md:hidden">Age: </span>{calculateAge(item.userData.dob)}</p>
                <p className="text-ink-soft">{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                <p className="font-medium">{currency}{item.amount}</p>
                <div><StatusBadge item={item} /></div>
                <div className="flex gap-1 md:justify-end">
                  {!item.cancelled && !item.isCompleted && (
                    <>
                      <button onClick={() => setToCancel(item)} className="rounded-full p-2 text-ink-muted transition hover:bg-red-50 hover:text-red-500" aria-label="Cancel appointment"><Icon name="x" className="h-4 w-4" /></button>
                      <button onClick={() => completeAppointment(item._id)} className="rounded-full p-2 text-ink-muted transition hover:bg-emerald-50 hover:text-emerald-600" aria-label="Mark completed"><Icon name="check" className="h-4 w-4" /></button>
                    </>
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
        message={toCancel ? `${toCancel.userData.name}'s visit on ${slotDateFormat(toCancel.slotDate)} will be cancelled and the slot freed.` : ""}
        confirmLabel="Cancel appointment"
        onConfirm={() => cancelAppointment(toCancel._id)}
        onClose={() => setToCancel(null)}
      />
    </div>
  );
};

export default DoctorAppointments;
