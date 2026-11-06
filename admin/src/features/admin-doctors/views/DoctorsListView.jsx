import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminContext } from "@/store/AdminContext";
import { AppContext } from "@/store/AppContext";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Skeleton from "@/components/common/Skeleton";
import Toggle from "@/components/common/Toggle";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";

const DoctorsListView = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext);
  const { currency } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [speciality, setSpeciality] = useState("");
  useDocumentTitle("Doctors");

  useEffect(() => {
    if (aToken) getAllDoctors();
  }, [aToken]);

  const specialities = useMemo(
    () => [...new Set((doctors || []).map((d) => d.speciality))],
    [doctors]
  );
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (doctors || []).filter(
      (d) =>
        (!speciality || d.speciality === speciality) &&
        (!q || d.name.toLowerCase().includes(q) || d.email?.toLowerCase().includes(q))
    );
  }, [doctors, search, speciality]);

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Doctors"
        subtitle={
          doctors
            ? `${doctors.length} registered · ${doctors.filter((d) => d.available).length} available`
            : "Loading…"
        }
        action={
          <Link to="/add-doctor" className="btn-primary !py-2.5">
            + Add doctor
          </Link>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email" />
        <select
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
          className="rounded-full border border-slate-200 bg-card px-5 py-2.5 text-sm outline-none focus:border-primary"
          aria-label="Filter by speciality"
        >
          <option value="">All specialities</option>
          {specialities.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {doctors === null ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="users"
            title="No doctors found"
            text="Try a different search, or add a new doctor."
          />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((item) => (
            <div
              key={item._id}
              className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="bg-gradient-to-b from-primary-50 to-primary-100">
                <img
                  className="aspect-[4/3.6] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="truncate text-lg font-bold">{item.name}</p>
                <p className="text-sm text-ink-soft">{item.speciality}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {item.experience} · {currency}
                  {item.fees} / visit
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span
                    className={`text-sm font-medium ${item.available ? "text-emerald-600" : "text-ink-muted"}`}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                  <Toggle
                    checked={item.available}
                    onChange={() => changeAvailability(item._id)}
                    label={`Availability of ${item.name}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsListView;
