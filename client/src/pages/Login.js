import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import API from "../services/api";
import { saveAuth } from "../utils/auth";
import PageShell from "../layouts/PageShell";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import PrimaryButton from "../components/PrimaryButton";

function validateLogin(form) {
  const errors = {};

  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Зөв имэйл хаяг оруулна уу.";
  }

  if (!form.password) {
    errors.password = "Нууц үгээ оруулна уу.";
  }

  return errors;
}

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => form.email && form.password, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateLogin(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);

      saveAuth(res.data);
      navigate(res.data.user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    } catch (error) {
      setServerError(error.response?.data?.message || "Нэвтрэх үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      sideTitle="Генераторын худалдаа, захиалга, хэрэглэгчийн удирдлагыг нэг системээс удирдана."
      sideText="Энэхүү систем нь хэрэглэгчийн нэвтрэлт, захиалга болон мэдээллийг аюулгүй, ойлгомжтой байдлаар удирдах боломжийг олгоно."
    >
      <AuthCard
        title="Тавтай морил"
        subtitle="Нэвтэрч үргэлжлүүлнэ үү."
        footer={
          <span>
            Бүртгэлгүй юу?{" "}
            <Link className="text-emerald-300 hover:text-emerald-200" to="/register">
              Бүртгүүлэх
            </Link>
          </span>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            icon={Mail}
            label="Имэйл хаяг"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <PasswordField
            label="Нууц үг"
            name="password"
            placeholder="Нууц үгээ оруулна уу"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <div className="text-right text-sm">
            <Link className="text-emerald-300 hover:text-emerald-200" to="/forgot-password">
              Нууц үг мартсан уу?
            </Link>
          </div>

          {serverError ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {serverError}
            </div>
          ) : null}

          <PrimaryButton type="submit" loading={loading} disabled={!canSubmit}>
            Нэвтрэх
          </PrimaryButton>
        </form>
      </AuthCard>
    </PageShell>
  );
}

export default Login;