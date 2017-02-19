class ShowEvent {
  constructor(HttpService) {
      this.HttpService=HttpService;
  }
  $onInit() {
    console.log(this.id);
    this.Data={
      IDEvento : this.id,
      DataEvento : this.date
    };
    console.log(this.Data);
    this.HttpService.newPostRequest(this.Data, 'ViewEvent.php', angular.bind(this, this.getEvent));
    this.loading=true;
  }
  getEvent(err, res) {
    this.loading=false;
    if(err)
      console.error(err);
    else{
      console.log(res);
      this.Event=res;
    }
  }
}

app.component('showEvent', {
  controller: ShowEvent,
  controllerAs: 'Show',
  templateUrl: 'App/Event/Show/ShowEventView.html',
  bindings: {
    'id': '=',
    'date': '@'
  }
});
