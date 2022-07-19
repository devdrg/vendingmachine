<template>
    <!-- <div id="app"> -->
    <div id="app">
        <!-- <vue-simple-spinner></vue-simple-spinner> -->
        <!-- <transition name="fade">
            <PageLoader v-show="spinnerVisible" />
        </transition> -->
        <!-- <Navbar :user="$store.getters.GET_USER" v-if="GET_USER().username"/> -->
        <!-- <Header v-if="!GET_USER().username"/> -->
        <div class="content-container">
            <router-view />
        </div>
        <Footer/>
    </div>
</template>

<script>
// import Navbar from "@/components/Navbar.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { bus } from "./main";
import { mapGetters } from "vuex";
// import PageLoader from "@/components/PageLoader.vue";
export default {
    name: "App",
    components: {
        // Navbar,
        Header,
        Footer,
        // PageLoader
    },
    data () {
        return {
            user: null,
            spinnerVisible: true
        };
    },
    mounted () {
        // getUser () {
        //     return mapGetters(["GET_USER"]).email;
        // }
        // this.$nextTick(setTimeout(() => this.spinnerVisible = false, 2000))
        setTimeout(() => this.spinnerVisible = false, 2000);
    },
    // watch: {
    //     'store.getters.GET_USER.email': {
    //         handler: function () {
    //             console.log("se schimba");
    //             this.user = $store.getters.GET_USER;
    //             // console.log("value changed from " + oldVal + " to " + newVal);
    //         },
    //         deep: true
    //     }
    // },
    beforeMount () {
        (async () => {
            document.documentElement.style.setProperty('--my-variable-name', 'pink');
            var windowHeight = window.screen.availHeight;

            // await this.authenticateUser();
        })();
        // this.user = this.$store.getters.GET_USER;
    },
    computed: {
        btnStyles() {
            return {
                height: `${this.windowHeight}px`
            };
        }
    },
    // watch: {
    //     usr: function() {
    //         return this.GET_USER;
    //     }
    // },
    // errorCaptured(err, vm, info)  {
    //     /// what you want to do with error here
    //     console.log("erorare");
    //     console.log(err);
    // },
    methods: {
        ...mapGetters(["GET_USER", "GET_USERID"]),
        listenForNotification (data) {
            bus.$emit("changeMessage", `new message from ${data.newMessage}`, "");
            bus.$emit("markUnreadMessage", data.roomId);
        },
        listenForBidNotification (data) {
            // this.$sock.on("refreshBidHistory", () => bus.$emit("refreshBids"));
            console.log("bidNotification");
            bus.$emit("changeMessage", `Oferta dvs depusă în cadrul licitației cu nr. ${data.id} a fost surclasată.`, "");
        },
        async authenticateUser () {
            if (localStorage.getItem("token")) {
                this.isLoading = true;
                try {
                    const response = await this.$http.get("api/auth/isAuthenticated",
                        {
                            headers: {
                                Authorization: localStorage.getItem("token")
                            }
                        });
                    // this.$sock.open();
                    // console.log(response.data);
                    this.user = response.data;
                    // this.$store.commit("UPDATE_USER", response.data);
                    // console.log("listening1");
                    // this.$sock.on("test", alert("yeste"));
                    // this.$sock.on("chatUserBidInfo", this.listenForBidNotification);
                    // console.log("1");
                    // console.log(this.GET_USER());
                    // console.log("2");
                    this.$store.watch(() => this.GET_USER().username, () => {
                        
                        if (this.GET_USER().username) {
                            console.log("listening2");
                            this.$sock.emit("joinUserRoom", { userId: this.GET_USER().userId });
                            this.$sock.on("chatUserInfo", this.listenForNotification);
                            this.$sock.on("chatUserBidInfo", this.listenForBidNotification);
                        } else if (this.GET_USER().username === undefined) {
                            this.$sock.removeListener("chatUserInfo", this.listenForNotification);
                            this.$sock.removeListener("chatUserBidInfo", this.listenForBidNotification);
                        }
                    });
                    // this.invitations = items;
                    this.isLoading = false;
                    // this.page.next = next;
                    // this.page.prev = prev;
                } catch (error) {
                    console.log("nelogat");
                    // if (error.status === 401){

                    // }
                    this.isLoading = false;
                    this.$store.commit("LOGOUT_USER");
                }
                // try {
                //     const response = await this.$http.get("api/auth/isAuthenticated");
                //     this.$sock.open();
                //     // console.log(response.data);
                //     this.user = response.data;
                //     // if (!this.user) {
                //     //     this.$router.push("/login");
                //     // } else {
                //     //     next();
                //     // }
                //     console.log(this.user);
                //     this.$store.commit("UPDATE_USER", response.data);
                //     // console.log(this.GET_USER());
                //     // this.$store.commit("UPDATE_USER_ROLE", response.data.role);
                //     // this.$store.commit("UPDATE_USER_ROLE", response.data.role);
                //     // this.$store.commit("UPDATE_AVATAR", response.data.avatarImage || "");
                //     // this.$store.commit("UPDATE_USERID", response.data.id);
                //     // this.$router.go();
                // } catch (error) {
                //     // this.$store.commit("UPDATE_USER", null);
                //     // this.$store.commit("UPDATE_USERID", null);
                //     this.$store.commit("LOGOUT_USER");
                // }
            } else {
                this.$store.commit("LOGOUT_USER");
            }
        }
    }
};
</script>

<style lang="scss">
:root {
    --my-variable-name: $windowHeight;
}
body {
    // background: $main-light-grey;
    // height: var(--my-variable-name);
    height: 100%;
    width: 100vw;
    // min-height: 100%;
    padding: 0;
    margin: 0;
    // display: block;

    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // position: relative;
    // font-family: "Secular One", sans-serif;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-family: "Helvetica Neue", Helvetica;
    overflow-y: scroll;

    // background: rgb(10,93,172);
    // background: linear-gradient(90deg, rgba(10,93,172,1) 0%, rgba(49,149,249,1) 100%);
    // background-color: #f7f7f7;
    // background-color: lightgrey;
    background-color: white;

}
#app {
    display: flex;
    flex-direction: column;

    // display: block;
    overflow: auto;

    // position: relative;
    // height: fit-content;
    // min-height: 100% !important;

    // display: block;
    // position: absolute;
    // position: fixed;

    // left: 50%;
    // transform: translateX(-50%);

    

    height: 100vh;
    // height: var(--my-variable-name);
    // overflow: scroll;
    // overflow: auto;

}
// div {
//     overflow: auto;
// }
.content-container {
    // position: absolute;
    // height: auto;
    position: relative;
    display: block;
    // min-height: min(calc(100vh - 11.5rem), 100vw);
    // background-color: blue;
    // min-height: 100vh;
    // background: linear-gradient(0deg, rgba(218,218,218,1) 0%, rgba(255,255,255,1) 100%);
    // background-color: white;
    // min-height: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    // min-height: 100vh;
        // padding: -3rem 0;


    // margin: auto;
    // min-height: 100vh;
    // min-height: var(--my-variable-name - 5rem) vh;
    // min-height: calc(96vh - 200px);
    // min-height: calc(100vh - 4rem);

    min-height: max(calc((100vh - 4rem)/2), 300px); // !!!!!!!!!!!!!!
    // height: 100vh;


    // min-height: 400px;
    height: 100%;
    // min-height: calc(100vh - 4rem);
    // min-height: min(calc(100vh - 4rem), calc(100vw - 4rem));


}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@media only screen and (max-width:480px) {
    html, body, #app {
        height: 100%;
    }
    

  .content-container {
    position: relative;

    // flex: 1 1 auto;
    // min-height: 100vh;
    // min-height: calc(100vh - 4rem);
    // min0height: 
    // max-height: 800px;
    // margin-top: 0;
    // min-height: max(calc(100vh - 4rem - 300px), 100vw);

    // min-height: max(calc(100vh - 11.5rem), 100vw);
    // height: var(--my-variable-name);

}

}
</style>
