class ShowEvent {
  constructor($state, $rootScope, HttpService, userService) {
      this.HttpService=HttpService;
      this.userService=userService;
      this.$state=$state;
      this.$rootScope=$rootScope;
      this.editmode=false;
  }
  $onInit() {
    this.Data={
      IDEvento : this.id,
      DataEvento : this.date
    };
    this.HttpService.newPostRequest(this.Data, 'ViewEvent.php', angular.bind(this, this.getEvent));
    this.loading=true;
  }
  getEvent(err, res) {
    this.loading=false;
    if(err)
      this.$rootScope.$broadcast('errorToast', 'Questo evento non esiste');
    else{
      this.Event=res.event;
      if(res.partecipants)
        this.Event.Partecipanti=res.partecipants;
      else {
        this.Event.Partecipanti=[];
      }
      if(this.Event.IDCreatore==this.userService.gMail()){
        this.owner=true;
      }else {
        this.owner=false;
        this.setResponse();
      }
    }
  }
  Edit() {
    this.Backup=angular.copy(this.Event);
    this.Event.AddedPartecipants=[];
    this.Event.RemovedPartecipants=[];
    if(!this.Event.Partecipanti)
      this.Event.Partecipanti=[];
    this.toggleContentEditable();
  }
  Cancel() {
    angular.copy(this.Backup, this.Event);
    this.Event.AddedPartecipants=[];
    this.Event.RemovedPartecipants=[];
    this.toggleContentEditable();
  }
  Apply() {
    this.Event.IDEvento=this.id;
    this.Event.DataID=this.date;
    this.loading=true;
    console.log(this.Event);
    this.HttpService.newPostRequest(this.Event, 'EditEvent.php', angular.bind(this, this.applyResponse));
  }
  Delete() {
    this.loading=true;
    this.HttpService.newPostRequest({IDEvento: this.id, DataID: this.date}, 'DeleteEvent.php', angular.bind(this, this.deleteCallback));
  }
  toggleContentEditable() {
    this.editmode=!this.editmode;
    $('.editable').attr('contenteditable',this.editmode);
  }
  applyResponse(err, res) {
    if(err){
      console.error(err);
      this.Cancel();
    }else{
      console.log(res);
      this.Event.AddedPartecipants=[];
      this.Event.RemovedPartecipants=[];
      if(this.date != this.Event.DataInizio)
        this.$state.go('event.show', {id:this.id, date:this.Event.DataInizio});
      else {
        this.toggleContentEditable();
        this.loading=false;
      }
    }
  }
  deleteCallback(err, res) {
    this.loading=false;
    if(err){
      console.log(err);
      this.$rootScope.$broadcast('errorToastNR',"Impossibile eliminare l'evento");
    }else{
      this.loading=false;
      this.$rootScope.$broadcast('errorToast',"Evento eliminato con successo");
    }
  }
  Vote(response) {
    this.loading=true;
    this.Data.Partecipa=response;
    this.HttpService.newPostRequest(this.Data,'EditInvitare.php',(err,res)=>{
      this.loading=false;
      if(err){
        console.error(err);
        this.$rootScope.$broadcast('errorToastNR',"Non è stato possibile rispondere all'invito");
      }else{
        this.setResponse(response);
      }
    });
  }
  setResponse(response){
    if(!response)
      response=this.Event.Partecipa;
    this.Response = {
      Yes: false,
      Maybe: false,
      No: false
    };

    switch (response) {
      case 'Y':
        this.Response.Yes=true;
        break;
      case 'M':
        this.Response.Maybe=true;
        break;
      case 'N':
        this.Response.No=true;
        break;
      default: break;
    }
  }
  addPartecipant(email) {
    console.log(email);
    this.Event.AddedPartecipants.push({Email: email});
  }
  rmvPartecipant(email) {
    this.Event.RemovedPartecipants.push({Email: email});
  }
}

app.component('showEvent', {
  controller: ShowEvent,
  controllerAs: 'Show',
  templateUrl: 'App/Event/Show/ShowEventView.html',
  bindings: {
    'id': '=',
    'date': '@'
  }
});
