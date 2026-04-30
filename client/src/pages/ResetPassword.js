import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import PageShell from "../layouts/PageShell";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import PrimaryButton from "../components/PrimaryButton";
import { KeyRound } from "lucide-react";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Зөв имэйл хаяг оруулна уу.";
    if (!form.code) errs.code = "Кодыг оруулна уу.";
    if (form.newPassword.length < 6) errs.newPassword = "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.";
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = "Нууц үг таарахгүй байна.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      setLoading(true);
      await API.post("/auth/reset-password", {
        email: form.email,
        code: form.code,
        newPassword: form.newPassword,
      });
      navigate("/login", { state: { message: "Нууц үг амжилттай шинэчлэгдлээ. Нэвтэрнэ үү." } });
    } catch (err) {
      setServerError(err.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = form.email && form.code && form.newPassword && form.confirmPassword;

  return (
    <PageShell
      sideTitle="Шинэ нууц үг тохируулах"
      sideText="Имэйл рүү илгээсэн кодыг оруулаад шинэ нууц үгээ тохируулна уу."
    >
      <AuthCard
        title="Нууц үг шинэчлэх"
        subtitle="Имэйл рүү ирсэн кодыг оруулна уу."
        footer={
          <span>
            Буцах?{" "}
            <Link className="text-emerald-300 hover:text-emerald-200" to="/login">
              Нэвтрэх
            </Link>
          </span>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            icon={KeyRound}
            label="Имэйл хаяг"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            icon={KeyRound}
            label="Баталгаажуулах код"
            name="code"
            type="text"
            placeholder="6 оронтой код"
            value={form.code}
            onChange={handleChange}
            error={errors.code}
          />
          <PasswordField
            label="Шинэ нууц үг"
            name="newPassword"
            placeholder="Шинэ нууц үгээ оруулна уу"
            value={form.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
          />
          <PasswordField
            label="Нууц үг давтах"
            name="confirmPassword"
            placeholder="Нууц үгээ дахин оруулна уу"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          {serverError && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {serverError}
            </div>
          )}

          <PrimaryButton type="submit" loading={loading} disabled={!canSubmit}>
            Нууц үг шинэчлэх
          </PrimaryButton>
        </form>
      </AuthCard>
    </PageShell>
  );
}

export default ResetPassword;