<template>
  <div>
    <div v-if="accountName">
      <h2>Welcome {{accountName}}!</h2>
      <button>Log Out</button>
    </div>
    <div v-else>
      <h2>Please Log In</h2>
      <login></login>
    </div>
  </div>
</template>

<script>
export default {
  name: "sidebar",
  props: [
    "accountName"
  ]
}
</script>
