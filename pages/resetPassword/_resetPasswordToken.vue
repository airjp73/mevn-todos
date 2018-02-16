<template>
  <div>
    <v-text-field
      type='password'
      label="New Password"
      v-model="newPassword"
      v-on:keyup.enter="submit"
    ></v-text-field>
    <v-text-field
      type='password'
      label="Confirm Password"
      v-model="confirmPassword"
      v-on:keyup.enter="submit"
    ></v-text-field>
    <v-btn v-on:click="submit" flat>Submit</v-btn>
  </div>
</template>

<script>
import axios from 'axios'

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
      var body = {
        resetPasswordToken: this.resetPasswordToken,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      }
      await axios.post('/api/resetPassword', body)
    }
  }
}
</script>
