class CreateEvent {
  constructor ($q,$state, HttpService) {
    this.Event = {
      Titolo: '',
      Descrizione: '',
      Ricorrenza: 0,
      Promemoria: 1,
      Frequenza : 0,
      NomeCategoria: '',
      Partecipanti: [

      ],
      HasPartecipants : 0
    };
    this.Categorie = ['Lavoro', 'Studio', 'Sport', 'Interessi', 'Personale' ];
    this.$state=$state;
    this.HttpService=HttpService;
  }
  $onInit() {
    this.Event.DataInizio = this.datai ? moment(this.datai, 'Y-M-D').toDate() : moment().toDate();
    this.Event.DataFine = this.dataf ? moment(this.dataf, 'Y-M-D').toDate() : moment(this.Event.DataInizio).toDate();
    this.Event.OraInizio = this.oraInizio ? moment(this.oraInizio, 'HH:mm').second(0).milliseconds(0).toDate() : moment().add(1, 'h').second(0).milliseconds(0).toDate();
    this.Event.OraFine = this.oraFine ? moment(this.oraFine, 'HH:mm').second(0).milliseconds(0).toDate() : moment(this.Event.OraInizio, 'HH:mm').add(1, 'h').second(0).milliseconds(0).toDate();
  }
  submit() {
    if(this.repeated && !this.repeatedLimit)
      this.Event.Ricorrenza=-1;
    if(this.Event.Partecipanti.length){
      this.Event.HasPartecipants = 1;
      console.log(this.Event);
    }
    this.HttpService.newPostRequest(this.Event, 'CreateEvent.php', angular.bind(this, this.submitCallback));
  }

  submitCallback(err, res) {
    if(err)
      console.error(err);
    else {
      console.log(res);
      this.$state.go('event.show',{id:res.IDEvento, date:res.DataEvento });
    }
  }
  newContact() {
    //TODO ADD CONTACT
  }
}

app.component('createEvent', {
  controller: CreateEvent,
  controllerAs: 'Create',
  templateUrl: 'App/Event/Create/CreateEventView.html',
  bindings: {
    'datai': '@?',
    'oraInizio': '@?',
    'dataf': '@?',
    'oraFine': '@?'
  }
});
