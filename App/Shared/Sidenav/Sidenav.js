class Sidenav {
  constructor($mdSidenav) {
    this.handler=$mdSidenav;
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
