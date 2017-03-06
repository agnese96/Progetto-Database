class ShowDeadline {
  constructor($state, $rootScope, HttpService) {
      this.HttpService=HttpService;
      this.$state=$state;
      this.$rootScope=$rootScope;
      this.editmode=false;

      this.Priorities = [{
          nome: 'Priorità 0',
          class: '',
          val: 0
        },
        {
          nome: 'Priorità 1',
          class: 'low-priority',
          val: 1
        },
        {
          nome: 'Priorità 2',
          class: 'medium-priority',
          val: 2
        },
        {
          nome: 'Priorità 3',
          class: 'high-priority',
          val: 3
      }];

      $rootScope.$on('updateDeadlines', angular.bind(this, function checkRefresh(event, data) {
        if(this.id==data)
          this.$onInit();
      }));
  }
  $onInit() {
    this.Data={
      IDScadenza : this.id,
    };
    this.HttpService.newPostRequest(this.Data, 'ShowDeadline.php', angular.bind(this, this.getDeadline));
    this.loading=true;
  }
  getDeadline(err, res) {
    this.loading=false;
    if(err){
      this.$rootScope.$broadcast('errorToast', 'Questa scadenza non esiste');
      //this.$state.go('home');
    }
    else
      this.Deadline=res;
  }
  Edit() {
    this.Backup=angular.copy(this.Deadline);
    this.toggleContentEditable();
  }
  Cancel() {
    angular.copy(this.Backup, this.Deadline);
    this.toggleContentEditable();
  }
  Apply() {
    this.Deadline.IDScadenza=this.id;
    this.loading=true;
    this.HttpService.newPostRequest(this.Deadline, 'EditDeadline.php', angular.bind(this, this.applyResponse));
  }
  Delete() {
    this.loading=true;
    this.HttpService.newPostRequest({IDScadenza: this.id}, 'DeleteDeadline.php', angular.bind(this, this.deleteCallback));
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
      this.toggleContentEditable();
      this.$rootScope.$broadcast('updateDeadline', this.id);
      this.loading=false;
    }
  }
  checkDone() {
    this.loading=true;
    this.Data = {
      IDScadenza : this.id
    };
    this.HttpService.newPostRequest(this.Data, 'CompleteDeadline.php', angular.bind(this, this.setDone));
  }
  setDone(err, res) {
    if(err)
      console.error(err);
    else {
      this.$rootScope.$broadcast('updateDeadline', this.id);
      this.$rootScope.$broadcast('errorToastNR',"Scadenza completata :D");
      this.loading=false;
      this.$state.go('home');
    }
  }
  deleteCallback(err, res) {
    this.loading=false;
    if(err){
      console.error(err);
      this.$rootScope.$broadcast('errorToastNR',"Impossibile eliminare la scadenza");
    }else{
      this.loading=false;
      this.$rootScope.$broadcast('updateDeadline', this.id);
      this.$rootScope.$broadcast('errorToast',"Scadenza eliminata con successo");
    }
  }
}

app.component('showDeadline', {
  controller: ShowDeadline,
  controllerAs: 'Show',
  templateUrl: 'App/Deadline/Show/ShowDeadlineView.html',
  bindings: {
    'id': '='
  }
});
