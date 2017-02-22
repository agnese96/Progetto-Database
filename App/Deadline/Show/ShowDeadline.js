class ShowDeadline {
  constructor($state, $rootScope, HttpService) {
      this.HttpService=HttpService;
      this.$state=$state;
      this.$rootScope=$rootScope;
      this.editmode=false;

      $rootScope.$on('updateDeadline', angular.bind(this, function checkRefresh(event, data) {
        console.log('Some deadline has been updated');
        if(this.id==data)
          this.$onInit();
      }));
  }
  $onInit() {
    this.Data={
      IDScadenza : this.id,
    };
    this.HttpService.newPostRequest(this.Data, 'ShowDeadline.php', angular.bind(this, this.getDeadline));
    this.loading=true;
  }
  getDeadline(err, res) {
    this.loading=false;
    if(err){
      this.$rootScope.$broadcast('errorToast', 'Questa scadenza non esiste');
      this.$state.go('home');
    }
    else
      this.Deadline=res;
  }
  Edit() {
    this.Backup=angular.copy(this.Deadline);
    this.toggleContentEditable();
  }
  Cancel() {
    angular.copy(this.Backup, this.Deadline);
    this.toggleContentEditable();
  }
  Apply() {
    this.Deadline.IDScadenza=this.id;
    this.loading=true;
    this.HttpService.newPostRequest(this.Deadline, 'EditDeadline.php', angular.bind(this, this.applyResponse));
  }
  toggleContentEditable() {
    this.editmode=!this.editmode;
    $('.editable').attr('contenteditable',this.editmode);
  }
  applyResponse(err, res) {
    if(err){
      console.error(err);
      this.Cancel();
    }else{
      this.toggleContentEditable();
      this.$rootScope.$broadcast('updateDeadline', this.id);
      this.loading=false;
    }
  }
  checkDone() {
    this.loading=true;
    this.Data = {
      IDScadenza : this.id
    };
    this.HttpService.newPostRequest(this.Data, 'CompleteDeadline.php', angular.bind(this, this.setDone));
  }
  setDone(err, res) {
    if(err)
      console.error(err);
    else {
      this.$rootScope.$broadcast('updateDeadline', this.id);
      this.loading=false;
      this.$state.go('home');
    }
  }
}

app.component('showDeadline', {
  controller: ShowDeadline,
  controllerAs: 'Show',
  templateUrl: 'App/Deadline/Show/ShowDeadlineView.html',
  bindings: {
    'id': '='
  }
});

app.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});
