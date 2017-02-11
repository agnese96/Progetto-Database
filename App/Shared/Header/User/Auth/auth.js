class Register {
  constructor() {
    this.credentials = {
      username: '',
      email: '',
      password: ''
    };
    this.error = '';
  }
  register() {

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
