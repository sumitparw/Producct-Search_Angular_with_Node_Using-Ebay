import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject, generate } from 'rxjs';
import { SearchDetailsService } from './search-details.service';

@Injectable({
  providedIn: 'root'
})
export class DetailedInformationService {

  private _result_json = new Subject();
  result_json = this._result_json.asObservable();
  private _data_result = new Subject();
  data_result = this._data_result.asObservable();

  private _upcoming_events_result = new Subject();
  upcoming_events_result = this._upcoming_events_result.asObservable();
  private _upcoming_events_data_res = new Subject();
  upcoming_events_data_res = this._upcoming_events_data_res.asObservable();

  // private _artists_result = new Subject();
  // artists_result = this._artists_result.asObservable();

  artistRes: any = [];

  private _team_photos_result = new Subject();
  team_photos_result = this._team_photos_result.asObservable();

  private _sim_Products_result = new Subject();
  sim_Products_result = this._sim_Products_result.asObservable();

  private _tabs_control = new Subject();
  tabs_control = this._tabs_control.asObservable();

  private _reset_tabs = new Subject();
  reset_tabs = this._reset_tabs.asObservable();

  private _is_wishlist_event = new Subject();
  is_wishlist_event = this._is_wishlist_event.asObservable();

  private _show_result_tab = new Subject();
  show_result_tab = this._show_result_tab.asObservable();

  teamPhotos: any = [];
  sim_Products: any = [];

  constructor(private httpClient: HttpClient, private searchDetailService: SearchDetailsService) { }


  photos(key) {
    //console.log(key);
    let count1: number;
    this.teamPhotos = [];
      const url = 'http://localhost:3000/api/google-search-img?key=' + key;
      const resp = this.httpClient.get(url);
      resp.subscribe(data => {
        // console.log('google photos');
         //console.log(data);
        this.teamPhotos.push(data);
      });
    this._team_photos_result.next(this.teamPhotos);
   

    // const url = ''
  }
  simprod(key) {
    //console.log(key);
    let count1: number;
    this.sim_Products = [];
      const url = 'http://localhost:3000/api/simprod?key=' + key;
      const resp = this.httpClient.get(url);
      resp.subscribe(data => {
        // console.log('google photos');
        //  console.log(data[0]["name"],"ghg");
        this.sim_Products.push(data);
      });
      // console.log(this.sim_Products);
    //  this.sim_Products_result.next(this.sim_Products);
   

    // const url = ''
  }
  saveEventTabsState(data) {
    //console.log(data);
    localStorage.setItem("events_tab_info", JSON.stringify(data));
  }

  showEventTabsState() {
    let data: any = {};
    data = JSON.parse(localStorage.getItem("events_tab_info"));
     console.log(data);
    //this._data_result.next(data.venue_tab);
    //this._team_photos_result.next(data.photo_tab);
    this._team_photos_result.next(data.photo_tab);
    this._sim_Products_result.next(data.similar_tab);
    this._tabs_control.next(data.tabsInfo);
    this.searchDetailService.setEventInfo(data.event_tab);
    this.setIswishlistEvent(data.event_tab.id);

  }

  setIswishlistEvent(event_id) {
    // console.log('is wishlist', localStorage.getItem(event_id));
    if (localStorage.getItem(event_id) ) {
      this._is_wishlist_event.next(true);
    } else {
      this._is_wishlist_event.next(false);
    }
  }

  resetTabs() {
    // console.log("detailed")
    this._reset_tabs.next(true);
  }

  setShowResults() {
    this._show_result_tab.next(true);
  }
 
}