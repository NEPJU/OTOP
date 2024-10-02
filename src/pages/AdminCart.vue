<template>
  <div>
    <!-- ส่วนต้อนรับและค้นหา -->
    <div class="row">
      <div class="col-1 bgside"></div>
      <div class="col-10 bgcenter">
        <div style="margin-top: 45px">
          <q-card class="my-card" bordered>
            <div class="welcome-text">ยินดีต้อนรับ</div>
            <div class="welcome-text-sub">ADMIN</div>
          </q-card>
        </div>

        <div class="row">
          <div class="col-1"></div>
          <div class="col-10">
            <br />
            <div class="row justify-center" style="margin-bottom: 15px">
              <input
                v-model="searchTerm"
                placeholder="ค้นหาผลิตภัณฑ์"
                class="search-input"
              />
            </div>
            <br />

            <q-card>
              <div class="add-product-wrapper">
                เพิ่มผลิตภัณฑ์
                <router-link to="/addproduct">
                  <q-btn>
                    <q-icon name="add" color="primary" />
                  </q-btn>
                </router-link>
              </div>
            </q-card>
          </div>
          <div class="col-1"></div>
        </div>

        <!-- ตารางแสดงข้อมูลผลิตภัณฑ์ -->
        <div class="row" style="margin-top: 20px">
          <div class="col-1"></div>
          <div class="col-10">
            <q-table
              :rows="filteredProducts"
              :columns="columns"
              row-key="product_id"
            >
              <template v-slot:body-cell-ProductImage="props">
                <q-td :props="props">
                  <!-- แสดงรูปภาพทั้งหมด -->
                  <div class="images-wrapper">
                    <img
                      v-for="(image, index) in props.row.images"
                      :key="index"
                      :src="image"
                      alt="Product Image"
                      class="productimage"
                    />
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" align="center">
                  <router-link
                    :to="`/aproduct/${props.row.ProductID}`"
                    class="no-underline"
                  >
                    <q-btn color="primary" icon="search" label="ดูรายละเอียด" />
                  </router-link>
                  <q-btn
                    color="green"
                    @click="openEditDialog(props.row)"
                    icon="edit"
                    label="แก้ไข"
                  />
                  <q-btn
                    color="red"
                    @click="deleteProduct(props.row.ProductID)"
                    icon="delete"
                    label="ลบ"
                  />
                </q-td>
              </template>
            </q-table>
          </div>
          <div class="col-1"></div>
        </div>

        <div
          class="justify-center"
          style="display: flex; padding-bottom: 15px; margin-top: 15px"
        >
          <q-btn @click="link" color="red" label="กลับหน้าหลัก" />
        </div>
      </div>

      <div class="col-1 bgside"></div>
    </div>

    <q-dialog v-model="isEditDialogOpen">
      <q-card style="width: 500px">
        <q-card-section>
          <div class="text-h6">แก้ไขผลิตภัณฑ์</div>
        </q-card-section>
        <q-card-section>
          <div class="edit-image-wrapper">
            <img
              :src="editProductForm.images[0]"
              alt="Product Image"
              class="productimage"
            />
          </div>
          <q-input
            v-model="editProductForm.product_name"
            label="Product Name"
          />
          <q-input v-model="editProductForm.description" label="Description" />
          <q-input v-model="editProductForm.price" label="Price" />
          <q-input v-model="editProductForm.quantity" label="Quantity" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="editProduct" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  setup() {
    const router = useRouter();
    const products = ref([]);
    const searchTerm = ref("");

    const isEditDialogOpen = ref(false);
    const editProductForm = ref({
      product_id: "",
      product_name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      images: [],
    });

    const columns = [
      { name: "ProductID", label: "ID", align: "left", field: "ProductID" },
      {
        name: "ProductName",
        label: "ชื่อผลิตภัณฑ์",
        align: "left",
        field: "ProductName",
      },
      {
        name: "ProductCategory",
        label: "หมวดหมู่",
        align: "left",
        field: "ProductCategory",
      },
      {
        name: "ProductQuantity",
        label: "จำนวนคงเหลือ",
        align: "left",
        field: "ProductQuantity",
      },
      {
        name: "ProductPrice",
        label: "ราคา",
        align: "left",
        field: "ProductPrice",
      },
      { name: "ProductImage", label: "รูปภาพ", align: "left", field: "images" },
      { name: "actions", label: "การจัดการ", align: "center" },
    ];

    const link = () => {
      router.push("/adminmain");
    };

    // Fetch products data using API
    const fetchData = () => {
      axios
        .get("http://localhost:3000/products")
        .then((response) => {
          console.log("Fetched products data:", response.data); // ตรวจสอบข้อมูลที่ดึงมา
          products.value = response.data.map((product) => {
            if (product.ProductImage) {
              try {
                // แปลง ProductImage ให้เป็น Array ถ้าจำเป็น
                product.images = Array.isArray(product.ProductImage)
                  ? product.ProductImage
                  : JSON.parse(product.ProductImage);

                // ตรวจสอบว่า images เป็น Array จริงหรือไม่ หากไม่ใช่ให้ทำเป็น Array
                if (!Array.isArray(product.images)) {
                  product.images = [product.images];
                }
              } catch (error) {
                console.error("Error parsing ProductImage:", error);
                product.images = [product.ProductImage];
              }
            } else {
              product.images = [];
            }
            return product;
          });
          console.log("Processed products data:", products.value); // ตรวจสอบข้อมูลที่ประมวลผลแล้ว
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    };

    onMounted(fetchData);

    const filteredProducts = computed(() => {
      if (!searchTerm.value) {
        return products.value;
      } else {
        const searchTermLowerCase = searchTerm.value.toLowerCase();
        return products.value.filter((product) => {
          const productNameLowerCase = product.ProductName.toLowerCase();
          const productId = product.ProductID.toString();
          return (
            productNameLowerCase.includes(searchTermLowerCase) ||
            productId.includes(searchTermLowerCase)
          );
        });
      }
    });
    const openEditDialog = (product) => {
      editProductForm.value = {
        product_id: product.ProductID,
        product_name: product.ProductName,
        description: product.ProductDescription,
        price: product.ProductPrice,
        quantity: product.ProductQuantity,
        category: product.ProductCategory,
        images: product.images || [],
      };
      isEditDialogOpen.value = true;
    };

    const editProduct = async () => {
      const productId = editProductForm.value.product_id; // ต้องใช้ product_id ที่ได้จากข้อมูลที่มี
      if (!productId) {
        console.error("Product ID is not defined.");
        return;
      }

      try {
        await axios.put(`http://localhost:3000/products/${productId}`, {
          product_name: editProductForm.value.product_name,
          description: editProductForm.value.description,
          price: editProductForm.value.price,
          quantity: editProductForm.value.quantity,
          category: editProductForm.value.category,
        });
        fetchData();
        isEditDialogOpen.value = false;
        Swal.fire("Success", "Product updated successfully", "success");
      } catch (error) {
        console.error("Error updating product:", error);
        Swal.fire(
          "Error",
          "An error occurred while updating the product",
          "error"
        );
      }
    };

    const deleteProduct = async (product_id) => {
      try {
        // เปลี่ยนการอ้างอิง product_id เป็น ProductID
        const result = await Swal.fire({
          title: "ต้องการที่จะลบผลิตภัณฑ์ใช่หรือไม่?",
          text: "เมื่อลบแล้วข้อมูลจะหายไป",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ลบข้อมูล",
          cancelButtonText: "ยกเลิก",
        });

        if (result.isConfirmed) {
          await axios.delete(`http://localhost:3000/products/${product_id}`);
          products.value = products.value.filter(
            (product) => product.ProductID !== product_id
          );
          Swal.fire(
            "ทำการลบข้อมูลเสร็จสิ้น!",
            "ข้อมูลผลิตภัณฑ์ถูกลบ",
            "success"
          );
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire(
          "Error!",
          "An error occurred while deleting the product.",
          "error"
        );
      }
    };

    return {
      link,
      searchTerm,
      filteredProducts,
      columns,
      isEditDialogOpen,
      editProductForm,
      openEditDialog,
      editProduct,
      deleteProduct,
    };
  },
};
</script>

<style>
.bgside {
  background-image: url("/src/assets/logo/bgside.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.bgcenter {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.my-card {
  height: auto;
  max-width: 100%;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  padding: 15px;
}

.welcome-text {
  text-align: center;
  font-size: 35px;
  font-weight: bold;
  color: #333;
}

.welcome-text-sub {
  text-align: center;
  font-size: 25px;
  color: #666;
}

.search-input {
  max-width: 500px;
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.search-input:focus {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.productimage {
  max-width: 80px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.add-product-wrapper {
  text-align: center;
  margin-top: 20px;
  font-size: 25px;
}

.q-dialog {
  max-width: 500px;
}

.q-card-section {
  text-align: center;
}

.q-btn {
  margin: 5px;
  padding: 10px 20px;
  border-radius: 25px;
}

.edit-image-wrapper {
  justify-content: center;
  display: flex;
  margin-bottom: 15px;
}

.text-h6 {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
