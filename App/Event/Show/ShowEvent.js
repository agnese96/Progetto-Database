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
      console.log(res);
      //this.$rootScope.$broadcast('errorToast', 'Questo evento non esiste');
    else{
      this.Event=res.event;
      this.Event.Partecipanti=res.partecipants;
      console.log(res);
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
    this.toggleContentEditable();
    this.getContacts();
  }
  Cancel() {
    angular.copy(this.Backup, this.Event);
    this.toggleContentEditable();
  }
  Apply() {
    this.Event.IDEvento=this.id;
    this.Event.DataID=this.date;
    this.loading=true;
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
      if(this.date != this.Event.DataInizio)
        this.$state.go('event.show', {eventId:this.id, eventDate:this.Event.DataInizio});
      else {
        this.toggleContentEditable();
        this.loading
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
  querySearch(criteria) {
    if(this.Contatti)
      return criteria ? this.Contatti.filter((contact)=>{
        return (contact.Nominativo.toLowerCase().indexOf(criteria.toLowerCase()) !=-1);
      }) : [];
    return [];
  }
  getContacts() {
    this.HttpService.newPostRequest({}, 'GetContacts.php', (err, res)=> {
        if(err)
          this.Contatti=[];
        else {
          this.Contatti=res;
        }
    });
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

app.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});
