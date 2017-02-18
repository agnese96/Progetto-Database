class UserCtrl {
  constructor($state, userService) {
    this.userService=userService;
    this.logged=userService.isLogged();
    this.info=userService.gUser();
    this.$state=$state;
  }

  logout() {
    console.log("logout");
    this.userService.logout();
    this.$state.go('home');
  }
}

app.component('userInfo', {
  controller: UserCtrl,
  controllerAs: 'user',
  templateUrl: 'App/Shared/Header/User/userInfoView.html'
});
