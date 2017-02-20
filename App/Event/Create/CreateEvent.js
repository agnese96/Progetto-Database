class CreateEvent {
  constructor ($state, HttpService) {
    console.log('costruttore CreateEvent');
    this.Event = {
      Titolo: '',
      Descrizione: '',
      Ricorrenza: 0,
      Promemoria: 1,
      NomeCategoria: ''
    };
    this.Categorie = ['Lavoro', 'Studio', 'Sport', 'Interessi', 'Personale' ];
    this.$state=$state;
    this.HttpService=HttpService;
  }

  submit() {
    if(this.repeated && !this.repeatedLimit)
      this.Event.Ricorrenza=-1;
    this.HttpService.newPostRequest(this.Event, 'CreateEvent.php', angular.bind(this, this.callback));
  }

  callback(err, res) {
    if(err)
      console.error(err);
    else {
      console.log(res);
      this.$state.go('event.show',{eventId:res.IDEvento, eventDate:res.DataEvento });
    }
  }
}

app.component('createEvent', {
  controller: CreateEvent,
  controllerAs: 'Create',
  templateUrl: 'App/Event/Create/CreateEventView.html'
});
