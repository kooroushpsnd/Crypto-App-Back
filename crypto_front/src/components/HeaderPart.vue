<template>
  <div id="header">
    <div class="content">
        <a :href="url" class="logo"><ion-icon size="large" name="diamond-outline"></ion-icon></a>
        <p class="welcome">Welcome To {{ name }}</p>
        <a :href="url" class="logo"><ion-icon size="large" name="diamond-outline"></ion-icon></a>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    data(){
        return{
            name: "Crypto World",
            url: ""
        }
    }
})
</script>

<style scoped>
    .content{
        display: flex;
        justify-content: center;
        background-color:bisque;
        width: 50%;
        height: 60px;
        margin-left: auto;
        margin-right: auto;
        border-radius: 20px;
        border: 2px solid black;
        
    }
    .welcome {
        font-size: 20px;
        margin-right:10px;
        margin-left: 10px;
        color: black;
    }
    .logo{
        top:15px;
        position: relative;
        color: rgb(108, 156, 199);
    }
</style>