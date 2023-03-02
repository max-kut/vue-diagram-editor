import Vue from "vue";
import Node from "../models/Node";
import Link from "../models/Link";
import Coordinates from "../models/Coordinates";
import { snapToGrip } from "../helpers";
import Size from "../models/Size";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";

export default () => ({
  data: () => ({
    nodes: {},
    links: {},
    draggedNode: null,
    resizedNode: null,
    selectedNode: null,
    selectedLink: null,
    initialCursorOffset: { x: 0, y: 0 },
    activePort: null,
    hoveredPort: null,
    nodeCoordinatesBeforeDrag: { x: 0, y: 0 },
    nodeSizeBeforeResize: { width: 0, height: 0 },
    currentCursorPos: null,
  }),

  computed: {
    newLink() {
      if (!this.activePort || this.currentCursorPos === null) return null;
      const { id, type, port } = this.activePort;
      const startCoordinates = this.nodes[id].getPortCoordinates(type, port);

      return {
        x1: startCoordinates.x,
        y1: startCoordinates.y,
        x2: this.currentCursorPos.x,
        y2: this.currentCursorPos.y,
      };
    },
  },

  watch: {
    selectedNode(id) {
      if (id) {
        this.$emit("select-node", id);
      }
    },
    draggedNode(id) {
      if (id) {
        const node = this.nodes[id];
        this.nodeCoordinatesBeforeDrag = { ...node.coordinates };
      }
      this.toggleMoveEventListener(id !== null);
    },
    resizedNode(id) {
      if (id) {
        const node = this.nodes[id];
        this.nodeSizeBeforeResize = { ...node.size };
      }
      this.toggleMoveEventListener(id !== null);
    },
    activePort(v) {
      this.toggleMoveEventListener(v !== null);
    },
  },

  methods: {
    setModel(model) {
      this.nodes = Object.values(model.nodes || []).reduce((carry, node) => {
        const nodeModel = new Node(node);
        return {
          ...carry,
          [nodeModel.id]: nodeModel,
        };
      }, {});
      this.links = Object.values(model.links || []).reduce((carry, link) => {
        const linkModel = new Link(link);
        return {
          ...carry,
          [linkModel.id]: linkModel,
        };
      }, {});
    },

    beforePan() {
      return (
        this.pan && !(this.draggedNode || this.resizedNode || this.activePort)
      );
    },

    addNode(node) {
      const nodeModel = new Node(node);
      Vue.set(this.nodes, nodeModel.id, nodeModel);
    },

    addLink(link) {
      const linkModel = new Link(link);
      Vue.set(this.links, linkModel.id, linkModel);
    },

    deleteNode(id) {
      const node = this.nodes[id];
      if (this.beforeDeleteNode(node) === false) return;
      Vue.delete(this.nodes, id);
      for (let linkId in this.links)
        if (this.links.hasOwnProperty(linkId)) {
          const link = this.links[linkId];
          if (link.start_id === id || link.end_id === id) {
            Vue.delete(this.links, linkId);
          }
        }
      this.$emit("deleted-node", id);
    },

    deleteLink(id) {
      if (this.beforeDeleteLink(this.links[id]) === false) return;

      Vue.delete(this.links, id);
      this.$emit("deleted-link", id);
    },

    selectLink(id) {
      this.selectedLink = id;
      this.$emit("select-link", id);
    },

    clearSelection() {
      let data = {};
      if (this.selectedNode) {
        data.id = this.selectedNode;
        data.type = "node";
        this.selectedNode = null;
      }
      if (this.selectedLink) {
        data.id = this.selectedLink;
        data.type = "link";
        this.selectedLink = null;
      }
      this.$emit("clear-selection", data);
    },

    toggleMoveEventListener(enable) {
      if (enable) {
        document.body.addEventListener("mousemove", this.mouseMove);
        document.body.addEventListener("mouseup", this.mouseUp);
      } else {
        document.body.removeEventListener("mousemove", this.mouseMove);
        document.body.removeEventListener("mouseup", this.mouseUp);
      }
    },

    mouseMove(pos) {
      if (this.draggedNode || this.resizedNode) {
        this.dragMove({
          gridSnap: this.gridSnap,
          x: pos.x,
          y: pos.y,
        });
      } else if (this.activePort) {
        const { x, y } = this.convertXYtoViewPort(pos.pageX, pos.pageY);
        this.currentCursorPos = { x, y };
      }
    },

    mouseUp() {
      if (this.draggedNode || this.resizedNode) {
        const id = this.draggedNode || this.resizedNode;

        const node = id ? this.nodes[id] : null;
        const isDragged = !!this.draggedNode;
        const hasChanges =
          (this.draggedNode &&
            !isEqual(
              { ...node.coordinates },
              { ...this.nodeCoordinatesBeforeDrag }
            )) ||
          (this.resizedNode &&
            !isEqual({ ...node.size }, { ...this.nodeSizeBeforeResize }));

        this.dragEnd();

        if (hasChanges) {
          this.$emit("updated-node", node);
        } else if (isDragged) {
          this.selectedNode = id;
        }
      } else if (this.activePort) {
        const activePort = { ...this.activePort };
        if (this.hoveredPort) {
          const hoveredPort = { ...this.hoveredPort };
          if (isEqual(activePort, hoveredPort)) {
            this.$emit("click-port", activePort);
          } else {
            if (this.portAvailable({ ...hoveredPort, activePort })) {
              const link = new Link({
                start_id: activePort.id,
                start_port: activePort.port,
                end_id: hoveredPort.id,
                end_port: hoveredPort.port,
              });
              Vue.set(this.links, link.id, link);
              this.$emit("created-link", link);
            }
          }
        }

        this.activePort = null;
        this.currentCursorPos = null;
      }
    },

    serialize() {
      return {
        nodes: Object.values(this.nodes).map((node) => cloneDeep(node)),
        links: Object.values(this.links).map((link) => cloneDeep(link)),
      };
    },

    dragStart({ id, offset, type }) {
      if (type === "drag") {
        this.draggedNode = id;
        this.resizedNode = null;
      } else if (type === "resize") {
        this.draggedNode = null;
        this.resizedNode = id;
      }
      this.initialCursorOffset = offset;
    },

    dragMove({ gridSnap, x, y }) {
      const getCoords = (X, Y) => {
        let { x, y } = this.convertXYtoViewPort(X, Y);
        x = snapToGrip(x, gridSnap) - gridSnap / 2;
        y = snapToGrip(y, gridSnap);
        x -= this.initialCursorOffset.x;
        y -= this.initialCursorOffset.y;
        return { x, y };
      };
      if (this.draggedNode) {
        this.updateNode({
          id: this.draggedNode,
          name: "coordinates",
          value: new Coordinates(getCoords(x, y)),
        });
      }
      if (this.resizedNode) {
        const node = this.nodes[this.resizedNode];
        const coords = getCoords(x, y);

        const size = new Size({
          width: Math.abs(coords.x - node.coordinates.x),
          height: Math.abs(coords.y - node.coordinates.y),
        });

        if (size.width < 30) {
          size.width = 30;
        }
        if (size.height < 30) {
          size.height = 30;
        }

        this.updateNode({
          id: this.resizedNode,
          name: "size",
          value: size,
        });
      }
    },

    dragEnd() {
      this.draggedNode = null;
      this.resizedNode = null;
    },

    updateNode({ id, name, value }) {
      Vue.set(this.nodes[id], name, Node.prepareProp(name, value));
    },
  },
});
