<template>
  <div id="app">
    <div id="login" v-if="!auth"></div>
    <div v-if="auth" class="gallery">
      <img v-for="item in faces" :key="item.id" :src="item.url" />
    </div>
  </div>
</template>

<script>
import { app, db, firebase } from "./firebase.js"
import * as firebaseui from "firebaseui"

export default {
  name: "app",
  components: {},
  data() {
    return {
      auth: false,
      faces: []
    }
  },
  created() {
    const uiConfig = {
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          this.auth = true

          db.collection("faces").onSnapshot(querySnapshot => {
            let tmp = []
            querySnapshot.forEach(doc => {
              tmp.push(doc.data())
            })
            this.faces = tmp
          })

          return false
        }
      }
    }

    const login = new firebaseui.auth.AuthUI(firebase.auth())

    login.start("#login", uiConfig)
  },
  mounted() {}
}
</script>

<style lang="scss">
@import "@/scss/login.scss";

body,
html {
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
}

.gallery {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 3fr);

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
