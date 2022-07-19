<template>
    <form class="place-bid-input">
        <span class="currency">{{this.GET_CURRENCY()}}*</span>
        <!-- <v-text-field  ref="field" :max="bestPrice" step="0.05" type="Number" v-model="bid" /> -->
        <b-form-input v-model="price" type="number" step="0.5" :max="bestPrice"></b-form-input>
        <!-- <b-form-input v-model.number="bid" type="number"></b-form-input> -->
        <b-button variant="warning" type="submit" @click="placeBid"><strong>Ofertează</strong></b-button>
    </form>
</template>

<script>
import { bus } from "../../main";
import { mapGetters } from "vuex";

import AutoNumeric from "autonumeric";

export default {
    name: "PlaceBidInput",
    props: {
        _id: {
            type: Number
        },
        bestPrice: {
            type: Number
        }
    },
    data () {
        return {
            // bestPrice: Math.max(this.price, this.bestPrice)
            price: null
        };
    },
    mounted() {
        // new AutoNumeric(this.$refs.field.$refs.input);
    },
    methods: {
        ...mapGetters(["GET_USER", "GET_CURRENCY"]),
        placeBid (event) {
            if (this.price) {
                event.preventDefault();
                if (confirm(`Confirmare înregistrare ofertă: ${this.price} ${this.GET_CURRENCY()}`)) {
                    // this.$sock.emit("test");
                    // console.log("oferta noua front");
                    event.preventDefault();
                    // this.$sock.emit("test");
                    // console.log(this._id);
                    // console.log(this.bid);
                    // console.log(typeof this.bid);
                    this.$sock.emit("liveBid", {
                        roomId: this._id,
                        bid: this.price,
                        user: this.GET_USER().userId
                    },
                    err => {
                        console.log(err);
                        console.log("eroare pret")
                        bus.$emit("changeMessage", err, "error");
                    });
                    this.$parent.$parent.getAuctionInfo();
                    // this.$sock.emit("test");
                    this.price = null;
                } else {
                    event.preventDefault();
                    // next();
                }
            } else {
                event.preventDefault();
            }
        }
    }
};
</script>

<style lang="scss" >
.place-bid-input {
    margin: 1rem 0;
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .primary-btn {
        border-radius: 0;
        font-size: 1.1rem;
        outline: none;
    }
    input {
        background: rgb(211, 206, 228);
        font-family: "Secular One", sans-serif;
        border: none;
        background: transparent;
        font-size: 1rem;
        // width: 7rem;
        padding: 0 0.3rem;
        outline: none;
        border: solid 1px rgb(155, 155, 155);
        margin: 0.2rem 0;

    }
    .currency {
        margin: 0 0.5rem;
        color: rgb(72, 67, 82);
    }
}
</style>
