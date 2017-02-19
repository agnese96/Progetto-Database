class CreateEvent {
  constructor ($state, HttpService) {
    console.log('costruttore CreateEvent');
    this.Event = {
      Titolo: '',
      Descrizione: '',
      Ricorrenza: 1,
      Frequenza: undefined,
      Promemoria: undefined,
      NomeCategoria: ''
    };
    this.Categorie = ['Lavoro', 'Studio', 'Sport', 'Interessi', 'Personale' ];
    this.$state=$state;
    this.HttpService=HttpService;
  }

  submit() {
    console.log(this.Event.DataInizio);
    this.HttpService.newPostRequest(this.Event, 'CreateEvent.php', this.callback);
  }

  callback(err, res) {
    if(err)
      console.error(err);
    else {
      console.log(res);
    }
  }
}

app.component('createEvent', {
  controller: CreateEvent,
  controllerAs: 'Create',
  templateUrl: 'App/Event/Create/CreateEventView.html'
});
