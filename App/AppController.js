var app=angular.module("app", ['ngMaterial', 'ui.router']);
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: '/home',
      template: "Ciao Gente!"
    })
    .state('calendar',{
      url: '/calendar',
      data: {
        restricted: true
      }
    })
    .state('calendar.month',{
      url: '/m',
      templateUrl: 'Calendar/Month/calendarView.html'
    })
    .state('event', {
      url: '/event',
      data: {
        restricted: true
      }
    })
    .state('event.create', {
      url: '/create',
      template: "<create-event></create-event>"
    })
    .state('event.show', {
      url: '/show/:eventId/:eventDate',
      templateUrl: 'Event/Show/ShowEventView.html',
      data: {
        owner: true
      }
    })

})
  .run(function ($rootScope, $state, userService) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      if(toState.data && toState.data.restricted && !userService.isLogged()){
        event.preventDefault();
        $state.go('home');
        console.log(toState);
        $rootScope.$broadcast('loginRequired', toState.name);
      }

    });
  });
