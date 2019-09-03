<template>
  <div class="item" :class="{ new: newItem }">
    <img
      :src="url"
      :class="{
        noFilter1: random > 0.5,
        noFilter2: random > 0.75,
        noFilter3: random > 0.85,
        hide: random > 0.95
      }"
    />

    <div class="analysis">
      <countTo
        v-if="random > 0.95"
        :startVal="0"
        :endVal="Math.floor(Math.random() * 99999999)"
        :duration="3000"
      ></countTo>
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
        @typed="random = Math.random()"
      ></vue-typer>
    </div>

    <div class="extra"></div>
  </div>
</template>

<script>
import { VueTyper } from "vue-typer"
import countTo from "vue-count-to"

export default {
  name: "preview",
  components: { VueTyper, countTo },
  props: {
    data: Object,
    newItem: Boolean
  },
  data() {
    return {
      states: ["single", "married", "hi", "divorced", "liquid", "selleba"],
      url: "",
      analysis: "",
      id: "",
      random: Math.random(),

      startVal: 0,
      endVal: Math.floor(Math.random() * 99999999)
    }
  },
  computed: {
    // <span> ID : {{ id }} </span><br />
    // <span> AGE : {{ Math.floor(Math.random(1) * 30 + 20) }}</span
    // ><br />
    // <span> STATE : {{ state[Math.floor(Math.random(1) * 6)] }}</span>
    texts() {
      let base = []

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
      this.random = Math.random()
    }
  }
}
</script>

<style lang="scss">
$color: blue;

.vue-typer {
  z-index: 99999;
  font-family: monospace;
  background-color: blue;
  padding: 5px;
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

  background-color: blue;
  box-sizing: border-box;

  &.new {
    border: 2px solid red;
    background-color: red;

    img {
      opacity: 0.5 !important;
    }
  }

  .analysis {
    text-align: center;
    position: absolute;
    top: 90%;
    left: 0%;
    transform: translate(0%, -50%);
    width: 100%;
    z-index: 1000;
    padding: 5px;
    font-size: 0.8rem;
    color: white;
    font-weight: bold;

    span {
      color: #d4d4bd;
      background-color: blue;
    }
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
    filter: grayscale(33%);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;

    &.noFilter1 {
      filter: grayscale(60%);
    }
    &.noFilter2 {
      filter: grayscale(80%);
    }
    &.noFilter3 {
      filter: grayscale(90%);
    }

    &.hide {
      opacity: 0.4;
    }
  }
}
</style>
