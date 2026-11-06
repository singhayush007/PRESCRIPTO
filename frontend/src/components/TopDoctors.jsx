import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DoctorCard, { DoctorCardSkeleton } from "./DoctorCard";

const TopDoctors = () => {
  const { doctors, loadingDoctors } = useContext(AppContext);

  // best rated first, then most reviewed
  const top = [...doctors]
    .sort((a, b) => b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount)
    .slice(0, 8);

  return (
    <section className="pt-10 sm:pt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Top rated doctors</h2>
          <p className="mt-1 text-sm text-ink-soft">Highly rated specialists, ready to see you.</p>
        </div>
        <Link to="/doctors" onClick={() => scrollTo(0, 0)} className="flex-shrink-0 text-sm font-semibold text-primary hover:underline">
          View all →
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {loadingDoctors
          ? Array.from({ length: 8 }).map((_, i) => <DoctorCardSkeleton key={i} />)
          : top.map((doc) => <DoctorCard key={doc._id} doctor={doc} />)}
      </div>
      {!loadingDoctors && doctors.length === 0 && (
        <p className="mt-8 text-center text-ink-soft">No doctors available yet. Please check back soon.</p>
      )}
    </section>
  );
};

export default TopDoctors;
