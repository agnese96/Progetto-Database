class HeaderCtrl {
  constructor($rootScope,userService) {
    this.userService=userService;
    this.logged=userService.isLogged();
    $rootScope.$on('userChange', angular.bind(this, this.updateUser));//add listener for changes in userService
  }
  updateUser(){
    this.logged=this.userService.isLogged();
  }
}

app.component('myHeader', {
  controller: HeaderCtrl,
  controllerAs: 'head',
  templateUrl: 'App/Shared/Header/headerTemplate.html'
});
