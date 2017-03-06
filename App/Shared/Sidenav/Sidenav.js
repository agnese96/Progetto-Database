class Sidenav {
  constructor($mdSidenav, $state, $rootScope, userService) {
    this.handler=$mdSidenav;
    this.$state=$state;
    this.userService=userService;
    this.logged=this.userService.isLogged();
    $rootScope.$on('userChange',()=>{ this.logged=this.userService.isLogged(); });
  }
  goTo(destination) {
    this.close();
    this.$state.go(destination);
  }
  close() {
    this.handler('left').toggle();
  }
  logout() {
    this.userService.logout();
    this.close();
    this.$state.go('home');
  }
}

app.component('mySidenav', {
  templateUrl: 'App/Shared/Sidenav/SidenavView.html',
  controllerAs: 'Sidenav',
  controller: Sidenav
});
