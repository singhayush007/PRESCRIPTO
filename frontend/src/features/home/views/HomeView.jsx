import React, { useContext } from "react";
import { AppContext } from "@/store/AppContext";
import HeroSection from "@/features/home/components/HeroSection";
import PatientDashboard from "@/features/home/components/PatientDashboard";
import SpecialityMenu from "@/features/home/components/SpecialityMenu";
import TopDoctors from "@/features/home/components/TopDoctors";
import BentoGrid from "@/features/home/components/BentoGrid";
import HowItWorks from "@/features/home/components/HowItWorks";
import FaqSection from "@/features/home/components/FaqSection";
import CtaBanner from "@/features/home/components/CtaBanner";
import Reveal from "@/components/common/Reveal";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";

const HomeView = () => {
  const { token } = useContext(AppContext);
  useDocumentTitle(token ? "Home" : "");

  // logged-in patients get a personal dashboard; visitors get the marketing page
  if (token) {
    return (
      <div>
        <PatientDashboard />
        <div className="mt-10">
          <SpecialityMenu />
        </div>
        <TopDoctors />
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      <SpecialityMenu />
      <Reveal>
        <TopDoctors />
      </Reveal>
      <BentoGrid />
      <HowItWorks />
      <FaqSection />
      <Reveal>
        <CtaBanner />
      </Reveal>
    </div>
  );
};

export default HomeView;
