import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { PageHeader, Skeleton, Toggle } from "../../components/ui";
import useDocumentTitle from "../../utils/useDocumentTitle";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext);
  const { currency, backendUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  useDocumentTitle("Profile");

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  const update = (patch) => setProfileData((prev) => ({ ...prev, ...patch }));

  const updateProfile = async () => {
    setSaving(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        { address: profileData.address, fees: profileData.fees, about: profileData.about, available: profileData.available },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!profileData) {
    return (
      <div>
        <PageHeader title="Profile" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const row = "grid gap-1 border-b border-slate-100 py-4 last:border-0 sm:grid-cols-[160px_1fr] sm:gap-4";

  return (
    <div className="animate-fade-up mx-auto max-w-3xl">
      <PageHeader
        title="Profile"
        subtitle="This is how patients see you."
        action={
          isEdit ? (
            <div className="flex gap-2">
              <button onClick={() => { setIsEdit(false); getProfileData(); }} className="btn-outline !px-5 !py-2.5">Cancel</button>
              <button onClick={updateProfile} disabled={saving} className="btn-primary !py-2.5">{saving ? "Saving…" : "Save changes"}</button>
            </div>
          ) : (
            <button onClick={() => setIsEdit(true)} className="btn-primary !py-2.5">Edit profile</button>
          )
        }
      />

      <div className="card overflow-hidden">
        <div className="flex flex-col items-center gap-5 bg-gradient-to-r from-primary-700 via-primary to-primary-400 p-6 text-white sm:flex-row">
          <img className="h-28 w-28 rounded-3xl border-4 border-white/30 bg-white/20 object-cover object-top" src={profileData.image} alt={profileData.name} />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-extrabold">{profileData.name}</h2>
            <p className="text-white/85">{profileData.degree} · {profileData.speciality}</p>
            <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{profileData.experience} experience</span>
          </div>
        </div>

        <div className="px-6 pb-2">
          <div className={row}>
            <p className="text-sm font-medium text-ink-muted">About</p>
            {isEdit ? <textarea className="input" rows={6} value={profileData.about} onChange={(e) => update({ about: e.target.value })} /> : <p className="text-sm leading-relaxed text-ink-soft">{profileData.about}</p>}
          </div>
          <div className={row}>
            <p className="text-sm font-medium text-ink-muted">Fee per visit</p>
            {isEdit ? (
              <div className="flex max-w-[160px] items-center gap-2"><span className="text-ink-soft">{currency}</span><input className="input" type="number" min="1" value={profileData.fees} onChange={(e) => update({ fees: e.target.value })} /></div>
            ) : (
              <p className="text-sm font-semibold">{currency}{profileData.fees}</p>
            )}
          </div>
          <div className={row}>
            <p className="text-sm font-medium text-ink-muted">Clinic address</p>
            {isEdit ? (
              <div className="flex max-w-md flex-col gap-2">
                <input className="input" value={profileData.address.line1} onChange={(e) => update({ address: { ...profileData.address, line1: e.target.value } })} />
                <input className="input" value={profileData.address.line2} onChange={(e) => update({ address: { ...profileData.address, line2: e.target.value } })} />
              </div>
            ) : (
              <p className="text-sm text-ink-soft">{profileData.address.line1}<br />{profileData.address.line2}</p>
            )}
          </div>
          <div className={row}>
            <p className="text-sm font-medium text-ink-muted">Accepting bookings</p>
            <div className="flex items-center gap-3">
              <Toggle checked={profileData.available} onChange={() => isEdit && update({ available: !profileData.available })} label="Accepting bookings" />
              <span className="text-sm text-ink-soft">{profileData.available ? "Available" : "Unavailable"}{!isEdit && " (click Edit profile to change)"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
