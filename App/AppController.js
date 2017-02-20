var app=angular.module("app", ['ngMaterial', 'ngMessages', 'ui.router']);
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
      abstract: true,
      template: '<div ui-view></div>',
      data: {
        restricted: true
      }
    })
    .state('event.create', {
      url: '/c',
      template: "<create-event></create-event>"
    })
    .state('event.show', {
      url: '/s/:eventId/:eventDate',
      templateProvider: function ($stateParams) {
        return "<show-event id='"+$stateParams.eventId+"' date='"+$stateParams.eventDate+"'></show-event>";
      },
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
