class Settings {
  constructor ($q, $state, HttpService) {
    this.Setting = {

    }
  this.$state=$state;
  this.HttpService=HttpService;
  this.$rootScope=$rootScope;
  }
submit(){
    this.HttpService.newPostRequest(this.Settings, 'EditUtentiInfo.php', angular.bind(this, this.callback));
  }
  callback(err, res) {
    if(err)
      console.error(err);
    else {
      console.log(res);
      this.$rootScope.$broadcast('newSettings');
      this.$state.go('settings.show', {id: res.Email });
    }
  }
}

app.component('updateUtentInfo', {
  controller: Settings,
  controllerAs: 'Update',
  templateUrl: 'App/Shared/Sidenav/Services/Settings/SettingsView.html'
}
