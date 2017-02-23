class ShowContacts {
  constructor(HttpService) {
    this.HttpService=HttpService;
    this.initContacts();
  }
  initContacts() {
    this.HttpService.newPostRequest({},'ShowContacts.php',angular.bind(this, this.getContacts));
  }
  getContacts(err, res) {
    if(err){
      this.Contacts={};
    }
    else {
      this.Contacts=res;
    }
  }
}

app.component('contacts', {
  templateUrl: 'App/Contact/Show/ShowContactsView.html',
  controllerAs: 'Contacts',
  controller: ShowContacts
});
