export default function (context) {
  console.log('[Middleware] Check Auth');
  if (!context.store.getters.isAuthenticated) {
    context.redirect("/user/login");
  }
}
