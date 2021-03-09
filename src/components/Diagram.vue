<template>
  <div class="diagram-editor__wrapper">
    <DiagramRoot
      ref="diagram"
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
      @select-node="$emit('select-node', $event)"
      @deleted-node="$emit('deleted-node', $event)"
      @deleted-link="$emit('deleted-link', $event)"
      @updated-node="$emit('updated-node', $event)"
      @click-port="$emit('click-port', $event)"
      @created-link="$emit('created-link', $event)"
    >
      <template #default="scopedParams">
        <slot name="node" v-bind="scopedParams"/>
      </template>
    </DiagramRoot>
  </div>
</template>
<script>
import DiagramRoot from "./DiagramRoot";
import throttle from 'lodash/throttle';

export default {
  name: "Diagram",

  components: {
    DiagramRoot,
  },

  props: {
    height: {
      type: Number,
      default: 500
    },
    gridSnap: {
      type: Number,
      default: 1
    },
    zoomEnabled: {
      type: Boolean,
      default: true
    },
    nodeColor: {
      type: Function,
      default: () => "#66cc00"
    },
    nodePulseColor: {
      type: Function,
      default: () => '#f00'
    },
    nodePulsable: {
      type: Function,
      default: () => false
    },
    nodeDeletable: {
      type: Function,
      default: () => true
    },
    beforeDeleteNode: {
      type: Function,
      default: () => true
    },
    beforeDeleteLink: {
      type: Function,
      default: () => true
    },
    portDisabled: {
      type: Function,
      default: () => false
    },
    portAvailable: {
      type: Function,
      default: () => true
    },
    pan: {
      type: Boolean,
      default: true
    },
  },

  data() {
    return {
      width: null,
    };
  },

  mounted() {
    window.addEventListener('resize', this.updateWrapperWidth);
    this.updateWrapperWidth();
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateWrapperWidth);
  },

  methods: {
    updateWrapperWidth: throttle(function () {
      const {width} = this.$el.getBoundingClientRect();
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

    updateNode({id, name, value}) {
      this.$refs.diagram.updateNode({id, name, value});
    },

    deleteNode(id) {
      this.$refs.diagram.deleteNode(id);
    },

    deleteLink(id) {
      this.$refs.diagram.deleteLink(id);
    },
  },
};
</script>

