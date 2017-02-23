class CreateEvent {
  constructor ($q,$state, HttpService) {
    console.log('costruttore CreateEvent');
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
    this.$q=$q;
    this.HttpService=HttpService;
    this.pendingSearch;
    this.cancelSearch=angular.noop;
  }
  querySearch($query) {
    if( !this.pendingSearch ) {
      this.cancelSearch();

      return this.pendingSearch = this.$q( (resolve, reject) => {
          this.cancelSearch = reject;
          this.HttpService.newPostRequest({Key: $query}, 'GetFilteredContacts.php', function contactsCallback(err, res) {
              console.log(res);
              if(err)
                reject(err);
              else {
                resolve(res);
              }
          });
      });
    }
    return this.pendingSearch;
  }

  submit() {
    if(this.repeated && !this.repeatedLimit)
      this.Event.Ricorrenza=-1;
    if(this.Event.Partecipanti.length)
      this.Event.HasPartecipants = 1;
    this.HttpService.newPostRequest(this.Event, 'CreateEvent.php', angular.bind(this, this.callback));
  }

  callback(err, res) {
    if(err)
      console.error(err);
    else {
      console.log(res);
      //this.$state.go('event.show',{eventId:res.IDEvento, eventDate:res.DataEvento });
    }
  }
}

app.component('createEvent', {
  controller: CreateEvent,
  controllerAs: 'Create',
  templateUrl: 'App/Event/Create/CreateEventView.html'
});
