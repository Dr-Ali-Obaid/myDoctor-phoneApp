import bcrypt from "bcrypt";
import models from "../models/associations.js";
import JsonWebToken from "jsonwebtoken";

const register = async (req, res) => {
  const {
    name,
    email,
    password,
    userType,
    location,
    phone,
    workingHours,
    address,
    specialization,
  } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      name,
      email,
      password: hashPassword,
      userType,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    if (userType == "doctor") {
      const profie = await models.Profile.create({
        UserId: user.id,
        address,
        phone,
        specialization,
        workingHours,
      });
    }
    res.status(200).json({ message: "تم إنشاء حسابك بنجاح" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيح" });
    }
    const authSuccess = await bcrypt.compare(password, user.password);
    if (!authSuccess) {
      return res
        .status(401)
        .json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }
    const token = JsonWebToken.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ accessToken: token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "حدث خطأ أثناء معالجة الطلب" });
  }
};

const me = (req, res) => {
  const user = req.currentUser;
  res.json(user);
};
const getUser = async (req, res) => {
  try {
    const result = await models.User.findOne({
      where: { id: req.currentUser.id },
      include: { model: models.Profile },
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};
const updateUser = async (req, res) => {
  const {
    name,
    email,
    password,
    userType,
    location,
    phone,
    workingHours,
    address,
    specialization,
  } = req.body;

  try {
    // البحث عن المستخدم
    const user = await models.User.findOne({
      where: { id: req.currentUser.id },
    });

    if (!user) {
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    // تحديث بيانات المستخدم فقط إذا تم إرسال أي بيانات جديدة
    if (name || email || password || userType || location) {
      const hashPassword = password
        ? await bcrypt.hash(password, 10)
        : user.password;

      await models.User.update(
        {
          name: name || user.name,
          email: email || user.email,
          password: hashPassword,
          userType: userType || user.userType,
          latitude: location ? location.latitude : user.latitude,
          longitude: location ? location.longitude : user.longitude,
        },
        { where: { id: req.currentUser.id } }
      );
    }

    // التحقق من الملف الشخصي إذا كان المستخدم ليس طبيبًا
    let profile = await models.Profile.findOne({
      where: { UserId: req.currentUser.id },
    });

    if (user.userType === "doctor" && userType !== "doctor" && profile) {
      // إذا كان المستخدم ليس طبيبًا، نقوم بحذف الملف الشخصي
      await profile.destroy(profile);
    }

    // تحديث أو إنشاء الملف الشخصي إذا تم إرسال أي من بيانات الملف الشخصي وكان المستخدم طبيبًا
    if (
      userType === "doctor" ||
      phone ||
      workingHours ||
      address ||
      specialization
    ) {
      if (!profile) {
        // إنشاء ملف شخصي جديد إذا لم يكن موجودًا
        profile = await models.Profile.create({
          UserId: req.currentUser.id,
          phone: phone || "",
          workingHours: workingHours || "",
          address: address || "",
          specialization: specialization || "",
        });
      } else {
        // تحديث الملف الشخصي الموجود
        console.log("تحديث الملف الشخصي بـ: ", {
          phone,
          workingHours,
          address,
          specialization,
        }); // تحقق من القيم
        await models.Profile.update(
          {
            phone: phone || profile.phone,
            workingHours: workingHours || profile.workingHours,
            address: address || profile.address,
            specialization: specialization || profile.specialization,
          },
          { where: { UserId: req.currentUser.id } }
        );
      }
    }

    res.status(200).json({ message: "تم تحديث معلوماتك بنجاح" });
  } catch (err) {
    res.status(500).json({ error: "حدث خطأ أثناء التحديث" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await models.User.destroy({
      where: { id: req.currentUser.id },
    });
    res.status(200).json({ message: "تم حذف حسابك بنجاح" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export default { register, login, me, getUser, updateUser, deleteUser };
