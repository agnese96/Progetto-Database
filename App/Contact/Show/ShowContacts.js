class ShowContacts {
  constructor(HttpService) {
    this.HttpService=HttpService;
    this.initContacts();
  }
  initContacts() {
    this.HttpService.newPostRequest({},'GetContacts.php',angular.bind(this, this.getContacts));
  }
  getContacts(err, res) {
    if(err){
      console.error(err);
      this.Contatti={};
    }
    else {
      this.Contatti=res;
    }
  }
}

app.component('contacts', {
  templateUrl: 'App/Contact/Show/ShowContactsView.html',
  controllerAs: 'Contacts',
  controller: ShowContacts
});
