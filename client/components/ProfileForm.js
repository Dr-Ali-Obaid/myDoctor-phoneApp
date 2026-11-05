import { Formik } from "formik";
import { object, string,  boolean } from "yup";
import { Input, CheckBox, Text, Button } from "react-native-elements";
import styles from "../styles/authStyles";
import MapViewComponent from "./MapViewComponent";

export function ProfileForm(props) {
  const validationSchema = object({
    name: string().required("اسم المستخدم مطلوب"),
    email: string()
      .email("يجب إدخال بريد إلكتروني صحيح")
      .required("البريد الإلكتروني مطلوب"),
    password: string()
      .min(5, "يجب أن تكون كلمة المرور 5 محارف أو أكثر")
      .required("كلمة المرور مطلوبة"),
    userType: boolean(),
    specialization: string().when("userType", {
      is: true,
      then: (schema) => schema.required("يجب عليك إدخال التخصص"),
    }),
    phone: string().when("userType", {
      is: true,
      then: (schema) => schema.required("يجب عليك إدخال رقم الهاتف"),
    }),
    address: string().when("userType", {
      is: true,
      then: (schema) => schema.required("يجب عليك إدخال العنوان"),
    }),
    workingHours: string().when("userType", {
      is: true,
      then: (schema) => schema.required("يجب عليك إدخال ساعات العمل"),
    }),
  });
  return (
    <Formik
      initialValues={{
        name: props.user?.name || "",
        email: props.user?.email || "",
        password: "",
        userType: props.user?.userType == "doctor",
        specialization: props.user?.Profile?.specialization || "",
        workingHours: props.user?.Profile?.workingHours || "",
        phone: props.user?.Profile?.phone || "",
        address: props.user?.Profile?.address || "",
        latitude: props.user?.latitude || null,
        longitude: props.user?.longitude || null,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => props.submit(values)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        errors,
        values,
        setFieldValue,
        isValid,
      }) => (
        <>
          <Input
            name="name"
            placeholder="الاسم"
            value={values.name}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            style={[styles.textInput, errors.name && styles.errorInput]}
          />
          {errors.name && (
            <Text p style={styles.textError}>
              {errors.name}
            </Text>
          )}

          <Input
            name="email"
            placeholder="البريد الإلكتروني"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            disabled={props.disabled}
            style={[styles.textInput, errors.email && styles.errorInput]}
            keyboardType="email-address"
          />
          {errors.email && (
            <Text p style={styles.textError}>
              {errors.email}
            </Text>
          )}

          <Input
            name="password"
            placeholder="كلمة المرور"
            secureTextEntry
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            style={[styles.textInput, errors.password && styles.errorInput]}
          />
          {errors.password && (
            <Text p style={styles.textError}>
              {errors.password}
            </Text>
          )}
          {props.checkBox && (
            <CheckBox
              title="أنا طبيب"
              name="userType"
              checked={values.userType}
              onPress={() => setFieldValue("userType", !values.userType)}
            />
          )}

          {values.userType && (
            <>
              <Input
                name="specialization"
                placeholder="التخصص"
                value={values.specialization}
                onChangeText={handleChange("specialization")}
                onBlur={handleBlur("specialization")}
                style={[
                  styles.textInput,
                  errors.specialization && styles.errorInput,
                ]}
              />
              {errors.specialization && (
                <Text p style={styles.textError}>
                  {errors.specialization}
                </Text>
              )}

              <Input
                name="workingHours"
                placeholder="ساعات العمل"
                value={values.workingHours}
                onChangeText={handleChange("workingHours")}
                onBlur={handleBlur("workingHours")}
                style={[
                  styles.textInput,
                  errors.workingHours && styles.errorInput,
                ]}
              />
              {errors.workingHours && (
                <Text p style={styles.textError}>
                  {errors.workingHours}
                </Text>
              )}

              <Input
                name="address"
                placeholder="العنوان"
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                style={[styles.textInput, errors.address && styles.errorInput]}
              />
              {errors.address && (
                <Text p style={styles.textError}>
                  {errors.address}
                </Text>
              )}

              <Input
                name="phone"
                placeholder="الهاتف"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                style={[styles.textInput, errors.phone && styles.errorInput]}
              />
              {errors.phone && (
                <Text p style={styles.textError}>
                  {errors.phone}
                </Text>
              )}
              {values.latitude && 
              <MapViewComponent location = {{latitude: values.latitude, longitude: values.longitude}}
              latitude ={(value)=> setFieldValue("latitude", value)}
              longitude ={(value)=> setFieldValue("longitude", value)}
              />
              }
            </>
          )}
          <Button
            title={props.buttonTitle}
            style={{ marginTop: "20px" }}
            onPress={handleSubmit}
            disabled={!isValid}
          />
        </>
      )}
    </Formik>
  );
}
