class CreateDeadline {
  constructor ($state, HttpService) {
    this.Deadline = {
      Descrizione: '',
      Priorità: 0,
      Ricorrenza: 0,
      Promemoria: 1
    };
    this.$state=$state;
    this.HttpService=HttpService;
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
      this.$state.go('deadline.show', {deadlineId:res.IDScadenza, deadlineDate:res.Data });
    }
  }
}

app.component('createDealine', {
  controller: CreateDeadline,
  controllerAs: 'Create',
  templateUrl: 'App/Deadline/Create/CreateDeadlineView.html'
});
