class Sidenav {
  constructor($mdSidenav, $state, userService) {
    this.handler=$mdSidenav;
    this.$state=$state;
    this.userService=userService;
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
