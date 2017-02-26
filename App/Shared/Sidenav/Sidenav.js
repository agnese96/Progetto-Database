class Sidenav {
  constructor($mdSidenav, $state) {
    this.handler=$mdSidenav;
    this.$state=$state;
  }
  goTo(destination) {
    this.close();
    this.$state.go(destination);
  }
  close() {
    this.handler('left').toggle();
  }
}

app.component('mySidenav', {
  templateUrl: 'App/Shared/Sidenav/SidenavView.html',
  controllerAs: 'Sidenav',
  controller: Sidenav
});
