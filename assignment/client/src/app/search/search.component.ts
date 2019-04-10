import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';
import {SearchService} from '../search.service';
import {SearchDetailsService} from '../search-details.service'
import {DetailedInformationService} from '../detailed-information.service'
// import { search } from './search';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  //providers:[SearchService]
})
export class SearchComponent implements OnInit { 
  // zip_pattern = "[0-9],{5}";
  show_custom_input_location = false;
  custom_loc_required = false;

  searchKeywordForm = new FormGroup({
    from_location: new FormControl('here'),
    zip: new FormControl('', [Validators.required]),
    categories_list: new FormControl(''),
    search_keyword: new FormControl('', [Validators.required]),
    custom_location: new FormControl({value: '', disabled: !this.show_custom_input_location }), 
    distance_miles: new FormControl('10'),
    // options: new FormControl(''),
    check1: new FormControl(''),
    check2: new FormControl(''),
    check3: new FormControl(''),
    shipping1:new FormControl(''),
    shipping2:new FormControl('')

  });
  
  zip = '';
  categories_list = '';
  searchKeyword: FormControl = new FormControl();
  autoSuggestResp: any [] = [];
  constructor(private httpClient: HttpClient, private searchService: SearchService, 
    private detailedSearchService: SearchDetailsService,private detialedInformationService:DetailedInformationService) {
    let autoSuggestList = [];
    this.searchKeywordForm.controls['custom_location'].valueChanges
        .subscribe(data => {
          // console.log(data);
          if (data.length >= 3) {
            this.searchService.getAutoSuggest(data).subscribe(response => {
              // console.log(response);
              this.autoSuggestResp = [];
              autoSuggestList = [];
              // console.log(response.length);
              if(response.length>0){
              let i=0;
              for (let i=0;i<response.length;i++) {
                // console.log(response[i]['zip']);
                autoSuggestList.push(response[i]['zip']);
              }
                this.autoSuggestResp = autoSuggestList;
            }
                //  console.log(this.autoSuggestResp);
            });
          }
          else{
            this.autoSuggestResp=[];
          }
        });
        

}

  resetForm() {
    // console.log('reset form ');
    this.searchKeywordForm.reset({
      search_keyword: '',
      from_location: 'here',
      distance_unit: 'miles',
      distance_miles: 10,
      categories_list: ''

    });
    this.detialedInformationService.resetTabs();
    this.getGeoLocationDetails();
    this.searchService.resetElements();
    this.autoSuggestResp = [];
    localStorage.removeItem('currentEventSearchRes');
  }

  location_preference(preference) {
    const loc = this.searchKeywordForm.get('custom_location');
    if (preference === 'custom_loc') {
      
      loc.enable();
      this.custom_loc_required = true;
      // console.log(this.custom_loc_required);
    } else {
      loc.disable();
      this.custom_loc_required = false;
    }
  }
  getGeoLocationDetails() {
    this.httpClient.get("http://ip-api.com/json").subscribe((data: any[]) => {
      this.searchKeywordForm.controls['zip'].setValue(data['zip']);
      if (localStorage.getItem('currentEventSearchRes')) {
        localStorage.removeItem('currentEventSearchRes');
      }
      //console.log(data['zip']);
      this.zip = data['zip'];
    });
  }
  getEventsDet(searchForm) {
    this.searchService.switchProgressBar(true);
    this.searchService.resetElements();
    this.detialedInformationService.resetTabs();
    this.detailedSearchService.animation('in');
    this.autoSuggestResp = [];
    this.searchService.getEventsDet(searchForm.value);
  }
  getEventDetails(searchForm: NgForm) {

  }
  getAutoSuggest($key) {
    if($key.target.value.length>3){
    this.searchService.getAutoSuggestionResponse($key.target.value);}
}
// ngAfterViewInit() {
//   this.custom_loc_required = false;
//   this.cdr.detectChanges();
// }
  ngOnInit() {
    this.getGeoLocationDetails();
   
  }

}
