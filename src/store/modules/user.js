import router from "@/router";
import vueInstance from "@/main";
import store from "..";
import { bus } from "@/main";

const state = {
    user: false,
    companie: "",
    role: null,
    isSigned: false,
    // cui: "",
    // persoana: "",
    // telefon: "",
    // avatar: "",
    userId: null,
    token: null
};

const getters = {
    GET_USER: (state) => ({
        username: state.username,
        role: state.role,
        userId: state.userId,
        token: state.token
    }),
    GET_USERID: (state) => state.userId,
    GET_USER_ROLE: (state) => state.role
};

const actions = {
    LOGOUT: ({ commit }) => {
        vueInstance.$http.get("/api/auth/logout")
            .then(() => {
                vueInstance.$sock.close();
                // commit("UPDATE_USER", null);
                // commit("UPDATE_USERID", null);
                commit("LOGOUT_USER", null);
                sessionStorage.setItem('redirectPath', "/");
                router.push("/").catch(() => { });
            });
    },
    async GETUSER({commit, state}) {
        // console.log(store.getters.GET_USER);
        if(store.getters.GET_USER.username === undefined) {
            const user = await authenticateUser().then((res) => {
                console.log(res);
                if (!res) {
                    console.log("no response");
                    (async () => { await commit("LOGOUT_USER", null); })()
                } else {
                    console.log("updating user");
                    // await commit("UPDATE_USER", res);
                    (async () => { await commit("UPDATE_USER", res); })().then(() => {
                        console.log(store.getters.GET_USER);
                    })
                }
            })
            return user;
        }
    }
};

const mutations = {
    // UPDATE_USER (state, email) {
    //     state.user = email;
    // },
    UPDATE_USER (state, user) {
        // state = user;
        state.username = user.username;
        state.role = user.role;
        state.userId = user._id;
        state.token = user.token;
        // console.log(state);
        // console.log(user);
    },
    // UPDATE_AVATAR (state, avatarImage) {
    //     state.avatar = avatarImage;
    // },
    // UPDATE_USERID (state, userId) {
    //     state.userId = userId;
    // },
    LOGOUT_USER () {
        // state = user;
        function setAll (obj, val) {
            /* Duplicated with @Maksim Kalmykov
                for(index in obj) if(obj.hasOwnProperty(index))
                    obj[index] = val;
            */
            Object.keys(obj).forEach(function (index) {
                obj[index] = val;
            });
        }
        function setNull (obj) {
            setAll(obj, null);
        }
        setNull(state, null);
    }
    // UPDATE_USER_ROLE (state, role)
};

async function authenticateUser () {
    if (localStorage.getItem("token")) {
        // this.isLoading = true;
        // const response = await bus.$http.get("api/auth/isAuthenticated",
        //     {
        //         headers: {
        //             Authorization: localStorage.getItem("token")
        //         }
        //     });
        // console.log(response);
        try {
            console.log("awaiting response");
            const response = await bus.$http.get("api/auth/isAuthenticated",
                {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
            // return response;
            console.log(response);
            // this.user = response.data;
            // store.commit("UPDATE_USER", response.data);
            // store.watch(() => this.GET_USER().email, () => {
            // // console.log(this.GET_USER());
            //     if (this.GET_USER().email) {
            //         this.$sock.emit("joinUserRoom", { userId: this.GET_USERID() });
            //         this.$sock.on("chatUserInfo", this.listenForNotification);
            //         this.$sock.on("chatUserBidInfo", this.listenForBidNotification);
            //     } else if (this.GET_USER().email === undefined) {
            //         this.$sock.removeListener("chatUserInfo", this.listenForNotification);
            //         this.$sock.removeListener("chatUserBidInfo", this.listenForBidNotification);
            //     }
            // });
            // this.invitations = items;
            // this.isLoading = false;
            // this.page.next = next;
            // this.page.prev = prev;
            return response.data;
        } catch (error) {
            console.log("nelogat");
            store.commit("LOGOUT_USER");
            return null;
            // this.isLoading = false;
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
        store.commit("LOGOUT_USER");
    }
}

export default {
    state,
    getters,
    actions,
    mutations
};
