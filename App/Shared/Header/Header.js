app.controller('HeaderCtrl', function ($scope) {
  $scope.user={
    name:"Utente",
    photo:"Assets/Img/default.png"
  };
});



app.directive('myHeader', function() {
  return {
    scope: true,
    controller: 'HeaderCtrl',
    //controllerAs: 'head',
    templateUrl: 'App/Shared/Header/headerTemplate.html'
  }
});
