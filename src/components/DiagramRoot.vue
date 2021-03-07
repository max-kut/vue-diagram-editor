<template>
  <SvgPanZoom
    v-if="width > 0"
    :style="{ width: width + 'px', height: height + 'px', border:'1px solid black'}"
    xmlns="http://www.w3.org/2000/svg"
    :zoom-enabled="zoomEnabled"
    :pan-enabled="true"
    :control-icons-enabled="false"
    :fit="true"
    :center="true"
    :viewport-selector="`#diagram-root-${uniqId}`"
    :prevent-mouse-events-default="false"
    :before-pan="beforePan"
  >
    <svg
      :id="`diagram-root-${uniqId}`"
      ref="diagramRoot"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox.camel="'0 0 ' + (width/1.2) + ' ' + (height/1.2)"
      :width="width"
      :height="height"
      preserveAspectRatio="xMinYMin meet"
      class="svg-content"
    >
      <defs>
        <pattern :id="`diagram-small-grid-${uniqId}`" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#ccc" stroke-width="0.5"/>
        </pattern>
        <pattern :id="`diagram-grid-${uniqId}`" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" :fill="`url(#diagram-small-grid-${uniqId})`"/>
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#ccc" stroke-width="1"/>
        </pattern>
      </defs>

      <rect
        ref="grid"
        class="svg-pan-zoom_viewport"
        x="-5000px" y="-5000px"
        width="10000px" height="10000px"
        :fill="`url(#diagram-grid-${uniqId})`"
        @mousedown="clearSelection"
      />

      <g ref="viewPort" x="50" y="50">
        <DiagramLink
          v-for="link in links"
          :id="link.id"
          :key="link.id"
          :link="link"
          :node-start="nodes[link.start_id]"
          :node-end="nodes[link.end_id]"
          :selected="selectedLink === link.id"
          @mousedown="selectLink(link.id)"
        />
        <DiagramNode
          v-for="node in nodes"
          :key="node.id"
          :node="node"
          :color="nodeColor"
          :pulse-color="nodePulseColor"
          :pulsable="nodePulsable"
          :deletable="nodeDeletable"
          :dragging="draggedNode === node.id"
          :selected="selectedNode === node.id"
          :port-disabled="portDisabled"
          :port-available="portAvailable"
          :active-port="activePort"
          :hovered-port="hoveredPort"

          @delete="deleteNode"
          @drag-start="onNodeDragStart"
          @resize-start="onNodeResizeStart"
          @hovered-port="setHoveredPort"
          @active-port="setActivePort"
        >
          <template #default="scopedParams">
            <slot v-bind="scopedParams" :node="node"/>
          </template>
        </DiagramNode>
        <line
          v-if="newLink"
          :x1="newLink.x1"
          :y1="newLink.y1"
          :x2="newLink.x2"
          :y2="newLink.y2"
          style="stroke:rgb(255,0,0);stroke-width:2"
          pointer-events="none"
        />
      </g>
    </svg>
  </SvgPanZoom>
</template>

<script>
import SvgPanZoom from 'vue-svg-pan-zoom';
import DiagramNode from './DiagramNode';
import DiagramLink from './DiagramLink';
import DiagramEditorMixin from '../mixins/DiagramEditorMixin';
import {getAbsoluteXY} from '../helpers';
import {ulid} from "ulid";

export default {
  name: 'DiagramRoot',
  components: {
    DiagramNode,
    DiagramLink,
    SvgPanZoom
  },
  mixins: [DiagramEditorMixin()],
  props: {
    width: {type: Number, default: 0},
    height: {type: Number, required: true},
    gridSnap: {type: Number, required: true},
    zoomEnabled: {type: Boolean, required: true},
    nodeColor: {type: Function, required: true},
    nodePulseColor: {type: Function, required: true},
    nodePulsable: {type: Function, required: true},
    nodeDeletable: {type: Function, required: true},
    beforeDeleteNode: {type: Function, required: true},
    beforeDeleteLink: {type: Function, required: true},
    portDisabled: {type: Function, required: true},
    portAvailable: {type: Function, required: true}
  },
  computed: {
    uniqId() {
      return ulid();
    }
  },
  mounted() {
    document.addEventListener('keydown', this.keyDownHandler);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDownHandler);
  },

  methods: {
    keyDownHandler(e) {
      // delete
      if (e.keyCode === 46) {
        if (this.selectedNode && this.nodeDeletable(this.nodes[this.selectedNode])) {
          this.deleteNode(this.selectedNode);
        }
        if (this.selectedLink) {
          this.deleteLink(this.selectedLink);
        }
      }
      // esc
      if (e.keyCode === 27) {
        this.clearSelection();
      }
    },

    convertXYtoViewPort(x, y) {
      const root = this.$refs.diagramRoot;
      const viewport = this.$refs.viewPort;
      let point = root.createSVGPoint();
      let rootPosition = getAbsoluteXY(root);
      point.x = x - rootPosition.x;
      point.y = y - rootPosition.y;
      let ctm = viewport.getCTM().inverse();
      return point.matrixTransform(ctm);
    },

    onNodeDragStart({node, eX, eY}) {
      const {x, y} = this.convertXYtoViewPort(eX, eY);
      this.dragStart({
        type: 'drag',
        id: node.id,
        offset: {
          x: Math.round(x - node.x),
          y: Math.round(y - node.y)
        }
      });
    },
    onNodeResizeStart({node, eX, eY}) {
      const {x, y} = this.convertXYtoViewPort(eX, eY);
      this.dragStart({
        type: 'resize',
        id: node.id,
        offset: {
          x: -Math.round((node.x + node.width) - x),
          y: -Math.round((node.y + node.height) - y)
        }
      });
    },
    setActivePort(port) {
      this.activePort = port;
    },
    setHoveredPort(port) {
      this.hoveredPort = port;
    },
  }
};
</script>
