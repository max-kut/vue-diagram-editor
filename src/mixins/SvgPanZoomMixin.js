import svgPanZoom from 'svg-pan-zoom';

export default () => ({
    data: () => ({
        spz: null
    }),
    mounted() {
        this.spz = svgPanZoom(this.$refs.diagramRoot, {
            viewportSelector: this.$refs.viewPort,
            center: false,
            preventMouseEventsDefault: this.preventMouseEventsDefault,
            beforePan: this.beforePan,
            beforeZoom: () => this.zoomEnabled,
        });
    },
    beforeDestroy() {
        if (this.spz) {
            this.spz.destroy();
        }
    },
    methods: {
        enableDblClickZoom() {
            if (this.spz) return this.spz.enableDblClickZoom();
        },
        disableDblClickZoom() {
            if (this.spz) return this.spz.disableDblClickZoom();
        },
        isDblClickZoomEnabled() {
            if (this.spz) return this.spz.isDblClickZoomEnabled();
        },
        enableMouseWheelZoom() {
            if (this.spz) return this.spz.enableMouseWheelZoom();
        },
        disableMouseWheelZoom() {
            if (this.spz) return this.spz.disableMouseWheelZoom();
        },
        isMouseWheelZoomEnabled() {
            if (this.spz) return this.spz.isMouseWheelZoomEnabled();
        },
        resetZoom() {
            if (this.spz) return this.spz.resetZoom();
        },
        updateBBox() {
            if (this.spz) return this.spz.updateBBox();
        },
        fit() {
            if (this.spz) return this.spz.fit();
        },
        contain() {
            if (this.spz) return this.spz.contain();
        },
        center() {
            if (this.spz) return this.spz.center();
        },
        zoomIn() {
          if (this.spz) return this.spz.zoomIn();
        },
        zoomOut() {
          if (this.spz) return this.spz.zoomOut();
        }
    },
});
