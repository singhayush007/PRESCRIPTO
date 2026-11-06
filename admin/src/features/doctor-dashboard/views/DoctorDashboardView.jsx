import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "@/store/DoctorContext";
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

const DoctorDashboardView = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } =
    useContext(DoctorContext);
  const { slotDateFormat, currency } = useContext(AppContext);
  const [toCancel, setToCancel] = useState(null);
  useDocumentTitle("Dashboard");

  useEffect(() => {
    if (dToken) getDashData();
  }, [dToken]);

  if (!dashData) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Your practice at a glance" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
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

  return (
    <div className="animate-fade-up">
      <PageHeader title="Dashboard" subtitle="Your practice at a glance" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon="wallet"
          label="Earnings"
          value={`${currency}${dashData.earnings}`}
          tone="emerald"
          hint="Paid + completed"
        />
        <StatCard icon="calendar" label="Appointments" value={dashData.appointments} tone="amber" />
        <StatCard icon="users" label="Patients" value={dashData.patients} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-6">
          <p className="font-bold">Bookings</p>
          <p className="mb-5 text-sm text-ink-soft">Last 7 days</p>
          <BarChart data={week} />
        </div>
        <div className="card p-6">
          <p className="mb-5 font-bold">Appointment status</p>
          <StatusDonut status={dashData.status} />
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <p className="border-b border-slate-100 px-6 py-4 font-bold">Latest bookings</p>
        {dashData.latestAppointments.length === 0 ? (
          <EmptyState title="No bookings yet" text="Patients' bookings will appear here." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {dashData.latestAppointments.map((item) => (
              <li
                key={item._id}
                className="flex items-center gap-3 px-6 py-3.5 transition hover:bg-slate-50"
              >
                <Avatar src={item.userData.image} name={item.userData.name} className="h-10 w-10" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-semibold">{item.userData.name}</p>
                  <p className="truncate text-ink-soft">
                    {slotDateFormat(item.slotDate)}, {item.slotTime}
                  </p>
                </div>
                <StatusBadge item={item} />
                {!item.cancelled && !item.isCompleted && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setToCancel(item)}
                      className="rounded-full p-2 text-ink-muted transition hover:bg-red-50 hover:text-red-500"
                      aria-label="Cancel appointment"
                    >
                      <Icon name="x" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => completeAppointment(item._id)}
                      className="rounded-full p-2 text-ink-muted transition hover:bg-emerald-50 hover:text-emerald-600"
                      aria-label="Mark completed"
                    >
                      <Icon name="check" className="h-4 w-4" />
                    </button>
                  </div>
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
            ? `${toCancel.userData.name}'s visit on ${slotDateFormat(toCancel.slotDate)} will be cancelled and the slot freed.`
            : ""
        }
        confirmLabel="Cancel appointment"
        onConfirm={() => cancelAppointment(toCancel._id)}
        onClose={() => setToCancel(null)}
      />
    </div>
  );
};

export default DoctorDashboardView;
