import React, { useContext, useState } from "react";
import { AppContext } from "@/store/AppContext";
import { profileService } from "@/features/profile/services/profile.service";
import { toast } from "react-toastify";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";

// defined outside the component so inputs inside it keep focus between renders
const Row = ({ label, children }) => (
  <div className="grid items-center gap-1 py-3 sm:grid-cols-[140px_1fr] sm:gap-4">
    <p className="text-sm font-medium text-ink-muted">{label}</p>
    <div className="text-sm text-ink">{children}</div>
  </div>
);

const MyProfileView = () => {
  const [isEdit, setIsEdit] = useState(false);
  useDocumentTitle("My profile");

  const [image, setImage] = useState(false);

  const { userData, setUserData, loadUserProfileData } = useContext(AppContext);

  // Function to update user profile data using API
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);

      const data = await profileService.update(formData);

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const set = (field) => (e) => setUserData((prev) => ({ ...prev, [field]: e.target.value }));
  const setAddr = (line) => (e) =>
    setUserData((prev) => ({ ...prev, address: { ...prev.address, [line]: e.target.value } }));

  return userData ? (
    <div className="animate-fade-up mx-auto max-w-2xl">
      <div className="card overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary-700 via-primary to-primary-400" />
        <div className="px-6 pb-8 sm:px-8">
          <div className="-mt-14 flex items-end gap-4">
            {isEdit ? (
              <label htmlFor="image" className="group relative cursor-pointer">
                <img
                  className="h-28 w-28 rounded-2xl border-4 border-white bg-card object-cover shadow-soft"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt=""
                />
                <span className="absolute inset-1 flex items-center justify-center rounded-xl bg-slate-900/45 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                  Change photo
                </span>
                <input
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    e.target.value = ""; // allow choosing the same file again after cancelling
                  }}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  id="image"
                  hidden
                />
              </label>
            ) : (
              <img
                className="h-28 w-28 rounded-2xl border-4 border-white bg-card object-cover shadow-soft"
                src={userData.image}
                alt=""
              />
            )}
          </div>

          <div className="mt-4">
            {isEdit ? (
              <input
                className="input max-w-sm !text-xl !font-semibold"
                type="text"
                onChange={set("name")}
                value={userData.name}
                aria-label="Name"
              />
            ) : (
              <h1 className="text-3xl font-bold tracking-tight">{userData.name}</h1>
            )}
            <p className="mt-1 text-sm text-ink-soft">{userData.email}</p>
          </div>

          <div className="mt-6 divide-y divide-slate-100">
            <p className="pb-2 text-xs font-semibold uppercase tracking-wider text-primary-600">
              Contact information
            </p>
            <Row label="Phone">
              {isEdit ? (
                <input
                  className="input max-w-xs"
                  type="text"
                  onChange={set("phone")}
                  value={userData.phone}
                />
              ) : (
                userData.phone
              )}
            </Row>
            <Row label="Address">
              {isEdit ? (
                <div className="flex max-w-sm flex-col gap-2">
                  <input
                    className="input"
                    type="text"
                    placeholder="Address line 1"
                    onChange={setAddr("line1")}
                    value={userData.address.line1}
                  />
                  <input
                    className="input"
                    type="text"
                    placeholder="Address line 2"
                    onChange={setAddr("line2")}
                    value={userData.address.line2}
                  />
                </div>
              ) : (
                <span className="text-ink-soft">
                  {userData.address.line1}
                  {userData.address.line2 && (
                    <>
                      <br />
                      {userData.address.line2}
                    </>
                  )}
                  {!userData.address.line1 && !userData.address.line2 && "—"}
                </span>
              )}
            </Row>
          </div>

          <div className="mt-6 divide-y divide-slate-100">
            <p className="pb-2 text-xs font-semibold uppercase tracking-wider text-primary-600">
              Basic information
            </p>
            <Row label="Gender">
              {isEdit ? (
                <select className="input max-w-xs" onChange={set("gender")} value={userData.gender}>
                  <option value="Not Selected">Not Selected</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                userData.gender
              )}
            </Row>
            <Row label="Birthday">
              {isEdit ? (
                <input
                  className="input max-w-xs"
                  type="date"
                  onChange={set("dob")}
                  value={userData.dob}
                />
              ) : (
                userData.dob
              )}
            </Row>
          </div>

          <div className="mt-8 flex gap-3">
            {isEdit ? (
              <>
                <button onClick={updateUserProfileData} className="btn-primary">
                  Save information
                </button>
                <button
                  onClick={() => {
                    setIsEdit(false);
                    setImage(false);
                    loadUserProfileData();
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEdit(true)} className="btn-primary">
                Edit profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="mx-auto max-w-2xl animate-pulse">
      <div className="card overflow-hidden">
        <div className="h-28 bg-slate-100" />
        <div className="space-y-4 px-8 pb-8">
          <div className="-mt-14 h-28 w-28 rounded-2xl border-4 border-card bg-slate-200" />
          <div className="h-8 w-1/2 rounded bg-slate-100" />
          <div className="h-4 w-1/3 rounded bg-slate-100" />
          <div className="h-32 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
};

export default MyProfileView;
