class UserCtrl {
  constructor($state, $rootScope, userService) {
    this.userService=userService;
    this.$state=$state;
    this.initUserInfo();
    $rootScope.$on('userChange',()=>{ this.initUserInfo(); });
  }

  initUserInfo() {
    this.logged=this.userService.isLogged();
    this.info=this.userService.gUser();
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
