<template>
  <div class="item">
    <img :src="url" />

    <div class="analysis">
      <vue-typer
        :text="texts"
        :repeat="Infinity"
        :shuffle="true"
        initial-action="typing"
        :pre-type-delay="70"
        :type-delay="70"
        :pre-erase-delay="2000"
        :erase-delay="250"
        erase-style="select-all"
        :erase-on-complete="false"
        caret-animation="blink"
      ></vue-typer>
    </div>

    <div class="extra"></div>
  </div>
</template>

<script>
import { VueTyper } from "vue-typer"

export default {
  name: "preview",
  components: { VueTyper },
  props: {
    data: Object
  },
  data() {
    return {
      states: ["single", "married", "hi", "divorced", "liquid", "selleba"],
      url: "",
      analysis: "",
      id: ""
    }
  },
  computed: {
    // <span> ID : {{ id }} </span><br />
    // <span> AGE : {{ Math.floor(Math.random(1) * 30 + 20) }}</span
    // ><br />
    // <span> STATE : {{ state[Math.floor(Math.random(1) * 6)] }}</span>
    texts() {
      let base = [
        "Arya Stark",
        "Jon Snow",
        "Daenerys Targaryen",
        "Melisandre",
        "Tyrion Lannister"
      ]

      base = [...base, `ID:${this.id}`]
      base = [...base, `ANALYSIS:${this.analysis}`]
      base = [...base, `AGE:${Math.floor(Math.random(1) * 30 + 20)}`]
      base = [...base, `STATE:${this.states[Math.floor(Math.random(1) * 6)]}`]
      base = [
        ...base,
        `RATING:${this.states[Math.floor(Math.random(1) * 1000000)]}`
      ]

      return base
    }
  },
  created() {
    this.url = this.data.data.url
    this.id = this.data.id
    this.analysis = this.data.data.analysis
  },
  watch: {
    data(value) {
      let tmp = Object.assign({}, value)

      this.url = tmp.data.url
      this.id = tmp.id
      this.analysis = tmp.data.analysis
    }
  }
}
</script>

<style lang="scss">
$color: blue;

.vue-typer {
  z-index: 99999;
  font-family: monospace;
}

.vue-typer .custom.char {
  color: #d4d4bd !important ;
  // background-color: #1e1e1e;
}
.vue-typer .custom.char.selected {
  background-color: black;
  color: #d4d4bd;
}

.vue-typer .custom.caret {
  width: 10px;
  background-color: lightgrey;
  color: #d4d4bd;
}

.item {
  width: calc(100% / 4);
  height: calc(100% / 5);
  position: relative;
  border: 2px solid $color;
  box-sizing: border-box;

  .analysis {
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    padding: 5px;
    font-size: 0.8rem;
    background-color: blue;
    color: white;
    font-weight: bold;
  }

  .extra {
    z-index: 9;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    text-align: right;

    span {
      font-size: 0.75rem;
      background: black;
      color: white;
      padding: 4px 2px;
      display: inline-block;
    }
  }

  img {
    -webkit-filter: grayscale(33%); /* Safari 6.0 - 9.0 */
    filter: grayscale(33%);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}
</style>
