<template>
  <g :id="node.id">
    <rect
      v-if="pulsable(node)"
      class="diagram--editor__pulse"
      :fill="pulseColor(node)"
      :stroke="pulseColor(node)"
      :x="node.x"
      :y="node.y"
      rx="3"
      ry="3"
      :width="node.width"
      :height="node.height"
    />
    <rect
      :fill="color(node)"
      stroke="#000000"
      :stroke-width="selected ? 1 : 0"
      :x="node.x"
      :y="node.y"
      rx="3"
      ry="3"
      :width="node.width"
      :height="node.height"
    />
    <DiagramNodeTitle
      :x="node.x + 2"
      :y="node.y + 2"
      :width="node.size.width - 4"
      :title="node.title"
      :dragging="dragging"
      :deletable="nodeDeletable"
      @mousedown.native.stop="onDragStart"
      @delete="deleteNode"
    />

    <rect
      fill="#ffffff"
      :x="node.x + 2"
      :y="node.y + 20"
      rx="3"
      ry="3"
      :width="node.width - 4"
      :height="node.height - 22"
    />

    <foreignObject
      :x="node.x + 2"
      :y="node.y + 20"
      :width="slotWidth"
      :height="slotHeight"
      :style="node.style"
    >
      <body
        xmlns="http://www.w3.org/1999/xhtml"
        class="diagram-editor__node-body"
      >
        <slot :width="slotWidth" :height="slotHeight" />
      </body>
    </foreignObject>

    <svg
      :x="node.x - 4"
      :y="node.y + node.height - portsHeight - 2"
      :width="node.width + 8"
      :height="portsHeight"
    >
      <DiagramPort
        v-for="([port, portTitle], portIndex) in portsIn"
        :key="node.id + '_in_' + port"
        :id="node.id + '_in_' + port"
        :title="portTitle"
        :width="portIndex + 1 > portsOut.length ? node.width : node.width / 2"
        :x="0"
        :y="portIndex * 18"
        :disabled="portsInDisabled[port]"
        :available="portsInAvailable[port]"
        :hovered="isHoveredPort('in', port)"
        align="start"
        :color="invertColor(node.style.backgroundColor, true)"
        @mousedown="mouseDownPort('in', port, $event)"
        @mouseenter="mouseEnterPort('in', port, $event)"
        @mouseleave="mouseLeavePort('in', port, $event)"
      />

      <DiagramPort
        v-for="([port, portTitle], portIndex) in portsOut"
        :key="node.id + '_out_' + port"
        :id="node.id + '_out_' + port"
        :title="portTitle"
        :width="node.width + 8"
        :x="0"
        :y="portIndex * 18"
        :disabled="portsOutDisabled[port]"
        :available="portsOutAvailable[port]"
        :hovered="isHoveredPort('out', port)"
        align="end"
        :color="invertColor(node.style.backgroundColor, true)"
        @mousedown="mouseDownPort('out', port, $event)"
        @mouseenter="mouseEnterPort('out', port, $event)"
        @mouseleave="mouseLeavePort('out', port, $event)"
      />
    </svg>
    <svg
      width="10"
      height="10"
      :x="node.x + node.width - 10"
      :y="node.y + node.height - 10"
      @mousedown="onResizeStart"
    >
      <path d="M 0,10 10,0 v 10 z" fill="#c4c4c4" style="cursor: nwse-resize" />
    </svg>
  </g>
</template>
<script>
import Node from "../models/Node";
import DiagramPort from "./DiagramPort";
import DiagramNodeTitle from "./DiagramNodeTitle";
import isEqual from "lodash/isEqual";

export default {
  name: "DiagramNode",

  components: {
    DiagramNodeTitle,
    DiagramPort,
  },

  props: {
    node: { type: Node, required: true },
    color: { type: Function, required: true },
    pulseColor: { type: Function, required: true },
    pulsable: { type: Function, required: true },
    portDisabled: { type: Function, required: true },
    portAvailable: { type: Function, required: true },
    deletable: { type: Function, required: true },
    activePort: { type: Object, default: null },
    hoveredPort: { type: Object, default: null },
    selected: { type: Boolean, default: false },
    dragging: { type: Boolean, default: false },
  },

  data() {
    return {
      nodeStrokeWidth: 0,
      titleFillOpacity: 0.25,
    };
  },

  computed: {
    portsIn() {
      return Object.entries(this.node.portsIn);
    },
    portsOut() {
      return Object.entries(this.node.portsOut);
    },
    portsInDisabled() {
      return Object.keys(this.node.portsIn).reduce(
        (acc, port) => ({
          ...acc,
          [port]: this.portDisabled({ id: this.node.id, type: "in", port }),
        }),
        {}
      );
    },
    portsOutDisabled() {
      return Object.keys(this.node.portsOut).reduce(
        (acc, port) => ({
          ...acc,
          [port]: this.portDisabled({ id: this.node.id, type: "out", port }),
        }),
        {}
      );
    },
    portsInAvailable() {
      return Object.keys(this.node.portsIn).reduce(
        (acc, port) => ({
          ...acc,
          [port]: this.activePort && this.isAvailablePort("in", port),
        }),
        {}
      );
    },
    portsOutAvailable() {
      return Object.keys(this.node.portsOut).reduce(
        (acc, port) => ({
          ...acc,
          [port]: this.activePort && this.isAvailablePort("out", port),
        }),
        {}
      );
    },
    portsHeight() {
      return this.node.portsHeight;
    },
    slotWidth() {
      return this.node.size.width - 4;
    },
    slotHeight() {
      // отступ - заготовок - отступ
      return this.node.size.height - 22;
    },
    nodeDeletable() {
      return this.deletable(this.node);
    },
  },

  methods: {
    isAvailablePort(type, port) {
      const data = { id: this.node.id, type, port };
      const activePort = { ...this.activePort };
      const hoveredPort = this.hoveredPort ? { ...this.hoveredPort } : null;
      const hoveredIsActive = hoveredPort
        ? isEqual(activePort, hoveredPort)
        : false;
      return (
        !hoveredIsActive &&
        !isEqual(activePort, data) &&
        this.portAvailable({
          ...data,
          activePort: { ...this.activePort },
        })
      );
    },

    deleteNode() {
      this.$emit("delete", this.node.id);
    },

    onDragStart(e) {
      this.$emit("drag-start", {
        node: this.node,
        eX: e.x,
        eY: e.y,
      });
    },
    onResizeStart(e) {
      this.$emit("resize-start", {
        node: this.node,
        eX: e.x,
        eY: e.y,
      });
    },

    isHoveredPort(type, port) {
      return (
        this.hoveredPort &&
        this.node.id === this.hoveredPort.id &&
        port === this.hoveredPort.port &&
        type === this.hoveredPort.type
      );
    },

    mouseDownPort(type, port) {
      const portIsDisabled =
        type === "in"
          ? this.portsInDisabled[port]
          : this.portsOutDisabled[port];
      if (!portIsDisabled) {
        this.$emit("active-port", {
          id: this.node.id,
          port: port,
          type: type,
        });
      }
    },

    mouseEnterPort(type, port) {
      this.$emit("hovered-port", {
        id: this.node.id,
        port: port,
        type: type,
      });
    },

    mouseLeavePort() {
      this.$emit("hovered-port", null);
    },

    invertColor(hex, bw) {
      if (hex.indexOf("#") === 0) {
        hex = hex.slice(1);
      }
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length !== 6) {
        throw new Error("Invalid HEX color.");
      }
      let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
      if (bw) {
        return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
      }
      r = (255 - r).toString(16);
      g = (255 - g).toString(16);
      b = (255 - b).toString(16);
      return "#" + r + g + b;
    },
  },
};
</script>
