<template>
  <div class="bg window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row"></div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <img class="logo" src="../assets/logo/otop.png" alt="" />
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                square
                clearable
                v-model="email"
                type="email"
                label="อีเมล"
                :error="!!emailError"
                :error-message="emailError"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="check_circle"
                    v-if="isEmailAvailable"
                    color="green"
                  />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="username"
                type="text"
                label="ชื่อผู้ใช้งาน"
                :error="!!usernameError"
                :error-message="usernameError"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="check_circle"
                    v-if="isUsernameAvailable"
                    color="green"
                  />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="password"
                type="password"
                label="รหัสผ่าน"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="check_circle"
                    v-if="isPasswordValid"
                    color="green"
                  />
                  <q-icon name="error" v-else color="red" />
                  <q-tooltip
                    anchor="bottom right"
                    self="top right"
                    class="tooltip-right"
                  >
                    <div>
                      <p :class="{ 'condition-met': isMinLength }">
                        <q-icon
                          name="check_circle"
                          v-if="isMinLength"
                          color="green"
                        />
                        <q-icon name="error" v-else color="red" />
                        อย่างน้อย 8 ตัวอักษร
                      </p>
                      <p :class="{ 'condition-met': hasUpperCase }">
                        <q-icon
                          name="check_circle"
                          v-if="hasUpperCase"
                          color="green"
                        />
                        <q-icon name="error" v-else color="red" />
                        ตัวพิมพ์ใหญ่
                      </p>
                      <p :class="{ 'condition-met': hasLowerCase }">
                        <q-icon
                          name="check_circle"
                          v-if="hasLowerCase"
                          color="green"
                        />
                        <q-icon name="error" v-else color="red" />
                        ตัวพิมพ์เล็ก
                      </p>
                      <p :class="{ 'condition-met': hasDigit }">
                        <q-icon
                          name="check_circle"
                          v-if="hasDigit"
                          color="green"
                        />
                        <q-icon name="error" v-else color="red" />
                        ตัวเลข
                      </p>
                      <p :class="{ 'condition-met': hasSpecialChar }">
                        <q-icon
                          name="check_circle"
                          v-if="hasSpecialChar"
                          color="green"
                        />
                        <q-icon name="error" v-else color="red" />
                        อักขระพิเศษ
                      </p>
                    </div>
                  </q-tooltip>
                </template>
              </q-input>
            </q-form>
            <div>
              <p :class="{ 'condition-met': isMinLength }">
                <q-icon name="check_circle" v-if="isMinLength" color="green" />
                <q-icon name="error" v-else color="red" />
                อย่างน้อย 8 ตัวอักษร
              </p>
              <p :class="{ 'condition-met': hasUpperCase }">
                <q-icon name="check_circle" v-if="hasUpperCase" color="green" />
                <q-icon name="error" v-else color="red" />
                ตัวพิมพ์ใหญ่
              </p>
              <p :class="{ 'condition-met': hasLowerCase }">
                <q-icon name="check_circle" v-if="hasLowerCase" color="green" />
                <q-icon name="error" v-else color="red" />
                ตัวพิมพ์เล็ก
              </p>
              <p :class="{ 'condition-met': hasDigit }">
                <q-icon name="check_circle" v-if="hasDigit" color="green" />
                <q-icon name="error" v-else color="red" />
                ตัวเลข
              </p>
              <p :class="{ 'condition-met': hasSpecialChar }">
                <q-icon
                  name="check_circle"
                  v-if="hasSpecialChar"
                  color="green"
                />
                <q-icon name="error" v-else color="red" />
                อักขระพิเศษ
              </p>
            </div>
          </q-card-section>
          <q-card-actions class="q-px-lg">
            <q-btn
              unelevated
              size="lg"
              color="red-5"
              class="full-width text-white"
              label="ลงทะเบียน"
              @click="registerUser"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-sm">
            <router-link to="/login">
              <p class="text-grey-6">กลับไปยังหน้าเข้าสู่ระบบ</p>
            </router-link>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "RegisterPage",
  data() {
    return {
      email: "",
      username: "",
      password: "",
      emailError: "",
      usernameError: "",
      isEmailAvailable: false,
      isUsernameAvailable: false,
    };
  },
  created() {
    this.debouncedCheckEmailAvailability = this.debounce(
      this.checkEmailAvailability
    );
    this.debouncedCheckUsernameAvailability = this.debounce(
      this.checkUsernameAvailability
    );
  },
  watch: {
    email(value) {
      this.debouncedCheckEmailAvailability();
    },
    username(value) {
      this.debouncedCheckUsernameAvailability();
    },
  },
  computed: {
    isMinLength() {
      return this.password.length >= 8;
    },
    hasUpperCase() {
      return /[A-Z]/.test(this.password);
    },
    hasLowerCase() {
      return /[a-z]/.test(this.password);
    },
    hasDigit() {
      return /\d/.test(this.password);
    },
    hasSpecialChar() {
      return /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
    },
    isPasswordValid() {
      return (
        this.isMinLength &&
        this.hasUpperCase &&
        this.hasLowerCase &&
        this.hasDigit &&
        this.hasSpecialChar
      );
    },
  },
  methods: {
    checkEmailAvailability() {
      if (!this.email) {
        this.emailError = "";
        this.isEmailAvailable = false;
        return;
      }

      axios
        .post("http://localhost:3000/check-email", { email: this.email })
        .then((response) => {
          this.isEmailAvailable = !response.data.isTaken;
          this.emailError = response.data.isTaken
            ? "อีเมลนี้ถูกใช้ไปแล้ว!"
            : "";
        })
        .catch((error) => {
          console.error(error);
          this.emailError = "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล!";
        });
    },
    checkUsernameAvailability() {
      if (!this.username) {
        this.usernameError = "";
        this.isUsernameAvailable = false;
        return;
      }

      axios
        .post("http://localhost:3000/check-username", {
          username: this.username,
        })
        .then((response) => {
          this.isUsernameAvailable = !response.data.isTaken;
          this.usernameError = response.data.isTaken
            ? "ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว!"
            : "";
        })
        .catch((error) => {
          console.error(error);
          this.usernameError = "เกิดข้อผิดพลาดในการตรวจสอบข้อมูล!";
        });
    },
    registerUser() {
      if (!this.isPasswordValid) {
        Swal.fire({
          icon: "error",
          title: "รหัสผ่านไม่ปลอดภัย",
          text: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร มีตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษอย่างน้อยหนึ่งตัว",
        });
        return;
      }

      if (!this.isEmailAvailable || !this.isUsernameAvailable) {
        Swal.fire({
          icon: "error",
          title: "ข้อมูลไม่ถูกต้อง",
          text: "โปรดตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
        });
        return;
      }

      const userData = {
        email: this.email,
        username: this.username,
        password: this.password,
      };

      axios
        .post("http://localhost:3000/register", userData)
        .then((response) => {
          console.log(response.data);
          Swal.fire({
            icon: "success",
            title: "ลงทะเบียนสำเร็จ!",
            text: "การลงทะเบียนเสร็จสมบูรณ์",
          }).then(() => {
            this.$router.push("/login");
          });
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด!",
            text: "เกิดข้อผิดพลาดในการลงทะเบียน!",
          });
        });
    },
    debounce(func, wait = 500) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, wait);
      };
    },
  },
};
</script>

<style>
.q-card {
  width: 450px;
}

.logo {
  width: 260px;
  margin: auto auto;
  display: block;
  padding: 10px;
}

.bg {
  background-image: url("../assets/logo/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.cursor-pointer {
  cursor: pointer;
}

.condition-met {
  color: green;
}

.q-tooltip div p {
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  line-height: 1.5;
  padding: 3px 0;
}

.q-tooltip div p q-icon {
  margin-right: 8px;
}

.help-icon {
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
}

.condition-met,
.q-card-section div p {
  font-size: 0.85rem;
  line-height: 1.5;
  padding: 3px 0;
}
</style>
