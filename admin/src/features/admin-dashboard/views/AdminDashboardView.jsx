import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "@/store/AdminContext";
import { AppContext } from "@/store/AppContext";
import Avatar from "@/components/common/Avatar";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import Skeleton from "@/components/common/Skeleton";
import StatCard from "@/components/common/StatCard";
import StatusBadge from "@/components/common/StatusBadge";
import BarChart from "@/components/common/BarChart";
import StatusDonut from "@/components/common/StatusDonut";
import { bucketLast7Days } from "@/shared/utils/chart.utils";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";
import Icon from "@/components/common/Icon";

const AdminDashboardView = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat, currency } = useContext(AppContext);
  const [toCancel, setToCancel] = useState(null);
  useDocumentTitle("Dashboard");

  useEffect(() => {
    if (aToken) getDashData();
  }, [aToken]);

  if (!dashData) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Overview of your platform" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  const week = bucketLast7Days(dashData.recentBookings);
  const weekTotal = week.reduce((s, d) => s + d.value, 0);

  return (
    <div className="animate-fade-up">
      <PageHeader title="Dashboard" subtitle="Overview of doctors, bookings and revenue" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="stethoscope" label="Doctors" value={dashData.doctors} />
        <StatCard icon="calendar" label="Appointments" value={dashData.appointments} tone="amber" />
        <StatCard icon="users" label="Patients" value={dashData.patients} tone="emerald" />
        <StatCard
          icon="wallet"
          label="Revenue"
          value={`${currency}${dashData.revenue ?? 0}`}
          tone="rose"
          hint="Paid + completed"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-bold">Bookings</p>
              <p className="text-sm text-ink-soft">Last 7 days</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
              <Icon name="trend" className="h-3.5 w-3.5" /> {weekTotal} new
            </span>
          </div>
          <BarChart data={week} />
        </div>

        <div className="card p-6">
          <p className="mb-5 font-bold">Appointment status</p>
          <StatusDonut status={dashData.status} />
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <p className="font-bold">Latest bookings</p>
        </div>
        {dashData.latestAppointments.length === 0 ? (
          <EmptyState title="No bookings yet" text="New appointments will appear here." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {dashData.latestAppointments.map((item) => (
              <li
                key={item._id}
                className="flex items-center gap-3 px-6 py-3.5 transition hover:bg-slate-50"
              >
                <Avatar src={item.docData.image} name={item.docData.name} className="h-10 w-10" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-semibold">{item.docData.name}</p>
                  <p className="truncate text-ink-soft">
                    {item.userData.name} · {slotDateFormat(item.slotDate)}, {item.slotTime}
                  </p>
                </div>
                <StatusBadge item={item} />
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => setToCancel(item)}
                    className="rounded-full p-2 text-ink-muted transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Cancel appointment"
                  >
                    <Icon name="x" className="h-4 w-4" />
                  </button>
                )}
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

export default AdminDashboardView;
