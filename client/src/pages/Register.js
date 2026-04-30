import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Mail, Phone, User } from "lucide-react";
import API from "../services/api";
import PageShell from "../layouts/PageShell";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import PrimaryButton from "../components/PrimaryButton";
import SelectField from "../components/SelectField";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function validateRegister(form) {
  const errors = {};

  if (!form.fullName.trim() || form.fullName.trim().length < 3) {
    errors.fullName = "Овог нэрээ зөв оруулна уу.";
  }

  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Зөв имэйл хаяг оруулна уу.";
  }

  if (!/^\+?[0-9]{8,15}$/.test(form.phone)) {
    errors.phone = "Зөв утасны дугаар оруулна уу.";
  }

  if (form.password.length < 8) {
    errors.password = "Нууц үг хамгийн багадаа 8 тэмдэгттэй байна.";
  }

  if (
    !/[A-Z]/.test(form.password) ||
    !/[a-z]/.test(form.password) ||
    !/[0-9]/.test(form.password)
  ) {
    errors.password = "Нууц үг том, жижиг үсэг болон тоо агуулсан байх ёстой.";
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Нууц үг таарахгүй байна.";
  }

  if (!form.acceptTerms) {
    errors.acceptTerms = "Нөхцөлийг зөвшөөрөх шаардлагатай.";
  }

  return errors;
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    role: "user",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (form.password.length >= 8) score += 1;
    if (/[A-Z]/.test(form.password)) score += 1;
    if (/[a-z]/.test(form.password)) score += 1;
    if (/[0-9]/.test(form.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) score += 1;
    return score;
  }, [form.password]);

  const strengthLabel =
    ["Маш сул", "Сул", "Дунд", "Сайн", "Хүчтэй", "Маш хүчтэй"][passwordStrength] ||
    "Маш сул";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateRegister(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    try {
      setLoading(true);

      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        companyName: form.companyName.trim(),
        role: form.role,
        password: form.password,
      };

      await API.post("/auth/register", payload);

      navigate("/verify", {
        state: { email: form.email.trim().toLowerCase() },
      });
    } catch (error) {
      setServerError(error.response?.data?.message || "Бүртгүүлэх үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      sideTitle="Генераторын захиалгын системд бүртгэл үүсгэнэ үү."
      sideText="Хэрэглэгч болон админы эрхтэй бүртгэл үүсгэж системийн үндсэн боломжуудыг ашиглах боломжтой."
    >
      <AuthCard
        title="Бүртгүүлэх"
        subtitle="Шинэ хэрэглэгчийн бүртгэл үүсгэнэ."
        footer={
          <span>
            Бүртгэлтэй юу?{" "}
            <Link className="text-emerald-300 hover:text-emerald-200" to="/login">
              Нэвтрэх
            </Link>
          </span>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              icon={User}
              label="Овог нэр"
              name="fullName"
              type="text"
              placeholder="Дамдинжав Шаравнямбуу"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />

            <InputField
              icon={Mail}
              label="Имэйл хаяг"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />

            <InputField
              icon={Phone}
              label="Утасны дугаар"
              name="phone"
              type="tel"
              placeholder="99112233"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />

            <SelectField
              label="Хэрэглэгчийн төрөл"
              name="role"
              value={form.role}
              onChange={handleChange}
              error={errors.role}
              options={[
                { value: "user", label: "Хэрэглэгч" },
                { value: "admin", label: "Админ" },
              ]}
            />
          </div>

          <InputField
            icon={Building2}
            label="Байгууллагын нэр"
            name="companyName"
            type="text"
            placeholder="Заавал биш"
            value={form.companyName}
            onChange={handleChange}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <PasswordField
                label="Нууц үг"
                name="password"
                placeholder="Нууц үг үүсгэнэ үү"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Нууц үгийн хүч</span>
                  <span>{strengthLabel}</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-2 rounded-full",
                        i < passwordStrength ? "bg-emerald-400" : "bg-white/10"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <PasswordField
              label="Нууц үг давтах"
              name="confirmPassword"
              placeholder="Нууц үгээ дахин оруулна уу"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-300">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={form.acceptTerms}
              onChange={handleChange}
              className="mt-1"
            />
            <span>Би системийн ашиглах нөхцөлийг зөвшөөрч байна.</span>
          </label>

          {errors.acceptTerms ? (
            <p className="text-sm text-rose-400">{errors.acceptTerms}</p>
          ) : null}

          {serverError ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {serverError}
            </div>
          ) : null}

          <PrimaryButton type="submit" loading={loading}>
            Бүртгүүлэх
          </PrimaryButton>
        </form>
      </AuthCard>
    </PageShell>
  );
}

export default Register;