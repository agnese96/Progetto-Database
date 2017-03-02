class UserService {
  constructor($http, $window, $rootScope) {
    console.log('costruttore userService');
    this.$http=$http;
    this.$window=$window;
    this.$rootScope=$rootScope;

    this.name=this.$window.localStorage.getItem('name');
    this.photo=this.$window.localStorage.getItem('photo');
    this.email=this.$window.localStorage.getItem('email');
    this.token=this.$window.localStorage.getItem('token');
    if(this.token)
      this.logged=true;
    else
      this.logged=false;
    console.log(this.token);
  }

  updateLocalStorage(token, email, photo, name) {
    this.$window.localStorage.setItem('token', token);
    this.$window.localStorage.setItem('email', email);
    this.$window.localStorage.setItem('photo', photo);
    this.$window.localStorage.setItem('name', name);
    //this.$http.defaults.headers.common['Authentication'] = 'Bearer: ' + token;
    this.$rootScope.$broadcast('userChange');//emit an event so that the other controllers can update their info.
  }

  successAuth(res) {
    this.email=res.email;
    this.logged=true;
    this.photo=res.photo;
    this.token=res.token;
    this.name=res.name;
    this.updateLocalStorage(res.token, res.email, res.photo, this.name);
  }

  login(credentials, callback){
    return this.$http({
      method  : 'POST',
      url     : 'server/login.php',
      data    : $.param(credentials),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success( angular.bind(this, function (res){
      if(res.token) {
        this.successAuth(res);
        callback(true);
      }else {
        callback(res);
      }
    }));
  }

  logout() {
    console.log('userService logout');
    this.$window.localStorage.removeItem('token');
    this.$window.localStorage.removeItem('email');
    this.$window.localStorage.removeItem('photo');
    //this.$http.defaults.headers.common['Authentication'] = '';
    this.logged=false;
    this.$rootScope.$emit('userChange');//emit an event so that the other controllers can update their info.
  }

  isLogged() { return this.logged; }
  gUser()    { return { email: this.email, photo: this.photo, name:this.name }; }
  gMail()    { return this.email; }
  gToken()   { return this.token; }
}

app.service('userService', UserService);
