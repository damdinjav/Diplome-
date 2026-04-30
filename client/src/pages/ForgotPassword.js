import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import API from "../services/api";
import PageShell from "../layouts/PageShell";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Зөв имэйл хаяг оруулна уу.");
      return;
    }
    try {
      setLoading(true);
      await API.post("/auth/forgot-password", { email });
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      sideTitle="Нууц үгээ мартсан уу?"
      sideText="Бүртгэлтэй имэйл хаягаа оруулахад нууц үг сэргээх код илгээнэ."
    >
      <AuthCard
        title="Нууц үг сэргээх"
        subtitle="Имэйл хаягаа оруулна уу."
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
            icon={Mail}
            label="Имэйл хаяг"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            error={error}
          />
          <PrimaryButton type="submit" loading={loading} disabled={!email}>
            Код илгээх
          </PrimaryButton>
        </form>
      </AuthCard>
    </PageShell>
  );
}

export default ForgotPassword;