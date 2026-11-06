import React, { useContext, useMemo } from "react";
import { AppContext } from "@/store/AppContext";
import DoctorCard from "@/features/doctors/components/DoctorCard";

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);

  const related = useMemo(
    () => doctors.filter((d) => d.speciality === speciality && d._id !== docId).slice(0, 4),
    [doctors, speciality, docId]
  );

  if (!related.length) return null;

  return (
    <section className="mt-14 border-t border-slate-100 pt-10">
      <h2 className="text-2xl font-bold tracking-tight">More {speciality} specialists</h2>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {related.map((doc) => (
          <DoctorCard key={doc._id} doctor={doc} />
        ))}
      </div>
    </section>
  );
};

export default RelatedDoctors;
