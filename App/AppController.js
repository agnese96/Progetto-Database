var app=angular.module("app", ['ngMaterial', 'ngMessages', 'ui.router','mwl.calendar', 'ui.bootstrap']);
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: '/home',
      template: "Ciao Gente!"
    })
    .state('calendar',{
      url: '/calendar',
      templateUrl: 'App/Calendar/CalendarView.html',
      controller: 'calendarController',
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
      url: '/s/:id/:date',
      templateProvider: function ($stateParams) {
        return "<show-event id='"+$stateParams.id+"' date='"+$stateParams.date+"'></show-event>";
      },
      data: {
        owner: true
      }
    })
    .state('deadline', {
      url: '/deadline',
      abstract: true,
      template: '<div ui-view></div>',
      data: {
        restricted: true,
        owner: true
      }
    })
    .state('deadline.create', {
      url: '/c',
      template: '<create-deadline></create-deadline>'
    })
    .state('deadline.show', {
      url: '/s/:id',
      templateProvider: function ($stateParams) {
        return "<show-deadline id='"+$stateParams.id+"'></show-deadline>";
      }
    })
    .state('contacts', {
      url: '/contacts',
      template: '<contacts></contacts>',
      data: {
        restricted: true
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
class AppController {
  constructor($rootScope,$mdToast, $state) {
    $rootScope.$on('errorToast', angular.bind(this, this.errorToast));
    $rootScope.$on('errorToastNR', angular.bind(this, this.errorToastNR));
    this.$mdToast=$mdToast;
    this.$state=$state;
  }
  errorToast(event, message) {
    this.$state.go('home');//TODO: change this to go to calendar state when ready!
    this.$mdToast.showSimple(message);
  }
  errorToastNR(event, message) {
    this.$mdToast.showSimple(message);
  }

}

app.controller('appController',AppController);
