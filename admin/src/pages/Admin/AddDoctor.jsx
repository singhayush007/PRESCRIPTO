import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { PageHeader } from "../../components/ui";
import Icon from "../../components/Icon";
import useDocumentTitle from "../../utils/useDocumentTitle";

const SPECIALITIES = ["General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"];
const EXPERIENCE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `${n} ${n === 1 ? "Year" : "Years"}`);
const MAX_IMAGE_MB = 2; // the API rejects bigger files

const initial = { name: "", email: "", password: "", experience: "1 Year", fees: "", about: "", speciality: SPECIALITIES[0], degree: "", address1: "", address2: "" };

const Section = ({ title, children }) => (
  <section className="card p-6">
    <h2 className="mb-5 text-base font-bold">{title}</h2>
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  </section>
);

const Field = ({ label, full, children }) => (
  <label className={`flex flex-col gap-1.5 text-sm font-medium ${full ? "sm:col-span-2" : ""}`}>
    {label}
    {children}
  </label>
);

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);
  useDocumentTitle("Add doctor");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const pickImage = (file) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return toast.error("Please choose a JPG, PNG or WEBP image");
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return toast.error(`Image must be under ${MAX_IMAGE_MB} MB`);
    setDocImg(file);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!docImg) return toast.error("Please upload the doctor's photo");
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");

    const formData = new FormData();
    formData.append("image", docImg);
    ["name", "email", "password", "experience", "about", "speciality", "degree"].forEach((k) => formData.append(k, form[k]));
    formData.append("fees", Number(form.fees));
    formData.append("address", JSON.stringify({ line1: form.address1, line2: form.address2 }));

    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/admin/add-doctor", formData, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        setDocImg(null);
        setForm(initial);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="animate-fade-up mx-auto max-w-3xl">
      <PageHeader title="Add doctor" subtitle="Create a doctor account that can log in to the doctor workspace." />

      <div className="flex flex-col gap-5">
        <section className="card flex flex-col items-center gap-5 p-6 sm:flex-row">
          <label htmlFor="doc-img" className="group relative flex h-28 w-28 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-primary">
            {docImg ? (
              <img className="h-full w-full object-cover object-top" src={URL.createObjectURL(docImg)} alt="Preview" />
            ) : (
              <Icon name="upload" className="h-7 w-7 text-ink-muted group-hover:text-primary" />
            )}
          </label>
          <input onChange={(e) => { pickImage(e.target.files[0]); e.target.value = ""; }} type="file" accept="image/png,image/jpeg,image/webp" id="doc-img" hidden />
          <div className="text-center sm:text-left">
            <p className="font-bold">Profile photo</p>
            <p className="text-sm text-ink-soft">JPG, PNG or WEBP, up to {MAX_IMAGE_MB} MB. A clear, front-facing photo works best.</p>
            <label htmlFor="doc-img" className="btn-outline mt-3 cursor-pointer !py-2">{docImg ? "Change photo" : "Choose photo"}</label>
          </div>
        </section>

        <Section title="Account">
          <Field label="Full name"><input className="input" value={form.name} onChange={set("name")} placeholder="Dr. Jane Doe" required /></Field>
          <Field label="Email"><input className="input" type="email" value={form.email} onChange={set("email")} placeholder="doctor@example.com" required /></Field>
          <Field label="Password" full><input className="input" type="password" value={form.password} onChange={set("password")} placeholder="At least 8 characters" required minLength={8} autoComplete="new-password" /></Field>
        </Section>

        <Section title="Professional details">
          <Field label="Speciality">
            <select className="input" value={form.speciality} onChange={set("speciality")}>{SPECIALITIES.map((s) => <option key={s}>{s}</option>)}</select>
          </Field>
          <Field label="Degree"><input className="input" value={form.degree} onChange={set("degree")} placeholder="MBBS, MD" required /></Field>
          <Field label="Experience">
            <select className="input" value={form.experience} onChange={set("experience")}>{EXPERIENCE.map((e) => <option key={e}>{e}</option>)}</select>
          </Field>
          <Field label="Fees per visit"><input className="input" type="number" min="1" value={form.fees} onChange={set("fees")} placeholder="50" required /></Field>
          <Field label="About" full><textarea className="input" rows={4} value={form.about} onChange={set("about")} placeholder="A short bio patients will see on the doctor's page" required /></Field>
        </Section>

        <Section title="Clinic address">
          <Field label="Address line 1"><input className="input" value={form.address1} onChange={set("address1")} placeholder="Street, building" required /></Field>
          <Field label="Address line 2"><input className="input" value={form.address2} onChange={set("address2")} placeholder="City, state" required /></Field>
        </Section>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => { setForm(initial); setDocImg(null); }} className="btn-outline !px-6">Reset</button>
          <button type="submit" disabled={loading} className="btn-primary !px-10">{loading ? "Adding…" : "Add doctor"}</button>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;
