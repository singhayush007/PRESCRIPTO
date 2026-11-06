import React from "react";
import { useNavigate } from "react-router-dom";
import { specialityData } from "../assets/assets";
import CategoryStrip from "./CategoryStrip";

const SpecialityMenu = () => {
  const navigate = useNavigate();
  const items = specialityData.map((s) => ({
    key: s.speciality,
    label: s.speciality,
    icon: <img className="h-9 w-9" src={s.image} alt="" />,
  }));

  return (
    <section id="speciality" className="scroll-mt-24 border-b border-slate-100 pt-8">
      <CategoryStrip
        items={items}
        active={null}
        onSelect={(key) => {
          navigate(`/doctors/${key}`);
          scrollTo(0, 0);
        }}
      />
    </section>
  );
};

export default SpecialityMenu;
