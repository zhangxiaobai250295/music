<template>
  <div id="app">
    <router-view/>
    <Player></Player>
  </div>
</template>

<script>
  import Player from './components/player';
  import eruda from 'eruda';

  export default {
    name: 'app',
    components: {
      Player
    },
    created() {
      const el = document.createElement('div');
      document.body.appendChild(el);
      eruda.init({
        container: el,
        tool: ['console', 'elements']
      });
    }
  };
</script>
<style lang="less">

</style>
