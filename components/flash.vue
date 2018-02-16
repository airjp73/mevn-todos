<template>
  <div>
    <p>
      Message:
    </p>
    <p>
      <!--<slot name="message"></slot>-->
      {{ message }}
    </p>
  </div>
</template>

<script>
  export default {
    props: ['message']
  }
</script>
