class myContactChips {
  constructor(HttpService) {
    this.HttpService=HttpService;
    this.getContacts();
  }
  getContacts() {
    this.HttpService.newPostRequest({}, 'GetContacts.php', (err, res)=> {
        if(err)
          this.contacts=[];
        else {
          this.contacts=res;
        }
    });
  }
}

app.component('myContactChips', {
    templateUrl: 'App/Shared/Directives/myContactChipsView.html',
    controller: myContactChips,
    controllerAs: 'cc',
    bindings: {
      'partecipants': '=',
      'readonly': '=',
      'add': '&?',
      'rmv': '&?'
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
app.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          element.bind('change', function(){
          $parse(attrs.fileModel).assign(scope,element[0].files)
             scope.$apply();
          });
       }
    };
 }]);
