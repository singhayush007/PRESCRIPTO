import React from "react";
import { Link } from "react-router-dom";
import { assets } from "@/assets/assets";

const link = "transition hover:text-ink";

const Footer = () => (
  <footer className="mt-10 border-t border-slate-100 bg-card pb-24 md:pb-0">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <div>
          <img data-logo className="mb-4 w-36" src={assets.logo} alt="Prescripto" />
          <p className="max-w-sm text-sm leading-6 text-ink-soft">
            Prescripto connects patients with trusted doctors. Browse specialists, book a slot that
            suits you and pay securely online.
          </p>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold">Company</p>
          <ul className="flex flex-col gap-2.5 text-sm text-ink-soft">
            <li>
              <Link className={link} to="/" onClick={() => scrollTo(0, 0)}>
                Home
              </Link>
            </li>
            <li>
              <Link className={link} to="/doctors" onClick={() => scrollTo(0, 0)}>
                All doctors
              </Link>
            </li>
            <li>
              <Link className={link} to="/about" onClick={() => scrollTo(0, 0)}>
                About us
              </Link>
            </li>
            <li>
              <Link className={link} to="/contact" onClick={() => scrollTo(0, 0)}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold">Get in touch</p>
          <ul className="flex flex-col gap-2.5 text-sm text-ink-soft">
            <li>+1-212-456-7890</li>
            <li>prescripto@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 text-xs text-ink-muted sm:flex-row">
        <p>© {new Date().getFullYear()} Prescripto. All rights reserved.</p>
        <p>Made with care for better healthcare access.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
