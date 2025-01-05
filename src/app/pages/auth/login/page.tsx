// login/page.tsx
"use client";
import { CgProfile } from "react-icons/cg";
import { MdLock } from "react-icons/md";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { userLogin } from "@/store/slices/authSlices/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import React, { useState } from "react";
import Loading from "@/_components/status/loading";
import { useRouter } from "next/navigation";

interface FormData {
  identifier: string;
  password: string;
}

const InputField: React.FC<{
  type: string;
  name: string;
  placeholder: string;
  value: string;
  icon: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ type, name, placeholder, value, icon, onChange }) => (
  <div className="flex justify-between items-center p-2 bg-gray-400 rounded-lg my-3 w-full">
    <div className="flex justify-start items-center">
      <label className="flex justify-start items-center">{icon}</label>
    </div>
    <div className="flex justify-end items-center w-full">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="p-3 w-full outline-none bg-gray-400 placeholder:text-black placeholder:opacity-40 focus:border-green-500 transition-all delay-100 rounded-lg"
      />
    </div>
  </div>
);
export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { error, loading, success } = useSelector(
    (state: RootState) => state.login
  );
  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      return alert("تمامی فیلد هارا پر کنید");
    }
    dispatch(userLogin(formData));
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4 m-4 md:w-3/4 max-w-full flex-col">
      <div className="flex justify-center items-center flex-col bg-gray-300 p-4 w-full md:w-1/2 rounded-md">
        <h1 className="text-lg font-bold mb-4">فرم ورود</h1>
        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center flex-col p-4 w-full"
        >
          <InputField
            type="text"
            placeholder="نام کاربری یا ایمیل"
            onChange={handleChange}
            value={formData.identifier}
            icon={<CgProfile size={30} />}
            name="identifier"
          />
          <div className="flex justify-between items-center p-2 bg-gray-400 rounded-lg my-3 w-full">
            <div className="flex justify-start items-center">
              <label>
                <MdLock size={30} />
              </label>
            </div>
            <div className="flex justify-end items-center w-full relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="رمز عبور خود را وارد کنید."
                value={formData.password}
                onChange={handleChange}
                className="p-3 w-full outline-none bg-gray-400 placeholder:text-black placeholder:opacity-40 focus:border-green-500 transition-all delay-100 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3"
              >
                {passwordVisible ? (
                  <BsFillEyeSlashFill size={25} />
                ) : (
                  <BsFillEyeFill size={25} />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-400 p-4 text-black text-2xl hover:bg-green-500 transition-all delay-100 rounded-md"
          >
            ثبت نام
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && (
            <p className="text-green-500 mt-2">ثبت نام موفقیت‌آمیز بود!</p>
          )}
        </form>
      </div>
    </div>
  );
}
