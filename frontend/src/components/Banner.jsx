import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Banner = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  return (
    <section className="relative mt-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-primary-900 to-primary-700 px-6 sm:px-12">
      <div className="pointer-events-none absolute -right-10 -top-16 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
      <div className="relative flex">
        <div className="flex-1 py-12 sm:py-16 lg:py-20">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your next appointment is <br className="hidden sm:block" />
            <span className="text-primary-300">one tap away.</span>
          </h2>
          <p className="mt-4 max-w-md text-white/70">Join patients who find and book trusted doctors with Prescripto.</p>
          <button
            onClick={() => {
              navigate(token ? "/doctors" : "/login");
              scrollTo(0, 0);
            }}
            className="mt-8 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            {token ? "Find a doctor" : "Create free account"}
          </button>
        </div>
        <div className="relative hidden md:block md:w-1/2 lg:w-[380px]">
          <img className="absolute bottom-0 right-0 w-full max-w-md" src={assets.appointment_img} alt="" />
        </div>
      </div>
    </section>
  );
};

export default Banner;
