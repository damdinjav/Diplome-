const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateOTP, sendOTP } = require("../utils/sendOTP");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Бүх талбарыг бөглөнө үү" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Хэрэглэгч аль хэдийн бүртгэлтэй байна" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: false,
      verificationCode: otp,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000,
    });

    await sendOTP(user.email, otp);

    res.status(201).json({
      message: "Хэрэглэгч бүртгэгдлээ. Имэйл рүү очсон кодоор баталгаажуулна уу.",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
    }

    if (String(user.verificationCode) !== String(code)) {
      return res.status(400).json({ message: "Код буруу байна" });
    }

    if (!user.verificationCodeExpires || user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Кодын хугацаа дууссан байна" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    res.json({
      message: "Амжилттай баталгаажлаа",
      token: generateToken(user),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Имэйл болон нууц үгээ оруулна уу" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Нууц үг буруу байна" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Та эхлээд имэйл хаягаа баталгаажуулна уу",
      });
    }

    res.json({
      message: "Амжилттай нэвтэрлээ",
      token: generateToken(user),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Имэйл хаягаа оруулна уу" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });

    const otp = generateOTP();
    user.verificationCode = otp;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTP(user.email, otp);

    res.json({ message: "Нууц үг сэргээх код имэйл рүү илгээлээ", email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword)
      return res.status(400).json({ message: "Бүх талбарыг бөглөнө үү" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });

    if (String(user.verificationCode) !== String(code))
      return res.status(400).json({ message: "Код буруу байна" });

    if (!user.verificationCodeExpires || user.verificationCodeExpires < Date.now())
      return res.status(400).json({ message: "Кодын хугацаа дууссан байна" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.json({ message: "Нууц үг амжилттай шинэчлэгдлээ" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  verifyUser,
  login,
  getMe,
  forgotPassword,
  resetPassword,
};