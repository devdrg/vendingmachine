<template>
    <div class="login-container">
        <b-form class="login-form">
            <b-form-input
                v-for="field in loginFields"
                v-model="field.value"
                :key="field.name"
                :value="field.value"
                :name="field.name"
                :placeholder="field.placeholder"
                :type="field.type"
                :invalid-feedback="field.error"
                v-on:validateField="validateFieldLogin"
            />
            
            <!-- <b-button variant="primary" type="submit" :disabled="!isReadyToSent || spinner" @click="login"> -->
            <b-button variant="primary" type="submit" @click="login">
                Login
            </b-button>

            <spinner-2 style="margin-top: 1rem;" v-if="spinner"/>
            <!-- <spinner-2/> -->
            <span v-if="this.loginFields[1].error && !spinner" style="color: red; margin-top: 1rem;">{{ loginFields[1].error }}</span>
            <!-- <span v-if="!this.loginFields[1].error && !spinner" style="color: white;"> .</span> -->
            <span v-if="!this.loginFields[1].error && !spinner" style="color: white; margin-top: 1rem;"> .</span>
        </b-form>
        <ul class="utils">
                <!-- <li>
                    <router-link id="registration-link" to="/forgotpassword">Am uitat parola</router-link>
                </li> -->
                <li>
                    <router-link id="registration-link" to="/register">Don't have an account? Create a new one!</router-link>
                </li>
                <!-- <li>
                    <router-link id="registration-link" to="/contact">Contact</router-link>
                </li> -->
            </ul>
    </div>
</template>

<script>
import { TextInput } from "@/components/Inputs";
import { mapMutations } from "vuex";
import { Spinner2 } from "@/components/Spinners";

// import store from "../store";

export default {
    name: "Login",
    components: {
        TextInput,
        Spinner2
    },
    data () {
        return {
            spinner: false,
            loginFields: [
                {
                    isValid: false,
                    name: "username",
                    value: "",
                    // type: "string",
                    placeholder: "username",
                    error: "",
                    validation: {
                        required: true,
                        spaces: false
                    }
                },
                {
                    isValid: false,
                    name: "password",
                    value: "",
                    error: "",
                    type: "password",
                    placeholder: "password",
                    validation: {
                        required: true,
                        spaces: false
                    }
                }
            ]
        };
    },
    methods: {
        ...mapMutations(["UPDATE_USER", "LOGOUT_USER", "UPDATE_AVATAR", "UPDATE_USERID"]),
        validateFieldLogin (fieldName, val) {
            this.loginFields = this.loginFields.map(field => {
                if (fieldName === field.name) {
                    console.log("valid")
                    return { ...field, isValid: val };
                } else {
                    console.log("notvalid")
                    return field;
                }
            });
        },
        isValid() {
            return this.name.length > 3 ? true : false; //your validation criteria goes here
        },
        // validEmail (email) {
        //     var re = /(.+)@(.+){2,}\.(.+){2,}/;
        //     return re.test(email.toLowerCase());
        // },
        async login (event) {
            event.preventDefault();
            this.spinner = true;
            // console.log(event);
            // console.log(this.loginFields[0].value);
            // console.log(this.loginFields[1].value);
            try {
                const response = await this.$http.post("/api/auth/login/jwt", {
                    username: this.loginFields[0].value,
                    password: this.loginFields[1].value
                });
                // const response = await this.$http.post("/api/auth/login", {
                //     username: this.loginFields[0].value,
                //     password: this.loginFields[1].value
                // });
                // this.UPDATE_USER(response.data.user);
                // console.log(response.data.user)
                (async () => {
                    await this.UPDATE_USER(response.data.user);
                    localStorage.setItem("token", response.data.token);
                })().then(() => {
                    // this.$sock.open();
                    this.spinner = false;
                    this.$router.push(sessionStorage.getItem("redirectPath") || "/defaultpath");
                    sessionStorage.removeItem("redirectPath");
                    // setTimeout(function(){ this.$router.go(); }, 1000);
                    // this.$router.go();
                    // this.$forceUpdate();
                    // window.location.reload(true);
                    // this.$router.go();
                });
                // this.UPDATE_USER(response.data.user).exec().then(() => {
                //     this.$sock.open();
                //     this.spinner = false;
                //     this.$router.push("/");
                // });
                // this.UPDATE_AVATAR(response.data.user.avatarImage || "");
                // this.UPDATE_USERID(response.data.user.id);
            } catch (error) {
                this.spinner = false;
                console.log("eroare");
                console.log(error);
                if (!error.response) {
                    this.loginFields = this.loginFields.map(field => ({
                        ...field,
                        error: "A problem occured. Please try again."
                    }));
                } else {
                    this.LOGOUT_USER();
                    this.loginFields = this.loginFields.map(field => ({
                        ...field,
                        error: "Incorrect username and/or password."
                    }));
                }
                
                // this.UPDATE_USER(null);
                // this.UPDATE_USERID(null);
                // if (error.response.status === 404) {
                //     this.loginFields = this.loginFields.map(field => ({
                //         ...field,
                //         error: "E-mail sau parola incorectă"
                //     }));
                //     // this.loginFields[1].error = "Adresa de e-mail sau parola gresită.";
                //     // this.loginFields[1].error = false;
                // }
            }
        }
    },
    computed: {
        isReadyToSent () {
            return this.loginFields.reduce((sum, next) => sum && next.isValid, true);
        }
    }
};
</script>

<style lang="scss">
    .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 100%;
        max-width: 350px;
        // min-height: 300px;
        // padding-top: 2rem;
        // padding-bottom: 2rem;

        

        // background: lightgrey;

        img {
            // max-height: 50vw;
            // max-width: 25vh;
            max-height: 200px;
        }

        .form-title {
            $font-size: 1.3rem;
            //  background: #ECEBF1;
            //  color: $main-dark-blue;
             padding: 0.2rem 1rem;
             border-radius: 5px;
             display: flex;
             flex-direction: row;
             place-items: center;
             margin-bottom: 2rem;
             margin-top: auto;

             
             img {
                 height: $font-size;
                 width: $font-size;
                 margin-right: 0.4rem;
             }
             span {
                 font-size: $font-size;
             }
        }
        .login-form {
            // min-width: 15rem;
            width: 90%;
            display: flex;
            flex-direction: column;

            // border: 1px solid lightgrey;
            border-radius: 5px;
            // padding: 2rem;

            .primary-btn {
                align-self: center;
                .spinner-2 {
                    position: absolute;
                }
            }
            input {
                margin-bottom: 1rem;
            }
            ul {
                padding: 0;
                list-style: none;
                margin-top: 2rem;
                // border-top: 1px solid grey;
            }
        }
        #registration-link {
            // color: $main-dark-blue;
            color: dimgray;
            align-self: center;
            font-size: 0.9rem;
            // margin-top: 1.5rem;
            :hover {
                cursor: pointer;
                text-decoration: underline;
            }
        }
    }

    .footer-item {
        display: flex;
        width: 100vw;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 0.4rem;
        text-decoration: none !important;
        // color: white;
        font-size: 0.8rem;
        font-family: 'Roboto', sans-serif;
        cursor: pointer;
    }

    .utils {
        list-style-type: none;
        padding: 0;
        margin-top: 1rem;
        display: inline-block;
        li {
            text-align: center;
            // font-weight: bold;

            
        }
    }
</style>
