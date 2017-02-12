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
    }).success(angular.bind(this, function(data) { //si usa angular bind così che il this della classe si mantiene anche nella funzione interna.
       console.log(data);

       if (!data.success) {
         // if not successful, bind errors to error variables
         this.error=data.error;
       } else {
         //azzeriamo l'errore
         this.error='';
         //TODO: aggiungere login automatico dopo registrazione.

         //chiude il dialog
         this.done();
       }
     }));

  }
}
//creiamo il componente register, indicando template, riferimento di done e controller e namespace del controller (controllerAs)
app.component('register', {
  templateUrl: 'App/Shared/Header/User/Auth/registerView.html',
  bindings: {
    done: '&?'  //ci sarà un attributo done nel tag del componente register dove passiamo la funzione che sarà eseguita al termine della registrazione
  },
  controllerAs: 'register', //nome con cui riferirsi alle variabili e i metodi del controller all'interno del template del componente
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
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia
  }

  open(event) {
    this.$mdDialog.show({
      controller($mdDialog) {
        //scorciatoia per creare una funzione.
        this.close = () => {
          $mdDialog.hide();
        }
      },
      controllerAs: 'dialog',
      templateUrl: 'App/Shared/Header/User/Auth/dialogView.html',
      targetEvent: event,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs') //il dialog sarà a fullscreen nelle dimensioni small e xsmall
    });
  }
}
app.component('authButton', {
  controllerAs:'authButton',
  templateUrl: 'App/Shared/Header/User/Auth/authButtonView.html',
  controller: AuthButton
});
