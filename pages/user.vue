<template>
  <div>
    <p>Todos!</p>
    <ul>
      <li v-for="todo in todos">
        {{todo}}
      </li>
    </ul>
  </div>
</template>

<script>
export default({
  middleware: 'isLoggedIn',
  asyncData(context) {
    var data = context.req.user.todos
    return {todos: data}
  }
})
</script>
