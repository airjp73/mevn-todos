<template>
  <div>
    <v-text-field
      label="New Password"
      v-model="newPassword"
      v-on:keyup.enter="submit"
    ></v-text-field>
    <v-text-field
      label="Confirm Password"
      v-model="confirmPassword"
      v-on:keyup.enter="submit"
    ></v-text-field>
    <v-btn v-on:click="submit" flat>Submit</v-btn>
  </div>
</template>

<script>

export default {
  asyncData: ({params}) => {
    return {
      resetPasswordToken: params.resetPasswordToken,
      newPassword: "",
      confirmPassword: ""
    }
  },
  methods: {
    async submit() {
      await axios.post('api/resetPassword', body)
    }
  }
}
</script>
