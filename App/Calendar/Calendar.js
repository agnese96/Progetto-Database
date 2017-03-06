class CalendarController {
  constructor($state, $rootScope, calendarConfig, HttpService, userService) {
    this.$state=$state;
    this.$rootScope=$rootScope;
    this.HttpService=HttpService;
    this.userService=userService;
    this.events=[];
    this.config(calendarConfig);
    this.viewDate=new Date();
    this.setView('month');
    this.getPreferences();
  }
  config(calendarConfig) {
    // This will configure times on the day view to display in 24 hour format rather than the default of 12 hour
    calendarConfig.allDateFormats.moment.date.hour = 'HH:mm';
    //use moment to format dates instead of angular
    calendarConfig.dateFormatter = 'moment';
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
    this.events.length=0;
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
  setEvents(err, res){
    if (err) {
      //this.events=[];
    }else{
      this.events = this.events.concat(res.map((event)=>{
        return {
          id: event.IDEvento,
          title: event.Titolo,
          startsAt: moment(event.DataInizio+"T"+event.OraInizio).toDate(),
          endsAt: moment(event.DataFine+"T"+event.OraFine).toDate(),
          color: this.getColors(event.NomeCategoria),
          incrementsBadgeTotal: true,
          allDay: false,
          draggable: event.IDCreatore==this.userService.gMail()
        }
      }));
    }
  }
  setDeadlines(err, res){
    if (err) {
      //this.events=[];
    }else{
      this.events = this.events.concat(res.map((deadline)=>{
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
      case '1':
        return {
          primary: '#FFE082'
        }
        break;
      case '2':
        return {
          primary: '#FFB74D'
        }
        break;
      case '3':
        return {
          primary: '#F44336'
        }
        break;
    }
  }
  getPreferences(){
    this.HttpService.newPostRequest({},'GetPreference.php',(err,res)=>{
      if(err)
        this.$rootScope.$broadcast('errorToastNR',"Impossibile caricare le preferenze");
      else {
        if(res.VistaCalendario!='month')
          this.setView(res.VistaCalendario);
        if(res.OraInizioGiorno)
          this.startHour=moment(res.OraInizioGiorno,'H:m:s').format('HH:mm');
        else
          this.startHour="07:00";
      }
    })
  }
  eventClicked(calendarEvent) {
    if(calendarEvent.allDay){
      this.$state.go('deadline.show', {id: calendarEvent.id});
    }
    else{
      let Data = moment(calendarEvent.startsAt).format('Y-M-D');
      this.$state.go('event.show',{id: calendarEvent.id, date: Data});
    }

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
    if(ev.allDay)
      this.changeDeadlineTimes(ev,start,end);
    else {
      this.changeEventTimes(ev,start,end);
    }
  }
  changeDeadlineTimes(ev, start, end) {
    let Data = {
      IDScadenza: ev.id,
      Data: moment(start).format('Y-M-D'),
    };
    let Backup = angular.copy(ev);
    ev.startsAt = start;
    ev.endsAt = end;
    this.HttpService.newPostRequest(Data, 'EditTimes_Deadline.php', (err, res)=> {
      if(err){
        angular.copy(Backup, ev);
        console.error(err);
        this.$rootScope.$broadcast('errorToastNR', "Impossibile spostare l'evento");
      }
    });
  }
  changeEventTimes(ev, start, end) {
    let Data = {
      IDEvento: ev.id,
      DataID: moment(ev.startsAt).format('Y-M-D'),
      DataInizio: moment(start).format('Y-M-D'),
      DataFine: moment(end).format('Y-M-D'),
      OraInizio: moment(start).format('HH:mm'),
      OraFine: moment(end).format('HH:mm')
    };
    let Backup = angular.copy(ev);
    ev.startsAt = start;
    ev.endsAt = end;
    this.HttpService.newPostRequest(Data, 'EditTimes.php', (err, res)=> {
      if(err){
        angular.copy(Backup, ev);
        console.error(err);
        this.$rootScope.$broadcast('errorToastNR', "Impossibile spostare l'evento");
      }
    });
  }
}


app.controller('calendarController',CalendarController);
