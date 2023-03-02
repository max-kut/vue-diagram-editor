<template>
  <svg
    :x="x"
    :y="y"
    :width="width"
    height="16"
    :style="{ cursor: dragging ? 'grabbing' : 'grab' }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <rect
      fill="#000"
      :fill-opacity="titleFillOpacity"
      x="0"
      y="0"
      rx="3"
      ry="3"
      :width="width"
      height="16"
    />
    <svg x="0" y="0" :width="deletable ? width - 17 : width" height="16">
      <text x="4" y="12" font-size="10" font-weight="bold" fill="#fff">
        {{ title }}
      </text>
    </svg>

    <svg
      v-if="deletable"
      :x="width - 14"
      y="2"
      width="14"
      height="14"
      class="diagram-editor__delete"
      @click="$emit('delete')"
    >
      <rect x="0" y="0" width="12" height="12" rx="2" ry="2"/>
      <line :x1="2" :y1="2" :x2="10" :y2="10"/>
      <line :x1="10" :y1="2" :x2="2" :y2="10"/>
    </svg>
  </svg>
</template>

<script>
export default {
  name: "DiagramNodeTitle",
  props: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    deletable: {
      type: Boolean,
      default: true,
    },
    dragging: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    hover: false,
  }),
  computed: {
    titleFillOpacity() {
      return this.hover ? 0.7 : 0.5;
    },
  },
};
</script>
