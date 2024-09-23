<template>
  <div id="header">
    <div class="content">
        <a href="" class="logo"><ion-icon size="large" name="diamond-outline"></ion-icon></a>
        <p class="welcome">Welcome To {{ name }}</p>
        <a href="" class="logo"><ion-icon size="large" name="diamond-outline"></ion-icon></a>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            name: "Crypto World"
        }
    }
}
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
    }
</style>