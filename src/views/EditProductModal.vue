<template>
  <b-modal id="EditProductModal" hide-footer>
      <h3>Add a new product</h3>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="input-group-2" label="Product name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.productName"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Cost:" label-for="input-2">
        <b-form-input
          id="input-2"
          type="number"
          v-model="form.cost"
          placeholder="Enter price"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Amount available:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.amountAvailable"
          placeholder="Enter stock"
          required
        ></b-form-input>
      </b-form-group>

      <!-- <b-form-group id="input-group-4" v-slot="{ ariaDescribedby }">
        <b-form-checkbox-group
          v-model="form.checked"
          id="checkboxes-4"
          :aria-describedby="ariaDescribedby"
        >
          <b-form-checkbox value="me">Check me out</b-form-checkbox>
          <b-form-checkbox value="that">Check that out</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group> -->

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="warning">Reset</b-button>
      <b-button variant="danger" v-if="product._id" @click="deleteProduct()">Delete product</b-button>
    </b-form>
    <!-- <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card> -->
  </b-modal>
</template>

<script>
export default {
    data () {
        return {
            form: {
                productName: "",
                cost: null,
                amountAvailable: null
            }
        };
    },
    props: ["product"],
    methods: {
        async getProductDetails () {
            // if (this.productId) {
            //     try {
            //         await this.$http.get(`/api/products/${this.product}`,
            //             {
            //                 headers: {
            //                     Authorization: localStorage.getItem("token")
            //                 }
            //             }).then(async (res) => {
            //             console.log(res.data);
            //             this.form.productName = res.data.product.productName;
            //             this.form.cost = res.data.product.cost;
            //             this.form.amount = res.data.product.amountAvailable;
            //             this.isLoading = false;
            //         });
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }
            this.form.productName = this.product.productName;
            this.form.cost = this.product.cost;
            this.form.amountAvailable = this.product.amountAvailable;
        },
        onReset (event) {
            event.preventDefault();
            // Reset our form values
            this.form.productName = "";
            this.form.cost = null;
            this.form.amountAvailable = null;
            // Trick to reset/clear native browser form validation state
            this.show = false;
            this.$nextTick(() => {
                this.show = true;
            });
        },
        async onSubmit (event) {
            event.preventDefault();
            const data = this.form;
            this.spinner = true;
            if (this.product._id) {
                try {
                    const response = await this.$http.put(`/api/products/${this.product._id}`, data, { headers: { Authorization: localStorage.getItem("token") } });
                    console.log(response.data);
                    this.spinner = false;
                    this.show = true;
                    this.$bvModal.hide("EditProductModal");
                    this.$emit("refresh");
                } catch (err) {
                    console.log(err);
                    this.spinner = false;
                }
            } else {
                try {
                    const response = await this.$http.post("/api/products", data, { headers: { Authorization: localStorage.getItem("token") } });
                    console.log(response.data);
                    this.spinner = false;
                    this.show = true;
                    this.$bvModal.hide("EditProductModal");
                    this.$emit("refresh");
                } catch (err) {
                    console.log(err);
                    this.spinner = false;
                }
            }
        },
        async deleteProduct () {
            if (this.product._id) {
                try {
                    await this.$http.delete(`/api/products/${this.product._id}`, { headers: { Authorization: localStorage.getItem("token") } });
                    this.$bvModal.hide("EditProductModal");
                    this.$emit("refresh");
                } catch (error) {
                    if (error.response.data.msg !== "" || error.response.data.msg !== undefined) {
                        console.log(error);
                    }
                }
            } else {
                // pass
            }
        }
    },
    // beforeMount () {
    //     if (this.product) {
    //         this.getProductDetails();
    //     }
    // },
    watch: {
        $props: {
            handler () {
                this.getProductDetails();
            },
            deep: true,
            immediate: true
        }
    }
};
</script>