class NotificationsPanel {
  constructor($interval, HttpService) {
    this.HttpService=HttpService;
    this.$inteval=$interval;
    this.notifications=[];
    this.getNotifications();
    // this.sync=$interval(()=>{
    //   console.log('Sincronizzazione notifiche');
    //   this.getNotifications();
    // }, 600000);
  }
  getNotifications() {
    this.HttpService.newPostRequest({},'GetNotifications.php',(err,res)=>{
      if(err) {
        console.error(err);
        this.$rootScope.$broadcast('errorToast','Impossibile sincronizzare le notifiche');
      }else{
        this.notifications.length=0;
        if(res.NotificheEvento)
          this.notifications=res.NotificheEvento.map(function mapNE(not) {
              let notifica={
                dataNotifica: moment(not.Data+"T"+not.Ora).fromNow(),
                dataEvento: moment(not.DataInizio+"T"+not.OraInizio).format('dddd, D MMMM YYYY, H:mm'),
                stato: "event.show({id:"+not.IDEvento+", date:'"+not.DataInizio+"'})"
              };
              switch (not.Tipo) {
                case 'P':
                  notifica.desc="L'evento "+not.TitoloEvento+" è tra: "+not.Promemoria+" ore";
                  break;
                case 'N':
                  notifica.desc="Sei stato invitato all'evento: "+not.TitoloEvento;
                  break;
                case 'R':
                  notifica.desc="Non sei più invitato all'evento: "+not.TitoloEvento;
                  notifica.stato=null;
                  break;
                case 'D':
                  notifica.desc="L'evento: "+not.TitoloEvento+" è stato eliminato";
                  notifica.stato=null;
                  break;
                case 'E':
                  notifica.desc="L'evento: "+not.TitoloEvento+" è stato modificato";
                  break;
              }
              return notifica;
          });
        if(res.NotificheScadenza)
          this.notifications=this.notifications.concat(res.NotificheScadenza.map(function mapNS(not) {
            return {
              desc: not.Descrizione,
              dataNotifica: moment(not.DataNotifica).fromNow(),
              dataEvento: moment(not.Data).format('dddd, D MMMM YYYY'),
              stato: "deadline.show({id:"+not.IDScadenza+"})"
            }
          }));
        if(this.notifications.length==0)
          this.empty=true;
      }
    });
  }
  // $onDestroy() {
  //   console.log('Stop sincronizzazione notifiche');
  //   this.$interval.cancel(this.sync);
  // }

}

class Notifications {
  constructor($mdPanel) {
    this.$mdPanel=$mdPanel;
  }
  Show($event) {
    let position = this.$mdPanel.newPanelPosition()
          .relativeTo('.notification-button')
          .addPanelPosition(
            this.$mdPanel.xPosition.ALIGN_END,
            this.$mdPanel.yPosition.BELOW
          );
    let config = {
        id: 'notificationsPanel',
        attachTo: angular.element(document.body),
        controller: NotificationsPanel,
        controllerAs: 'panel',
        templateUrl: 'App/Shared/Header/Notifications/NotificationsPanelView.html',
        position: position,
        panelClass: 'menu-panel-container',
        zIndex: 300,
        clickOutsideToClose: true,
        clickEscapeToClose: true,
        hasBackdrop: true
      };

    this.$mdPanel.open(config);

  }
}
app.component('notifications',{
  controller: Notifications,
  controllerAs: 'Notifications',
  template: "<md-button class='md-icon-button notification-button' aria-label='Notifiche' ng-click='Notifications.Show($event)'><md-icon>&#xE7F4;</md-icon></md-button>"
})
