import { Component, Injector, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AzuresearchProvideServiceProxy, PersonCitySearchSuggestion,AzureSearchCommonServiceProxy, SearchResultViewModel, SearchDocumentSearchResult, SearchFacet, DocumentResult, Facet, Documentlist } from '../../shared/service-proxies/service-proxies';
import { SSL_OP_CIPHER_SERVER_PREFERENCE } from 'constants';
import { Options } from '@angular-slider/ngx-slider';
import { finalize } from 'rxjs/operators';
@Component({
  templateUrl: './about.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./hotels.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent extends AppComponentBase {

    searchresults: SearchResultViewModel;
    docsearch: SearchDocumentSearchResult[]
    docsearchfilterlist: SearchDocumentSearchResult[]
    docresult: DocumentResult;
    facets: Facet[];
    searchfield: string='barger';
    facetstring: string;
    accuracy: string;
    documnetList: Documentlist[]
    isloading = false;
    value: number = 0;
    highValue: number = 100;
    options: Options = {
        floor: 0,
        ceil: 100,
        step: 5,
        showTicksValues: false,
        showTicks: true,
        noSwitching: true,
    };
    indexname = 'nysiis-index';
    constructor(injector: Injector,
        private _service: AzuresearchProvideServiceProxy,
        private _azservice: AzureSearchCommonServiceProxy,
        private ref: ChangeDetectorRef    ) {
        super(injector);
        this.docsearch = [];
        this.documnetList = [];
    }

    ngOnInit(): void {
       
    }

    onclick() {
        this.facetstring = '';
        this.documnetList = [];
        this.isloading = true;
        this._azservice
            .search(this.searchfield, this.indexname, this.accuracy, this.facetstring, 1)
            .pipe(
                finalize(() => { this.isloading = false;})
            )
            .subscribe((result) => {
                debugger;
                this.searchresults = result;
                this.facets = this.searchresults.documentResult.facets;
                this.docsearch = this.searchresults.documentResult.results;
                this.docsearchfilterlist = this.searchresults.documentResult.resultslist;
                this.documnetList = this.searchresults.documentResult.documnetList;
                this.isloading = false;
                this.ref.detectChanges();
                //for (let fcv of this.facets) {
                //    for (let fv of fcv.value) {
                //        let fad = fv;
                //    }
                //}
            });
    }
    searchdata() {
        debugger;
        var trimmed = this.searchfield.trim();
       
        let wordSearch = this.searchfield.trim();
        setTimeout(() => {
            if (wordSearch == this.searchfield.trim()) {
                if (this.searchfield.trim()) {
                    this._azservice
                        .search(this.searchfield, this.indexname, this.accuracy,'',1)
                        .subscribe((result) => {
                            debugger;
                            this.searchresults = result;
                            this.facets = this.searchresults.documentResult.facets;
                            this.docsearch = this.searchresults.documentResult.results;
                        });
                }
            }
        }, 2000);

    }
    chnagetick(event) {
        debugger;
        this.accuracy = event.value + ',' + event.highValue;
        //console.log('1--' + event.highValue + ',' + event.value);
    }
    facetclick(datakey,dataval) {
        debugger;
        this.facetstring = datakey+'_'+dataval;

        this._azservice
            .search(this.searchfield, this.indexname, this.accuracy, this.facetstring, 1)
            .subscribe((result) => {
                debugger;
                this.searchresults = result;
                this.facets = this.searchresults.documentResult.facets;
                this.docsearch = this.searchresults.documentResult.results;
                this.ref.detectChanges();
                //for (let fcv of this.facets) {
                //    for (let fv of fcv.value) {
                //        let fad = fv;
                //    }
                //}
            });
    }
}
