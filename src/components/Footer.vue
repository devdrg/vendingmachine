<template>
    <div class="footer">
        <div class="content">
            <p style="font-size: 9pt;">
                Vending Machine Project
                <br>
                Github
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "Footer",
    components: {
        // VImage,
    },
    props: ["user"],

    // beforeMount () {
    //     this.user = mapGetters(["GET_USER"]);
    //     // console.log(this.user);
    // }
};
</script>

<style lang="scss">
    .footer {
        font-size: 11pt;
        height: 4rem;
        display: inline-block;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex: 0 0 50px;
        position: static;
        bottom: 0;
        width:100%;
        margin-top: auto;

        .content {
            margin-bottom: 0;
            text-align: center;
        }

        .footer-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 0 0.4rem;
            text-decoration: none !important;
            font-size: 0.9rem;
            font-family: 'Roboto', sans-serif;
            cursor: pointer;
        }
        .footer-link {
            margin: 1%;
        }

        p {
            margin: 0;
        }
    }
</style>
