class UserCtrl {
  constructor() {
    this.name="Utente";
    this.photo="Assets/Img/default.png";
    this.logged=true;
  }

  logout() {
    console.log("logout");
    this.name="";
    this.photo="";
    this.logged=false;
  }

  login() {
    this.name="Agnese";
    this.photo="Assets/Img/default.png";
    this.logged=true;
  }
}

app.component('userInfo', {
  controller: UserCtrl,
  controllerAs: 'user',
  templateUrl: 'App/Shared/Header/User/userInfoView.html'
});
