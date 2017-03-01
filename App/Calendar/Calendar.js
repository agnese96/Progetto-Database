class CalendarController {
  constructor($state, $rootScope, calendarConfig, HttpService) {
    this.$state=$state;
    this.$rootScope=$rootScope;
    this.HttpService=HttpService;

    this.config(calendarConfig);
    this.viewDate=new Date();
    this.setView('month');
    this.events=[];
    this.getEvents();
  }
  config(calendarConfig) {
    // This will configure times on the day view to display in 24 hour format rather than the default of 12 hour
    calendarConfig.allDateFormats.moment.date.hour = 'HH:mm';
    //use moment to format dates instead of angular
    calendarConfig.dateFormatter = 'moment';
    moment.locale('IT');
  }
  setView(sel) {
    this.viewMonth=false;
    this.viewWeek=false;
    this.viewDay=false;

    this.view=sel;

    switch (sel) {
      case 'month':
        this.viewMonth=true;
        break;
      case 'week':
        this.viewWeek=true;
        break;
      case 'day':
        this.viewDay=true;
        break;
    }
    this.getEvents();
  }
  getEvents() {
    let mViewDate = moment(this.viewDate);
    let data = {
      Year : mViewDate.get('year')
    };
    let url;
    switch (this.view) {
      case 'month':
        data.Month=mViewDate.get('month')+1;
        url="Month.php";
        break;
      case 'week':
        data.Week=mViewDate.week();
        url="Week.php";
        break;
      case 'day':
        data.Month=mViewDate.get('month')+1;
        data.Day=mViewDate.get('date');
        url="Day.php";
        break;
    }
    this.HttpService.newPostRequest(data,'GetEvent'+url, angular.bind(this, this.setEvents));
    this.HttpService.newPostRequest(data,'GetDeadline'+url, angular.bind(this, this.setDeadlines));
  }
<<<<<<< Updated upstream
  setContacts(err, res){
console.log(err);
=======
  setEvents(err, res){
>>>>>>> Stashed changes
    if (err) {
      //this.events=[];
    }else{
      this.events.concat(res.map((event)=>{
        return {
          id: event.IDEvento,
          title: event.Titolo,
          startsAt: moment(event.DataInizio+"T"+event.OraInizio).toDate(),
          endsAt: moment(event.DataFine+"T"+event.OraFine).toDate(),
          color: this.getColors(event.NomeCategoria),
          incrementsBadgeTotal: true,
          allDay: false,
          draggable: true
        }
      }));
    }
  }
  setDeadlines(err, res){
    if (err) {
      //this.events=[];
    }else{
      this.events.concat(res.map((deadline)=>{
        return {
          id: deadline.IDScadenza,
          title: deadline.Descrizione,
          startsAt: moment(deadline.Data, 'Y-M-D').toDate(),
          color: this.getColors(deadline.Priority),
          incrementsBadgeTotal: true,
          allDay: true,
          draggable: true
        }
      }));
    }
  }
  getColors(cat) {
    switch (cat) {
      case 'Interessi':
        return {
          primary: '#FFC107',
          secondary: '#FFE082'
        }
        break;
      case 'Sport':
        return {
          primary: '#8BC34A',
          secondary: '#C5E1A5'
        }
        break;
      case 'Lavoro':
        return {
          primary: '#3F51B5',
          secondary: '#9FA8DA'
        }
        break;
      case 'Studio':
        return {
          primary: '#2196F3',
          secondary: '#90CAF9'
        }
        break;
      case 'Personale':
        return {
          primary: '#00BCD4',
          secondary: '#80DEEA'
        }
        break;
    }
  }
  eventClicked(calendarEvent) {
    let Data = moment(calendarEvent.startsAt).format('Y-M-D');
    this.$state.go('event.show',{id: calendarEvent.id, date: Data});
  }
  dateRangeSelect(rangeStart, rangeEnd) {
    let params = {
      dataInizio: moment(rangeStart).format('Y-M-D'),
      dataFine : moment(rangeEnd).format('Y-M-D')
    };
    if(this.view=='day'){
      params.oraInizio = moment(rangeStart).format('HH:mm');
      params.OraFine = moment(rangeEnd).format('HH:mm');
    }
    this.$state.go('event.create', params);
  }
  timesChanged(ev, start, end) {
    let Data = {
      IDEvento: ev.id,
      DataID: moment(ev.startsAt).format('Y-M-D'),
      DataInizio: moment(start).format('Y-M-D'),
      DataFine: moment(end).format('Y-M-D'),
      OraInizio: moment(start).format('HH:mm'),
      OraFine: moment(end).format('HH:mm')
    };
    ev.startsAt = start;
    ev.endsAt = end;
    let Backup = angular.copy(ev);
    this.HttpService.newPostRequest(Data, 'EditTimes.php', (err, res)=> {
      if(err){
        angular.copy(Backup, ev);
        console.log(err);
        this.$rootScope.$broadcast('errorToastNR', "Impossibile spostare l'evento");
      }
    });
  }
}


app.controller('calendarController',CalendarController);
