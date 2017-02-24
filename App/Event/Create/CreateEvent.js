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
    this.getContacts();
  }
  querySearch(criteria) {
    if(this.Contatti)
      return criteria ? this.Contatti.filter((contact)=>{
        return (contact.Nominativo.toLowerCase().indexOf(criteria.toLowerCase()) !=-1);
      }) : [];
    return [];
  }

  submit() {
    if(this.repeated && !this.repeatedLimit)
      this.Event.Ricorrenza=-1;
    if(this.Event.Partecipanti.length){
      this.Event.HasPartecipants = 1;
      console.log(this.Event);
    }
    this.HttpService.newPostRequest(this.Event, 'CreateEvent.php', angular.bind(this, this.callback));
  }

  callback(err, res) {
    if(err)
      console.error(err);
    else {
      console.log(res);
      this.$state.go('event.show',{id:res.IDEvento, date:res.DataEvento });
    }
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
  newContact() {
    //TODO ADD CONTACT
  }
}

app.component('createEvent', {
  controller: CreateEvent,
  controllerAs: 'Create',
  templateUrl: 'App/Event/Create/CreateEventView.html'
});
