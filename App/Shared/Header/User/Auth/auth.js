class Register {
  constructor($http) {

    this.credentials = {
      nome: '',
      cognome: '',
      email: '',
      password: ''
    };
    this.error ='';
    this.$http=$http;
  }
  register($scope) {

    //checkInput();
    this.$http({
      method  : 'POST',
      url     : 'server/register.php',
      data    : $.param(this.credentials),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(angular.bind(this, function(data) {
       console.log(data);

       if (!data.success) {
         // if not successful, bind errors to error variables
         this.error=data.error;
       } else {
         // if successful, bind success message to message
         this.error='';
         //TODO: aggiungere login automatico dopo registrazione.
         this.done();
       }
     }));

  }
}

app.component('register', {
  templateUrl: 'App/Shared/Header/User/Auth/registerView.html',
  bindings: {
    done: '&?'
  },
  controllerAs: 'register',
  controller:Register
});


class Login {
  constructor() {
    this.credentials={
      email:'',
      password:''
    };
    this.error='';
  }
  login() {

  }
}
app.component('login', {
  templateUrl: 'App/Shared/Header/User/Auth/loginView.html',
  bindings: {
    done: '&?'
  },
  controllerAs: 'login',
  controller: Login
});

class AuthButton {
  constructor($mdDialog, $mdMedia) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia
  }

  open(event) {
    this.$mdDialog.show({
      controller($mdDialog) {
        'ngInject';

        this.close = () => {
          $mdDialog.hide();
        }
      },
      controllerAs: 'dialog',
      templateUrl: 'App/Shared/Header/User/Auth/dialogView.html',
      targetEvent: event,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
    });
  }
}
app.controller('authButton', AuthButton);
app.directive('authButton', function () {
  return{
    scope: true,
    controller:'authButton',
    controllerAs:'authButton',
    templateUrl: 'App/Shared/Header/User/Auth/authButtonView.html'
  }
});
