import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Observable } from "rxjs/Observable";
import { controlNameBinding } from '@angular/forms/src/directives/reactive_directives/form_control_name';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: Http, private httpClient: HttpClient) { }


  private _result_json = new Subject();
  result_json = this._result_json.asObservable();
  private _data_result = new Subject();
  data_result = this._data_result.asObservable();
  private _data_autoComplete = new Subject();
  data_autoComplete = this._data_autoComplete.asObservable();

  private _reset_Element = new Subject();
  reset_Element = this._reset_Element.asObservable();

  private _status_progress_bar = new Subject();
  status_progress_bar = this._status_progress_bar.asObservable();


  resetElements() {
    // console.log("reset")
    this._reset_Element.next(false);
  }

  getEventsDet(searchObj) {
    // console.log(searchObj['shipping1']);
    let x = searchObj['zip'];
    if(searchObj['from_location']=='custom_loc'){
         x = searchObj['custom_location'] 
    }

    let url = 'http://localhost:3000/api/product?keyword=' + searchObj['search_keyword'];
    url += '&zip=' + x;
    url += '&distance=' + searchObj['distance_miles'];
    url += '&category=' + searchObj['categories_list'] + '&fromLocation=' + searchObj['from_location'];
    // url += '&customLocation=' + searchObj['custom_location'];
    url += '&check1=' + searchObj['check1'];
    url += '&check2=' + searchObj['check2'];
    url += '&check3=' + searchObj['check3'];
    url += '&shipping1=' + searchObj['shipping1'];
    url += '&shipping2=' + searchObj['shipping2'];
    // url += '&options=' + searchObj['options'];
    // url += '&distance_miles=' + searchObj['options'];
    
    const event_details =  this.httpClient.get(url);
    event_details.subscribe(data => {
      //console.log('eventssss', data);
      this._result_json.next(data);
      if (data) {
        this._data_result.next(data);
      }
    });
  }
  
  getAutoSuggest(keyword) {
    const url = 'http://localhost:3000/api/autosuggest?keyword=' +  keyword;
    return this.http.get(url).pipe(map((res) => res.json()));
  }
  getAutoSuggestionResponse(keyword) {
    // if (keyword.length > 0) {
      const url = 'http://localhost:3000/api/autosuggest?keyword=' +  keyword;
      const autoSuggestions = this.httpClient.get(url);
      autoSuggestions.subscribe(data => {
        // console.log(data);
        // autoSuggestions = data["_embedded"]["attractions"];
        this._data_autoComplete.next(data);
      });
    
}

  getEventDetailsListState() {
    this._data_result.next(JSON.parse(localStorage.getItem('previousStateOfEventDetails')));
  }

  refreshEventsList(eventsJson) {
      this._data_result.next(eventsJson);
  }

  switchProgressBar(val) {
    this._status_progress_bar.next(val);
  }
}