class ShowDeadline {
  constructor($state, HttpService) {
      this.HttpService=HttpService;
      this.$state=$state;
      this.editmode=false;
  }
  $onInit() {
    console.log(this.id);
    this.Data={
      IDScadenza : this.id,
    };
    this.HttpService.newPostRequest(this.Data, 'ShowDeadline.php', angular.bind(this, this.getDeadline));
    this.loading=true;
  }
  getDeadline(err, res) {
    this.loading=false;
    if(err)
      console.error(err);
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
      console.log(res);
      this.toggleContentEditable();
      this.loading;
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
