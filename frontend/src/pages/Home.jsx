import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import BentoGrid from "../components/BentoGrid";
import HowItWorks from "../components/HowItWorks";
import FAQ from "../components/FAQ";
import Banner from "../components/Banner";
import Reveal from "../components/Reveal";
import useDocumentTitle from "../utils/useDocumentTitle";

const Home = () => {
  const { token } = useContext(AppContext);
  useDocumentTitle(token ? "Home" : "");

  // logged-in patients get a personal dashboard; visitors get the marketing page
  if (token) {
    return (
      <div>
        <Dashboard />
        <div className="mt-10">
          <SpecialityMenu />
        </div>
        <TopDoctors />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <SpecialityMenu />
      <Reveal>
        <TopDoctors />
      </Reveal>
      <BentoGrid />
      <HowItWorks />
      <FAQ />
      <Reveal>
        <Banner />
      </Reveal>
    </div>
  );
};

export default Home;
