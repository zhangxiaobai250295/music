<template>
  <div ref="scrollWrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  export default {
    name: 'scroll',
    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    methods: {
      initScroll() {
        if (!this.$refs.scrollWrapper) return;
        this.scroll = new BScroll(this.$refs.scrollWrapper);
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initScroll();
      });
    },
    watch: {
      data(val) {
        this.$nextTick(() => {
          this.refresh();
        });
      }
    }
  };
</script>

<style lang="less" scoped>

</style>
