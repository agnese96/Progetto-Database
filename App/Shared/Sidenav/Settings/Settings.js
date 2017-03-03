class Settings {
  constructor ($rootScope, userService, HttpService) {
    this.$rootScope=$rootScope;
    this.userService=userService;
    this.HttpService=HttpService;
    this.getSettings();
  }
  getSettings(){
    this.HttpService.newPostRequest({},'GetSettings.php',(err,res)=>{
      if(err)
        console.error(err);
      else {
        this.Settings=res;
        if(this.Settings.OraInizioGiorno)
          this.Settings.OraInizioGiorno = moment(this.Settings.OraInizioGiorno,'H:m:s').toDate();
      }
    });
  }
  submitPersonal() {
    this.loading=true;
    let data={
      Nome: this.Settings.Nome,
      Cognome: this.Settings.Cognome,
      DataNascita: this.Settings.DataNascita,
      City: this.Settings.City,
      Professione: this.Settings.Professione
    };
    this.HttpService.newPostRequest(data,'SetPersonalSettings.php',(err,res)=>{
      this.loading=false;
      if(err)
        this.$rootScope.$broadcast('errorToast','Impossibile applicare le impostazioni');
      else{
        this.userService.updateName(this.Settings.Nome+" "+this.Settings.Cognome);
      }
    });
  }
  changePhoto() {
    this.loading=true;
    this.HttpService.fileUpload(this.Settings.FotoProfilo,'ChangePhoto.php',(err,res)=>{
      this.loading=false;
      if(err)
        this.$rootScope.$broadcast('errorToast','Impossibile modificare la foto profilo');
      else{
        console.log(res);
        this.userService.updatePhoto(res.photo);
      }
    });
  }
  submitPreferences() {
    this.loading=true;
    let data={
      VistaCalendario: this.Settings.VistaCalendario,
      OraInizioGiorno: this.Settings.OraInizioGiorno
    };
    this.HttpService.newPostRequest(data,'SetPreferenceSettings.php',(err,res)=>{
      this.loading=false;
      if(err)
        this.$rootScope.$broadcast('errorToast','Impossibile applicare le impostazioni');
      else{
        this.$rootScope.$broadcast('errorToastNR','Impostazioni applicate con successo');
      }
    })
  }
}

app.component('settings', {
  controller: Settings,
  controllerAs: 'Update',
  templateUrl: 'App/Shared/Sidenav/Settings/SettingsView.html'
});
