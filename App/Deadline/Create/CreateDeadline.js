class CreateDeadline {
  constructor ($state, $rootScope, HttpService) {
    console.log('costruttore Deadline');
    this.Deadline = {
      Descrizione: '',
      Priorità: 0,
      Ricorrenza: 0,
      Promemoria: 1,
      Frequenza: 0
    };
    this.$state=$state;
    this.HttpService=HttpService;
    this.$rootScope=$rootScope;
  }
  submit(){
    if(this.repeated && !this.repeatedLimit)
      this.Deadline.Ricorrenza=-1;
    this.HttpService.newPostRequest(this.Deadline, 'CreateDeadline.php', angular.bind(this, this.callback));
  }
  callback(err, res) {
    if(err)
      console.log(err);
    else {
      console.log(res);
      this.$rootScope.$broadcast('newDeadline');
      this.$state.go('deadline.show', {id: res.IDScadenza });
    }
  }
}

app.component('createDeadline', {
  controller: CreateDeadline,
  controllerAs: 'Create',
  templateUrl: 'App/Deadline/Create/CreateDeadlineView.html'
});
