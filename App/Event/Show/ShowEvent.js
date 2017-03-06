class ShowEvent {
  constructor($state, $rootScope, HttpService, userService) {
      this.HttpService=HttpService;
      this.userService=userService;
      this.$state=$state;
      this.$rootScope=$rootScope;
      this.editmode=false;
      this.Categorie = ['Lavoro', 'Studio', 'Sport', 'Interessi', 'Personale' ];
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
      this.Event.DataInizio=moment(this.Event.DataInizio,'Y-M-D').toDate();
      this.Event.DataFine=moment(this.Event.DataFine,'Y-M-D').toDate();
      this.Event.OraInizio=moment(this.Event.OraInizio,'H:m').toDate();
      this.Event.OraFine=moment(this.Event.OraFine,'H:m').toDate();
      if(this.Event.IDCreatore==this.userService.gMail())
        this.owner=true;
      else{
        this.owner=false;
        this.setResponse();
      }
      if(res.partecipants)
        this.Event.Partecipanti=res.partecipants.map(function (partecipant) {
            switch (partecipant.Partecipa) {
              case 'N':
                partecipant.partIcon="thumb_down";
                break;
              case 'M':
                partecipant.partIcon="thumbs_up_down";
                break;
              case 'Y':
                partecipant.partIcon="thumb_up";
                break;
            }
            return partecipant;
        });
      else {
        this.Event.Partecipanti=[];
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
    let Data=angular.copy(this.Event);
    Data.IDEvento=this.id;
    Data.DataID=this.date;
    Data.DataInizio=moment(Data.DataInizio).format('Y-M-D');
    Data.DataFine=moment(Data.DataFine).format('Y-M-D');
    Data.OraInizio=moment(Data.OraInizio).format('HH:mm');
    Data.OraFine=moment(Data.OraFine).format('HH:mm');
    this.loading=true;
    this.HttpService.newPostRequest(Data, 'EditEvent.php', angular.bind(this, this.applyResponse));
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
      this.Event.AddedPartecipants=[];
      this.Event.RemovedPartecipants=[];
      let date=moment(this.Event.DataInizio).format('Y-M-D');
      if(this.date != date){
        this.$state.go('event.show', {id:this.id, date: date});
      }
      else {
        this.toggleContentEditable();
        this.loading=false;
      }
    }
  }
  deleteCallback(err, res) {
    this.loading=false;
    if(err){
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
