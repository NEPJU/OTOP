<template lang="">
  <div>
    <div class="row">
      <div class="col bg-side"></div>
      <div class="col-10 bg-center">
        <div class="row">
          <div class="col"></div>
          <div class="col-10">
            <q-card
              class="my-card"
              bordered
              style="padding-bottom: 25px; padding-top: 15px"
            >
              <div style="text-align: center; font-size: 35px">
                ยินดีต้อนรับ
              </div>
              <div style="text-align: center; font-size: 25px">ADMIN</div>

              <!-- ส่วนที่เพิ่มขึ้นมา -->
              <div
                v-for="user in users"
                :key="user.id"
                class="user-info"
                style="margin-top: 15px"
              >
                <p>ID: {{ user.id }}</p>
                <p>Username: {{ user.username }}</p>
                <p>Email: {{ user.email }}</p>
                <p>Role: {{ user.auth }}</p>
                <q-btn @click="editUser(user)" label="แก้ไข" color="primary" />
                <!-- เพิ่มปุ่มแก้ไข -->
              </div>
              <!-- สิ้นสุดส่วนที่เพิ่มขึ้นมา -->
            </q-card>
          </div>
          <div class="col"></div>
        </div>
      </div>
      <div class="col bg-side">
        <q-dialog
          v-model="showEditDialog"
          transition-show="slide-up"
          transition-hide="slide-down"
        >
          <q-card class="edit-form">
            <q-card-section>
              <h2>แก้ไขข้อมูลผู้ใช้งาน</h2>
            </q-card-section>
            <q-card-section>
              <form @submit.prevent="updateUser">
                <q-input
                  outlined
                  label="Username"
                  v-model="editedUser.username"
                />
                <q-input outlined label="Email" v-model="editedUser.email" />
                <q-input
                  outlined
                  label="Password"
                  type="password"
                  v-model="editedUser.password"
                />
                <div class="q-mt-md">
                  <q-btn type="submit" label="บันทึก" color="primary" />
                  <q-btn label="ยกเลิก" color="negative" @click="cancelEdit" />
                </div>
              </form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [], // เก็บข้อมูลผู้ใช้ที่ได้รับมาจาก API
      editingUser: null, // ข้อมูลผู้ใช้ที่กำลังถูกแก้ไข
      editedUser: {
        // ข้อมูลผู้ใช้ที่ถูกแก้ไขในฟอร์ม
        id: null,
        username: "",
        email: "",
        password: "",
      },
      showEditDialog: false, // สถานะเพื่อแสดงฟอร์มแก้ไข
    };
  },
  mounted() {
    // เรียกใช้งาน API เพื่อดึงข้อมูลผู้ใช้
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        // เรียกใช้งาน API เพื่อดึงข้อมูลผู้ใช้
        const response = await fetch("http://localhost:3000/users"); // แก้ไข URL เพื่อตรงกับ URL ของ API ของคุณ
        const data = await response.json();
        this.users = data; // เก็บข้อมูลผู้ใช้ในตัวแปร users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    editUser(user) {
      // กำหนดข้อมูลผู้ใช้ที่กำลังแก้ไขและแสดงฟอร์มแก้ไข
      this.editingUser = user;
      this.editedUser.id = user.id;
      this.editedUser.username = user.username;
      this.editedUser.email = user.email;
      this.editedUser.password = ""; // ตั้งค่า password เป็นค่าว่าง

      // แสดงฟอร์มแก้ไขผู้ใช้งาน
      this.showEditDialog = true;
    },
    async updateUser() {
      try {
        // เรียกใช้งาน API เพื่ออัปเดตข้อมูลผู้ใช้
        await fetch(`http://localhost:3000/users/${this.editedUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.editedUser.username,
            email: this.editedUser.email,
            password: this.editedUser.password,
          }),
        });

        // อัปเดตข้อมูลผู้ใช้ใน users array และล้างข้อมูลที่กำลังแก้ไข
        const index = this.users.findIndex(
          (user) => user.id === this.editedUser.id
        );
        this.users[index].username = this.editedUser.username;
        this.users[index].email = this.editedUser.email;
        // ไม่ควรอัปเดต password ในข้อมูลผู้ใช้ที่แสดงบนหน้าเว็บ ดังนั้นเราจึงไม่ทำการอัปเดต password ใน users array

        // ปิดฟอร์มแก้ไขผู้ใช้งาน
        this.showEditDialog = false;
        // ล้างข้อมูลที่กำลังแก้ไข
        this.editingUser = null;
        this.editedUser = {
          id: null,
          username: "",
          email: "",
          password: "",
        };
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
    cancelEdit() {
      // ปิดฟอร์มแก้ไขผู้ใช้งาน
      this.showEditDialog = false;
      // ล้างข้อมูลที่กำลังแก้ไข
      this.editingUser = null;
      this.editedUser = {
        id: null,
        username: "",
        email: "",
        password: "",
      };
    },
  },
};
</script>

<style>
.bg-side {
  background-image: url("/src/assets/logo/bgside.png");
  min-height: 100vh;
}

.bg-center {
  background-color: bisque;
}

.user-info {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 10px;
}

.edit-form {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
}
</style>
