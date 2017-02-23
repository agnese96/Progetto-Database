class ShowEvent {
  constructor($state, $rootScope, HttpService) {
      this.HttpService=HttpService;
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
      //console.error(err);
      this.$rootScope.$broadcast('errorToast', 'Questo evento non esiste');
    else{
      this.Event=res;
    }
  }
  Edit() {
    this.Backup=angular.copy(this.Event);
    this.toggleContentEditable();
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
