class HeaderCtrl {
  constructor($rootScope, $mdSidenav, userService) {
    this.userService=userService;
    this.$mdSidenav=$mdSidenav;
    this.logged=userService.isLogged();
    $rootScope.$on('userChange', angular.bind(this, this.updateUser));//add listener for changes in userService
  }
  updateUser() {
    this.logged=this.userService.isLogged();
  }
  toggleSidenav() {
    this.$mdSidenav('left').toggle();
  }
}

app.component('myHeader', {
  controller: HeaderCtrl,
  controllerAs: 'head',
  templateUrl: 'App/Shared/Header/headerTemplate.html'
});
