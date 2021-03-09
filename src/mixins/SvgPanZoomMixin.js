import svgPanZoom from 'svg-pan-zoom';

export default () => ({
  data: () => ({
    spz: null
  }),
  mounted() {
    this.spz = svgPanZoom(this.$refs.diagramRoot, {
      viewportSelector: this.$refs.viewPort,
      center: false,
      beforePan: this.beforePan,
      beforeZoom: () => this.zoomEnabled,
    });
  }
});
