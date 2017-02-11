class headerCtrl {
  constructor() {

  }
}
app.controller('headerCtrl',headerCtrl)
app.directive('myHeader', function() {
  return {
    scope: true,
    controller: 'headerCtrl',
    controllerAs: 'head',
    templateUrl: 'App/Shared/Header/headerTemplate.html'
  }
});
