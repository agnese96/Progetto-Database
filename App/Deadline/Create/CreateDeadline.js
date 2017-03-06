class CreateDeadline {
  constructor ($state, $rootScope, HttpService) {
    this.Deadline = {
      Descrizione: '',
      Priority: 0,
      Ricorrenza: 0,
      Promemoria: 1,
      Frequenza: 0
    };
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
      console.error(err);
    else {
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
