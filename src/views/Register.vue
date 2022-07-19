<template>
    <div class="register-container">
        <div>
        </div>
            <form class="register-form" ref="registerForm" @submit.prevent="validateBeforeSubmit" style="text-align: left;">
                <h3 style="margin-bottom: 2rem; text-align: center;">Create new account</h3>

                <!-- <span> -->
                
                <!-- <div>
                    <label for="Furnizor energie electrica">Furnizor energie electrica</label>
                    <input
                    type="checkbox"
                    name="Furnizor energie electrica"
                    v-model="furnizor_EE"
                    >
                </div> -->
                    <!-- <span style="color: red"><strong>Choose account type:</strong></span> -->

                <!-- <div id="tipFurnizor" > -->
                    <!-- <label v-for="option in options" v-bind:key="option.name">
                        <b-form-checkbox
                        :checked="option.checked"
                        v-model="option.checked"
                        label="option.name"
                        /> {{option.name}}
                    </label> -->
                    <b-form-select v-model="selected" :options="options"></b-form-select>

                <!-- </div> -->
                <!-- <b-form-input
                    v-for="field in registerFields"
                    v-model="field.value"
                    :key="field.name"
                    :value="field.value"
                    :name="field.name"
                    :true-value="true"
                    :type="field.type"
                    :validation="field.validation"
                    :error="field.error"
                    :required="field.validation.required"
                    v-on:validateField="validateFieldLogin"
                    :placeholder="field.name"
                    autocomplete="nope"
                /> -->
                <ul style="padding: 0px;">
                    <li v-for="field in registerFields" :key="field.name"  style="display: inline; text-align: left;">
                        <!-- {{ field.name }} -->
                        <!-- <label class="col-sm-2 control-label">{{ field.name }}</label> -->
                        <text-input
                            v-model="field.value"
                            :key="field.name"
                            :value="field.value"
                            :name="field.name"
                            :true-value="true"
                            :type="field.type"
                            :validation="field.validation"
                            :error="field.error"
                            :required="field.validation.required"
                            v-on:validateField="validateFieldLogin"
                            :placeholder="field.name"
                            autocomplete="nope"
                        />
                    </li>
                </ul>


                <!-- <span>
                    <input type="checkbox"
                    :checked="terms.checked"
                    v-model="terms.checked"
                    name="terms"
                    /> {{terms.name}}
                </span> -->
                <!-- {{ terms.checked }} -->
                <!-- <span><input type="checkbox" name="checkbox" value="check" id="agree" required/>Sunt de acord cu regulamentul.</span> -->
                <!-- {{ registerFields[9].value }} -->
                <div style="display: inline; text-align: center;">
                <router-link to="/"><b-button id="b-button" variant="secondary">
                    Cancel
                    <spinner-2 v-if="spinner" />
                </b-button></router-link>
                <b-button @click="resetForm()" variant="danger" id="b-button">
                    Reset
                    <spinner-2 v-if="spinner" />
                </b-button>
                <b-button variant="primary" id="b-button" type="submit" :disabled="!isReadyToSent || spinner" @click="registerUser">
                    Submit
                    <spinner-2 v-if="spinner" />
                </b-button>
                </div>
                <!-- <button class="primary-btn" type="submit" :disabled="!isReadyToSent || spinner" @click="registerUser">
                    Trimite
                    
                </button> -->
            </form>
    </div>
</template>

<script>
import { TextInput } from "@/components/Inputs";
import { Spinner2 } from "@/components/Spinners";
import { bus } from "../main";

export default {
    name: "Register",
    components: {
        TextInput,
        Spinner2
    },
    data () {
        return {
            spinner: false,
            selected: null,
            options: [
                { value: null, text: 'Please select a role' },
                { value: "Buyer", text: 'Buyer' },
                { value: "Seller", text: 'Seller' }
            ],
            registerFields: [
                {
                    isValid: false,
                    name: "username",
                    type: "string",
                    value: "",
                    error: "",
                    validation: {
                        required: true,
                        spaces: false,
                        maxLength: 15,
                        minLength: 3
                    }
                },
                
                {
                    isValid: false,
                    name: "Password",
                    value: "",
                    error: "",
                    type: "password",
                    validation: {
                        required: true,
                        spaces: false,
                        minLength: 3
                    }
                },
                {
                    isValid: false,
                    name: "Repeat password",
                    value: "",
                    error: "",
                    type: "password",
                    validation: {
                        matchString: "",
                        required: true,
                        spaces: false,
                        minLength: 3
                    }
                }
            ],
            terms: {
                    name: "I agree",
                    checked: false
            }
        };
    },
    methods: {
        async registerUser (event) {
            event.preventDefault();
            this.spinner = true;
            const data = {
                username: this.registerFields[0].value,
                role: this.selected,
                password: this.registerFields[1].value,
                confirmPassword: this.registerFields[2].value
            };
            console.log(data);
            try {
                await this.$http.post("/api/auth/register", data);
                bus.$emit("changeMessage", "succefully registered", "success");
                this.spinner = false;
                this.$router.push("/login");
            } catch (err) {
                this.spinner = false;
                console.log(err)
                if (err.response.data.err) this.registerFields[0].error = err.response.data.msg.email || "";
            }
        },
        validateFieldLogin (fieldName, val) {
            this.registerFields = this.registerFields.map(field => {
                if (fieldName === field.name) {
                    return { ...field, isValid: val };
                } else {
                    return field;
                }
            });
        },
        validateBeforeSubmit (e) {
            this.$validator.validateAll().then(value => {
                if (value) {
                    alert("successfully submitted");
                }
            });
        }
        // resetForm () {
        //     if (confirm("Sunteți sigur că resetați toate cămpurile completate?")) {
        //         this.$nextTick(() => {
        //             this.$refs.registerForm.reset();
        //         });

        //     }
        // }
    },
    computed: {
        matchPassword () {
            return this.registerFields[1].value;
        },
        isReadyToSent () {
            if (this.selected) {
                return this.registerFields.reduce(
                    (sum, next) => sum && next.isValid,
                    true
                );
            } else {
                return false;
            }
        }
    },
    watch: {
        matchPassword (newVal) {
            this.registerFields[2].validation.matchString = newVal;
        }
    }
};
</script>

<style lang="scss">
    .register-container {
        display: flex;
        display: inline-flex;
        flex-direction: column;
        // align-items: center;
        position: relative;
        justify-content: center;
        align-items: center;
        // text-align: center;
        // display: inline-block;
        // margin-top: 3rem;
        // padding: 3rem 0;
        margin: 3rem auto;
        margin-top: 0;

        // width: 500px;
        width: 100%;
        // background-color: rgb(128, 128, 128, 0.1);
        // background-color: rgb(0, 0, 255, 0.75);
        // color: white;
        background-color: white;

        // border-radius: 2rem;
        // border: 1px solid lightgrey;
        // box-shadow: 1px 1px 1px 1px lightgrey;

        img {
            max-height: 50vw;
            max-width: 25vh;
        }

        .form-title {
            $font-size: 1.3rem;
             background: #ECEBF1;
             color: $main-dark-blue;
            //  padding: 0.2rem 1rem;
            padding: 1rem;
             border-radius: 5px;
             display: flex;
             flex-direction: row;
             place-items: center;
            //  margin-bottom: 2rem;
             img {
                 height: $font-size;
                 width: $font-size;
                 margin-right: 0.4rem;
             }
             span {
                 font-size: $font-size;
             }
        }
        input {
            // margin-top: 1rem;
            text-align: center;
            width:100%;
        }

        #tipFurnizor {
            padding: 1rem;
            display: grid;
            border-radius: 0.5rem;
            border: 1px solid lightgrey;
            label {
                display: block;
                padding-left: 40px;
                // text-indent: -15px;
                margin: 0;
                margin-left: -20px;
                
                input {
                // width: 13px;
                // height: 13px;
                padding: 0;
                margin:0;
                // margin-right: 15px;
                // vertical-align: bottom;
                position: relative;
                top: -1px;
                // *overflow: hidden;
                }
        }
        }
        .register-form {
            min-width: 15rem;
            // max-width: 20rem;
            // width: 50%;
            display: flex;
            flex-direction: column;

            // background:#F5F5F5;

            // border: 1px solid lightgrey;
            // border-radius: 5px;
            
            padding: 2rem;
            .primary-btn {
                align-self: center;
                .spinner-2 {
                    position: absolute;
                }
            }
        }
        
        #registration-link {
            color: $main-dark-blue;
            align-self: center;
            font-size: 0.9rem;
            margin-top: 1.5rem;
        }
        span {
            font-size: 0.8rem;
        }

        #b-button {
            margin: 0.25rem
        }
    }
</style>
