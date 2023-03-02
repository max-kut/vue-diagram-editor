<template>
  <div>
    <VueDiagramEditor
      ref="diagram"
      :node-color="nodeColor"
      :node-pulsable="nodePulsable"
    >
      <pre slot="node" slot-scope="{ node }">{{ format(node) }}</pre>
    </VueDiagramEditor>

    <div class="d-flex">
      <button class="btn btn-secondary m-1" @click="$refs.diagram.resetZoom()">
        resetZoom
      </button>
      <button class="btn btn-secondary m-1" @click="$refs.diagram.fit()">
        fit
      </button>
      <button class="btn btn-secondary m-1" @click="$refs.diagram.contain()">
        contain
      </button>
      <button class="btn btn-secondary m-1" @click="$refs.diagram.center()">
        center
      </button>
    </div>
  </div>
</template>

<script>
import VueDiagramEditor from "../../src";

export default {
  name: "SimpleExample",
  components: {
    VueDiagramEditor,
  },
  data: () => ({
    nodes: {
      "node-1": {
        id: "node-1",
        title: "My node 1",
        size: {
          width: 200,
          height: 220,
        },
        portsOut: {
          default: "out port default",
        },
      },
      "node-2": {
        id: "node-2",
        title: "My node 2",
        size: {
          width: 200,
          height: 220,
        },
        coordinates: {
          x: 280,
          y: 100,
        },
        portsIn: {
          default: "in port",
        },
      },
    },
    links: {
      "link-1": {
        id: "link-1",
        start_id: "node-1",
        start_port: "default",
        end_id: "node-2",
        end_port: "default",
      },
    },
  }),
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$refs.diagram.setModel({
        nodes: this.nodes,
        links: this.links,
      });
    },

    format(node) {
      return JSON.stringify(node, null, 2);
    },

    nodeColor(node) {
      if (node.coordinates.x > 200) {
        return "#0f0";
      }
      if (node.coordinates.y > 200) {
        return "#f00";
      }

      return "#00f";
    },

    nodePulsable(node) {
      return node.coordinates.y > 200;
    },
  },
};
</script>

<style scoped>
pre {
  line-height: 1;
  font-size: 10px;
  padding: 5px;
}
</style>
