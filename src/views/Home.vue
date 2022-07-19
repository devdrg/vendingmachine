<template>
    <div class="home-container">
        <EditProductModal :product="selectedProduct" @refresh="fetchProducts()"/>

        <div class="page-wrap">
      <div class="vend-container">
        <div class="vend-outer">
            <router-link id="banner" to="/"><h3>VENDING MACHINE</h3></router-link>
            <div v-if="this.role == 'Buyer'">
          <div class="return-box" id="return" >
          </div>
          <b-button id="return-button" v-on:click="resetDeposit()">
              Return
          </b-button>
          <div class="pay-box" id="pay">
              Credit: {{ deposit }}
          </div>
          <div class="display-box" id="displayBox">
              <Footer/>
          </div>
          <!-- <span>You are a {{role}}</span> -->
          <div class="coin-box">
            <div class="coin-outter" id="five" v-on:click="depositFunds(5)">
              <p class="coin">.05</p>
            </div>
            <div class="coin-outter" id="ten" v-on:click="depositFunds(10)">
              <p class="coin">.10</p>
            </div>
            <div class="coin-outter" id="twentyFive" v-on:click="depositFunds(25)">
              <p class="coin">.25</p>
            </div>
            <div class="coin-outter" id="fifty" v-on:click="depositFunds(50)">
              <p class="coin">.50</p>
            </div>
            <div class="coin-outter" id="oneHundred" v-on:click="depositFunds(100)">
              <p class="coin">100</p>
            </div>
          </div>
            </div>
          <b-button class="sellButton" v-b-modal.EditProductModal v-if="this.role == 'Seller'" @click="sendInfo({})">
              Sell a product
          </b-button>
          <b-button id="logoutButton" class="logoutButton" v-on:click="logOutUser()">
              Logout
          </b-button>
          <div class="vend-back">
              <div
                v-for="product in products"
                v-bind="product.id" class="productSpace"
                v-b-modal.EditProductModal
                v-if="uId === product.sellerId"
                @click="sendInfo(product)">
                  <!-- <div class="inner-spiral"> -->
                  <li class="productDescription">
                      <ul>{{ product.productName }}</ul>
                      <ul>${{ product.cost }}</ul>
                      <ul>{{ product.amountAvailable }} left</ul>
                  </li>
              </div>
              <div v-if="role == 'Buyer'" v-for="product in products" v-bind="product.id" class="productSpace" v-on:click="buyProduct(product)">
                  <!-- <div class="inner-spiral"> -->
                  <li class="productDescription">
                      <ul>{{ product._id }}</ul>
                      <ul>{{ product.productName }}</ul>
                      <ul>${{ product.cost }}</ul>
                      <ul>{{ product.amountAvailable }} left</ul>
                  </li>
              </div>
          </div>
          <div class="grab-box">
              {{ infoMessage }}
          </div>
          <!-- <div id="footer"><Footer/></div> -->
        </div>
      </div>
    </div>

    <!-- <script src="machine.js"></script>
    <script src="item.js"></script>
    <script src="app.js"></script> -->
    </div>
</template>

<script>
// import { Spinner1 } from "@/components/Spinners";
// import ProductContainer from "@/components/ProductContainer";

import Footer from "@/components/Footer.vue";
import EditProductModal from "@/views/EditProductModal.vue";

export default {
    name: "Home",
    components: {
        // ProductContainer,
        // Spinner1,
        EditProductModal,
        Footer
    },
    data () {
        return {
            products: [],
            deposit: null,
            role: null,
            uId: null,
            infoMessage: "",
            selectedProduct: null
            // spinner: true
        };
    },
    async created () {
        await this.fetchProducts();
        await this.fetchDeposit();
    },
    methods: {
        sendInfo (item) {
            this.selectedProduct = item;
            console.log(this.selectedProduct)
        },
        async fetchProducts () {
            this.spinner = true;
            try {
                const response = await this.$http.get("/api/products",
                    {
                        headers: {
                            Authorization: localStorage.getItem("token")
                        }
                    });
                this.products = response.data.products;
            } catch (error) {
                console.log(error);
            }
        },
        async fetchDeposit () {
            try {
                const response = await this.$http.get("/api/user/profile",
                    {
                        headers: {
                            Authorization: localStorage.getItem("token")
                        }
                    });
                const currentAmount = response.data.user.deposit;
                this.role = response.data.user.role;
                this.uId = response.data.user._id;
                this.deposit = currentAmount;
            } catch (error) {
                console.log(error);
            }
        },
        async depositFunds (amount) {
            const data = {};
            data.amountToDeposit = amount;
            try {
                const response = await this.$http.put("/api/user/deposit",
                    data,
                    {
                        headers: {
                            Authorization: localStorage.getItem("token")
                        }
                    });
                const newAmount = response.data.updatedDeposit;
                this.deposit = newAmount;
                this.infoMessage = `you have inserted $${amount}`;
            } catch (error) {
                console.log(error);
            }
        },
        async resetDeposit () {
            try {
                const response = await this.$http.get("/api/user/reset",
                    {
                        headers: {
                            Authorization: localStorage.getItem("token")
                        }
                    });
                const newAmount = response.data.updatedDeposit;
                this.infoMessage = "you have recovered your coins";
                this.deposit = newAmount;
            } catch (error) {
                console.log(error);
            }
        },
        async buyProduct (prod) {
            if (prod.amountAvailable === 0) {
                this.infoMessage = `${prod.productName} is out of stock`;
            } else if (this.deposit >= prod.cost) {
                try {
                    await this.$http.get(`/api/products/${prod._id}/buy`,
                        {
                            headers: {
                                Authorization: localStorage.getItem("token")
                            }
                        }).then((response) => {
                        this.infoMessage = `you bought a ${prod.productName}`;
                        this.fetchProducts();
                        this.fetchDeposit();
                    });
                } catch (error) {
                    console.log(error);
                }
            } else {
                this.infoMessage = `you do not have enought credit to buy ${prod.productName}`;
            }
        },
        logOutUser () {
            this.$store.dispatch("LOGOUT").then(() => {
                localStorage.removeItem("token");
                this.$router.push("/");
            });
            this.$router.go();
        }
    }
};
</script>

<style lang="scss">

body {
  padding: 0;
  margin: 0;
}

.page-wrap {
  height: 100vh;
  position: relative;
//   padding: 75px 15px 50px 15px;
  background-color: #fafafa;
}

.vend-outer {
//   width: 400px;
  width: 100vw;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
  margin: auto;
  height: 500px;
  height: 100vh;
  background-color: dodgerblue;
  padding: 20px;
  position: relative;
//   border-radius: 25px;
  z-index: 97;
}

.display-box {
  position: absolute;
  bottom: 40px;
//   height: 100px;
//   left: 15px;
  right: 15px;
  height: 25px;
  padding: 0px 12px;
//   display: flex;
  justify-content: space-around;
  align-items: center;
}

.display {
  flex-basis: 75px;
  background-color: #333;
  -moz-box-shadow:    inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow:         inset 0 0 10px #000000;
  color: goldenrod;
  align-self: Stretch;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pay-box {
  position: absolute;
  top: 113px;
  right: 10px;
  background-color: #333;
  width: 150px;
  height: 25px;
  -moz-box-shadow:    inset 0 0 10px #000000;
   -webkit-box-shadow: inset 0 0 10px #000000;
   box-shadow:         inset 0 0 10px #000000;
   display: flex;
   justify-content: center;
   align-items: center;
   color: #ddd;
}

.coin-box {
  position: absolute;
  right: 10px;
  top: 150px;
  width: 150px;
  height: 30px;
  display: flex;
  justify-content: space-around;
}

.coin-outter {
  background-color: #ddd;
  width: 30px;
//   display: flex;
  justify-content: center;
  align-items: center;
  color: #666666;
  border-radius: 100%;
  border: 1px dotted #696969;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.help-box {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #333;
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
}

.coin-outter:active {
  box-shadow: none;
}

#banner {
    color: white;
  padding-bottom: 10px;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
}

.sellButton {
  position: absolute;
  right: 10px;
  top: 100px;
   display: flex;
   justify-content: center;
   align-items: center;
}
.logoutButton {
  position: absolute;
  right: 10px;
  top: 19px;
   display: flex;
   justify-content: center;
   align-items: center;
//    color: goldenrod;
   border-radius: 5px;
}

.pepsi-box {
  position: absolute;
  top: 0;
  left: 23px;
  width: 45px;
  height: 100%;
}

.soda,
.grab-soda {
  position: absolute;
  z-index: 98;
  height: 30px;
  width: 26px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.3);
}

.return-box {
  position: absolute;
  top: 300px;
  right: 45px;
  background-color: #333;
  width: 30px;
  height: 40px;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.return-box:active {
  box-shadow: none;
}

#return-button {
  position: absolute;
  top: 300px;
  right: 80px;
  background-color: #333;
//   width: 20px;
//   height: 30px;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.price-box {
  color: #ddd;
  position: absolute;
  z-index: 98;
}

.touch-pad {
  background-color: #333;
  position: absolute;
  right: 5%;
  top: 35%;
  width: 75px;
  height: 100px;
  display: flex;
  flex-wrap: wrap;
  -moz-box-shadow:    inset 0 0 10px #000000;
   -webkit-box-shadow: inset 0 0 10px #000000;
   box-shadow:         inset 0 0 10px #000000;
   border-radius: 5px;
}

.button {
  border: 1px solid #444;
  flex-basis: calc(50% - 2px);
  color: #ddd;
  align-self: stretch;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.button:active {
  background-color: #555;
}

.button p {
  margin: 0;
}

.vend-back {
  background-color: #000;
  position: relative;
  height: 90%;
  width: 75%;
  -moz-box-shadow:    inset 0 0 10px #000000;
   -webkit-box-shadow: inset 0 0 10px #000000;
   box-shadow:         inset 0 0 10px #000000;
   overflow: hidden;
   border-radius: 5px;
//    display: flex;
//    align-items: flex-start;

display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;


//    display: grid;
//   grid-template-columns: repeat(2, minmax(25%, 1fr));
//   grid-gap: 1rem;
//   width: fit-content;

}

.product-row {
  background-color: #111;
  border-bottom: 4px solid black;
  height: 81px;
  -moz-box-shadow:    inset 0 0 10px #000000;
   -webkit-box-shadow: inset 0 0 10px #000000;
   box-shadow:         inset 0 0 10px #000000;
//    display: flex;
   justify-content: space-around;
//    align-items: flex-end;
//    position: relative;
   
}

.productSpace {
  background: lightgray;
//   width: 25%;
//   height: 25%;
  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 1);
//   display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
//   padding: 4rem;
}

.productDescription {
    list-style: none;
    ul {
        padding: 0;
        margin: 0;
    }
}

.inner-spiral {
  position: absolute;

  width: 10%;
  height: 10%;
  bottom: 0;
  border: 2px solid silver;
  border-radius: 100%;
  z-index: 8;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.vend-glass {
  background: rgba(255,255,255, .25);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  border-radius: 5px;
}

.grab-box {
  background-color: #333;
  color: white;
  position: absolute;
  right: 2%;
  top: 60%;
  width: 160px;
  height: 160px;
  display: flex;
  flex-wrap: wrap;
  -moz-box-shadow: inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow: inset 0 0 10px #000000;
  border-radius: 5px;
  z-index: 98;
  overflow: hidden;
}

.bottom-box {
  padding-top: 150px;
  background-color: #70D3D0;
  border-top: 1px solid #ddd;
  padding: 25px;
  text-align: center;
  color: #fff;
  z-index: 98;
}


</style>
