class DueDeadlines {
  constructor($state, $rootScope, HttpService) {
    this.HttpService=HttpService;
    this.$state=$state;
    this.$rootScope=$rootScope;
    this.initDeadlines();

    $rootScope.$on('updateDeadline',angular.bind(this, this.refresh));
    $rootScope.$on('newDeadline',angular.bind(this, this.initDeadlines));
  }
  initDeadlines() {
    this.HttpService.newPostRequest({},'ShowDueDeadline.php',angular.bind(this, this.getDeadlines));
  }
  getDeadlines(err, res) {
    if(err){
      this.Deadlines={};
    }
    else {
      this.Deadlines=res;
    }
  }
  checkDeadline(id) {
    this.HttpService.newPostRequest({IDScadenza:id}, 'CompleteDeadline.php', angular.bind(this, this.setDone));
  }
  setDone(err, res) {
    if(err){
      console.error(err);
    }else {
      this.$rootScope.$broadcast('updateDeadline',res.id);
      this.initDeadlines();
      this.done();
    }
  }
  goToDeadline(id) {
    console.log(id);
    this.done();
    this.$state.go('deadline.show', {id: id});
  }
  refresh(event,data) {
    this.initDeadlines();
  }
}

app.component('dueDeadlines', {
  templateUrl: 'App/Shared/Sidenav/Due/DueDeadlinesView.html',
  controllerAs: 'Due',
  controller: DueDeadlines,
  bindings: {
    done: '&'
  }
});
