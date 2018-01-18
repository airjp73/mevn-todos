export default (context) => {
  if (!context.req.isAuthenticated())
    context.redirect('/')
}
