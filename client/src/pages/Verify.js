import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import PageShell from "../layouts/PageShell";

function Verify() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingEmail");

    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Имэйл хаяг олдсонгүй.";
    }

    if (!code.trim()) {
      newErrors.code = "Баталгаажуулах кодоо оруулна уу.";
    } else if (!/^[0-9]{6}$/.test(code)) {
      newErrors.code = "Код 6 оронтой тоо байх ёстой.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setMessage("");
      setSuccessMessage("");

      const response = await axios.post(
        "http://localhost:5000/api/auth/verify",
        {
          email,
          code,
        }
      );

      setSuccessMessage(
        response.data.message || "Имэйл амжилттай баталгаажлаа."
      );

      localStorage.removeItem("pendingEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Баталгаажуулах үед алдаа гарлаа. Дахин оролдоно уу."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <AuthCard
        eyebrow="Имэйл баталгаажуулалт"
        title="Баталгаажуулах код"
        subtitle="Бүртгүүлсэн имэйл хаяг руу илгээсэн 6 оронтой кодыг оруулна уу."
      >
        {message && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {message}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <InputField
            label="Имэйл хаяг"
            name="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors({ ...errors, email: "" });
              setMessage("");
            }}
            placeholder="example@gmail.com"
            error={errors.email}
            autoComplete="email"
          />

          <InputField
            label="Баталгаажуулах код"
            name="code"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setErrors({ ...errors, code: "" });
              setMessage("");
            }}
            placeholder="123456"
            error={errors.code}
            autoComplete="one-time-code"
          />

          <PrimaryButton loading={loading}>
            Баталгаажуулах
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          Бүртгэлтэй юу?{" "}
          <Link
            to="/login"
            className="font-black text-amber-600 transition hover:text-amber-700"
          >
            Нэвтрэх
          </Link>
        </p>
      </AuthCard>
    </PageShell>
  );
}

export default Verify;