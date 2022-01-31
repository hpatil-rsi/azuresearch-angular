import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '../../shared/app-component-base';
import { AzureSearchEntityServiceProxy, Documentlist, DocumentResult, EntityDetailsDto, Facet, SearchDocumentSearchResult, SearchResultViewModel } from '../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-azuresearch',
  templateUrl: './azuresearch.component.html',
  styleUrls: ['./azuresearch.component.css']
})
export class AzuresearchComponent extends AppComponentBase {
   
    entityFilter = true;
    caseFilter = false;
    globalFilter = false;
    propertyFilter = false;
    mongoFilter = false;
    unstrucredFilter = false;
    isloading = false;
    indexname = 'entities-indexer';
    searchresults: SearchResultViewModel;
    docsearch: SearchDocumentSearchResult[]
    docsearchfilterlist: SearchDocumentSearchResult[]
    docresult: DocumentResult;
    facets: Facet[];
    searchfield: string;
    facetstring: string;
    accuracy: string;
    documnetList: EntityDetailsDto[]

    selectedEntity: any;
    allEntities: string[];
    filteredentity: any[];
    isLoader = false
    flag = true;
    flaglist = false;
    isSuggest = false;
    listloader = false;
    constructor(injector: Injector,
        private _service: AzureSearchEntityServiceProxy,
        private _router: Router,
        private ref: ChangeDetectorRef) {
        super(injector);
        this.docsearch = [];
        this.documnetList = [];
    }

  ngOnInit(): void {
  }
    onclick() {
        debugger;
        this.facetstring = '';
        this.documnetList = [];
        this.isloading = true;
        this._service
            .searchEntity(this.searchfield, this.facetstring, 1, this.propertyFilter, this.mongoFilter, this.globalFilter)
            .pipe(
                finalize(() => { this.isloading = false; })
            )
            .subscribe((result) => {
                debugger;
                this.searchresults = result;
                this.facets = this.searchresults.documentResult.facets;
                this.docsearch = this.searchresults.documentResult.results;
                this.docsearchfilterlist = this.searchresults.documentResult.results;
                this.documnetList = this.searchresults.entityDetails;
                this.isloading = false;
                this.ref.detectChanges();
                //for (let fcv of this.facets) {
                //    for (let fv of fcv.value) {
                //        let fad = fv;
                //    }
                //}
            });
    }
    redirectentity(key) {
        this._router.navigate(['app/searchdetails', key]);
    }
    eventCheckEntity(event) {
        debugger;
        if (event.checked)
        {
            this.propertyFilter = false;
            this.mongoFilter = false;
        }          
    }
    eventCheckProprty(event) {
        debugger;
        if (event.checked)
        {
            this.entityFilter = false;
            this.mongoFilter = false;
        }
            
    }
    eventCheckMongo (event){
        debugger;
        if (event.checked)
        {
            this.propertyFilter = false;
            this.entityFilter = false;
        }
        
    }
    eventCheckGlobal(event) {
        if (event.checked) {
            this.propertyFilter = false;
            this.entityFilter = false;
            this.mongoFilter = false;
        }
    }
    clicka() {
        alert('Hi')
    }

    facetclick(datakey, dataval) {
        debugger;
        this.documnetList = [];
        this.facetstring = datakey + '_' + dataval;
        this.isloading = false;
        this._service
            .searchEntity(this.searchfield, this.facetstring, 1, this.propertyFilter, this.mongoFilter, this.globalFilter)
            .subscribe((result) => {
                debugger;
                this.searchresults = result;
                this.facets = this.searchresults.documentResult.facets;
                this.docsearch = this.searchresults.documentResult.results;
                this.documnetList = this.searchresults.entityDetails;
                this.isloading = false;
                this.ref.detectChanges();
                //for (let fcv of this.facets) {
                //    for (let fv of fcv.value) {
                //        let fad = fv;
                //    }
                //}
            });
    }

    filterUsers(event) {
        debugger;
        if (this.isSuggest) {
            this.flaglist = false;
           
            let wordSearch = event.target.value.trim();
            setTimeout(() => {
                if (wordSearch == event.target.value.trim()) {
                    if (event.target.value.trim()) {
                        this.flag = true;
                        this.listloader = true;
                        this._service.suggestEntity(wordSearch, true)
                            .pipe(finalize(() => { this.isLoader = false; this.flag = false; }))
                            .subscribe(data => {
                                this.isLoader = false;
                                if (data.length > 0)
                                    this.flaglist = true;
                                this.allEntities = data
                                this.listloader = false;
                            })
                    }
                }
            }, 2000);
        }
        
    }
    onselectentity(event) {
        debugger;

        this.selectedEntity = event;
        this.flag = false;
        this.flaglist = false;
        this.searchfield = event;
        this.onclick();
    }

   
}
