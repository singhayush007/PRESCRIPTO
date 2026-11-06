import React from "react";
import { assets } from "@/assets/assets";
import SectionHeading from "@/components/common/SectionHeading";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";

const info = [
  {
    icon: "📍",
    title: "Our office",
    lines: ["54709 Willms Station", "Suite 350, Washington, USA"],
  },
  { icon: "📞", title: "Call us", lines: ["Tel: (415) 555-0132"] },
  { icon: "✉️", title: "Email", lines: ["greatstackdev@gmail.com"] },
];

const ContactView = () => {
  useDocumentTitle("Contact");
  return (
    <div className="animate-fade-up">
      <SectionHeading
        eyebrow="Contact"
        title="We'd love to hear from you"
        subtitle="Questions about booking or your account? Reach out any time."
      />

      <div className="my-14 grid items-center gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-primary-50 shadow-soft">
          <img className="w-full object-cover" src={assets.contact_image} alt="Prescripto office" />
        </div>

        <div className="flex flex-col gap-4">
          {info.map((item) => (
            <div key={item.title} className="card flex items-start gap-4 p-5">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xl">
                {item.icon}
              </span>
              <div>
                <p className="font-semibold">{item.title}</p>
                {item.lines.map((line) => (
                  <p key={line} className="text-sm text-ink-soft">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          <div className="card bg-gradient-to-br from-primary-50 to-white p-6">
            <p className="font-semibold">Careers at Prescripto</p>
            <p className="mt-1 text-sm text-ink-soft">
              Learn more about our teams and job openings.
            </p>
            <button className="btn-outline mt-4">Explore jobs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
