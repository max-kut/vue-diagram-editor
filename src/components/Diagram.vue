<template>
  <div class="diagram-editor__wrapper">
    <DiagramRoot
      ref="diagram"
      :bg-pattern="bgPattern"
      :width="width"
      :height="height"
      :grid-snap="gridSnap"
      :zoom-enabled="zoomEnabled"
      :node-color="nodeColor"
      :node-pulsable="nodePulsable"
      :node-deletable="nodeDeletable"
      :node-pulse-color="nodePulseColor"
      :before-delete-node="beforeDeleteNode"
      :before-delete-link="beforeDeleteLink"
      :port-disabled="portDisabled"
      :port-available="portAvailable"
      :pan="pan"
      :prevent-mouse-events-default="preventMouseEventsDefault"
      @select-node="$emit('select-node', $event)"
      @deleted-node="$emit('deleted-node', $event)"
      @updated-node="$emit('updated-node', $event)"
      @created-link="$emit('created-link', $event)"
      @deleted-link="$emit('deleted-link', $event)"
      @select-link="$emit('select-link', $event)"
      @click-port="$emit('click-port', $event)"
      @clear-selection="$emit('clear-selection', $event)"
    >
      <template #default="scopedParams">
        <slot name="node" v-bind="scopedParams" />
      </template>
    </DiagramRoot>
  </div>
</template>
<script>
import DiagramRoot from "./DiagramRoot";
import throttle from "lodash/throttle";

export default {
  name: "Diagram",

  components: {
    DiagramRoot,
  },

  props: {
    bgPattern:{
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 500,
    },
    gridSnap: {
      type: Number,
      default: 1,
    },
    zoomEnabled: {
      type: Boolean,
      default: true,
    },
    nodeColor: {
      type: Function,
      default: () => "#66cc00",
    },
    nodePulseColor: {
      type: Function,
      default: () => "#f00",
    },
    nodePulsable: {
      type: Function,
      default: () => false,
    },
    nodeDeletable: {
      type: Function,
      default: () => true,
    },
    beforeDeleteNode: {
      type: Function,
      default: () => true,
    },
    beforeDeleteLink: {
      type: Function,
      default: () => true,
    },
    portDisabled: {
      type: Function,
      default: () => false,
    },
    portAvailable: {
      type: Function,
      default: () => true,
    },
    pan: {
      type: Boolean,
      default: true,
    },
    preventMouseEventsDefault: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      width: null,
    };
  },

  mounted() {
    window.addEventListener("resize", this.updateWrapperWidth);
    this.updateWrapperWidth();
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.updateWrapperWidth);
  },

  methods: {
    updateWrapperWidth: throttle(function () {
      const { width } = this.$el.getBoundingClientRect();
      this.width = width;
    }, 100),

    setModel(model) {
      this.$refs.diagram.setModel(model);
    },

    serialize() {
      return this.$refs.diagram.serialize();
    },

    addNode(node) {
      this.$refs.diagram.addNode(node);
    },

    addLink(link) {
      this.$refs.diagram.addLink(link);
    },

    updateNode({ id, name, value }) {
      this.$refs.diagram.updateNode({ id, name, value });
    },

    deleteNode(id) {
      this.$refs.diagram.deleteNode(id);
    },

    deleteLink(id) {
      this.$refs.diagram.deleteLink(id);
    },

    enableDblClickZoom() {
      return this.$refs.diagram.enableDblClickZoom();
    },
    disableDblClickZoom() {
      return this.$refs.diagram.disableDblClickZoom();
    },
    isDblClickZoomEnabled() {
      return this.$refs.diagram.isDblClickZoomEnabled();
    },
    enableMouseWheelZoom() {
      return this.$refs.diagram.enableMouseWheelZoom();
    },
    disableMouseWheelZoom() {
      return this.$refs.diagram.disableMouseWheelZoom();
    },
    isMouseWheelZoomEnabled() {
      return this.$refs.diagram.isMouseWheelZoomEnabled();
    },
    resetZoom() {
      return this.$refs.diagram.resetZoom();
    },
    updateBBox() {
      return this.$refs.diagram.updateBBox();
    },
    fit() {
      return this.$refs.diagram.fit();
    },
    contain() {
      return this.$refs.diagram.contain();
    },
    center() {
      return this.$refs.diagram.center();
    },
    zoomIn() {
      return this.$refs.diagram.zoomIn();
    },
    zoomOut() {
      return this.$refs.diagram.zoomOut();
    },
  },
};
</script>
