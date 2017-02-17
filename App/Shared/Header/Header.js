class HeaderCtrl {
  constructor() {
    console.log('Costruttore controller header !');
  }
}

app.component('headerCtrl', {
  controller: HeaderCtrl,
  controllerAs: 'head',
  templateUrl: 'App/Shared/Header/headerTemplate.html'
});
