class UserCtrl {
  constructor(userService) {
    this.userService=userService;
    this.logged=userService.isLogged();
    this.info=userService.gUser();
  }

  logout() {
    console.log("logout");
    this.userService.logout();
  }
}

app.component('userInfo', {
  controller: UserCtrl,
  controllerAs: 'user',
  templateUrl: 'App/Shared/Header/User/userInfoView.html'
});
