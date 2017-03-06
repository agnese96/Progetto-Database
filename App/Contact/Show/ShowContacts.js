class ShowContacts {
  constructor($rootScope, $mdDialog, HttpService) {
    this.$rootScope=$rootScope;
    this.$mdDialog=$mdDialog;
    this.HttpService=HttpService;
    this.initContacts();
    this.selected=false;
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
  delete(c){
    this.HttpService.newPostRequest({IDContatto: c.Email},'DeleteContact.php',(err,res)=>{
      if(err){
        console.error(err);
        this.$rootScope.$broadcast('errorToastNR','Impossibile eliminare il contatto');
      }else{
        let index=this.Contatti.indexOf(c);
        this.Contatti.splice(index,1);
      }
    });
  }
  addDialog(ev){
    let addContactPrompt=this.$mdDialog.prompt()
      .title("Aggiungi un contatto")
      .textContent("Inserisci l'email del contatto che vuoi aggiungere")
      .placeholder("example@mail.com")
      .ariaLabel("Email")
      .targetEvent(ev)
      .ok("Conferma")
      .cancel("Annulla");
    this.$mdDialog.show(addContactPrompt).then(angular.bind(this,this.addContact));
  }
  addContact(Email) {
    this.HttpService.newPostRequest({IDContatto: Email},'CreateContact.php',(err,res)=>{
      if(err){
        this.$rootScope.$broadcast('errorToastNR',"Impossibile aggiungere il contatto");
      }else if(res.warning){
        this.$rootScope.$broadcast('errorToastNR',"Il contatto non è iscritto all'applicazione");
      }
      else{
        this.Contatti.push(res);
      }
    });
  }
  select(Email) {
    this.HttpService.newPostRequest({IDContatto: Email},'GetInfoContact.php',(err,res)=>{
      if(err){
        this.$rootScope.$broadcast('errorToastNR',"C'è stato un problema, riprova più tardi");
      }else{
        this.selected=true;
        this.selectedContact=res;
      }
    })
  }
}

app.component('contacts', {
  templateUrl: 'App/Contact/Show/ShowContactsView.html',
  controllerAs: 'Contacts',
  controller: ShowContacts
});
