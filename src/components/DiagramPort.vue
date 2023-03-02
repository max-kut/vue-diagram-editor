<template functional>
  <svg :x="props.x" :y="props.y" :width="props.width" height="16">
    <rect
      :fill="$options.fill(props.available, props.hovered)"
      :x="props.align === 'start' ? 0 : props.width - 10"
      y="0"
      rx="5"
      ry="5"
      :cursor="props.disabled ? 'default' : 'pointer'"
      width="10"
      height="10"
      v-on="listeners"
    />
    <text
      :x="props.align === 'start' ? 12 : props.width - 12"
      y="9"
      font-size="8pt"
      :style="{ fill: `${props.color}` }"
      :text-anchor="props.align"
    >
      {{ props.title }}
    </text>
  </svg>
</template>

<script>
export default {
  fill(available, hovered) {
    if (available) {
      return hovered ? "#04ff00" : "#f00";
    }
    return hovered ? "#888" : "#444";
  },
};
</script>
