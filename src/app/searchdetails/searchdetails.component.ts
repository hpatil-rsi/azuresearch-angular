import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '../../shared/app-component-base';
import { AzureSearchEntityServiceProxy, EntityDetailsDto } from '../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-searchdetails',
  templateUrl: './searchdetails.component.html',
  styleUrls: ['./searchdetails.component.css']
})
export class SearchdetailsComponent extends AppComponentBase {

    Id: number=0;
    private sub: any;
    isloading = true;
    documnetList: EntityDetailsDto[]
    doccount = 0;
    constructor(injector: Injector,
        private _service: AzureSearchEntityServiceProxy,
        private route: ActivatedRoute,
        private ref: ChangeDetectorRef) {
        super(injector);

        this.sub = this.route.params.subscribe(params => {
            this.Id = +params['Id'];
        });       
    }

      ngOnInit(): void {
      }
    ngAfterViewInit() {
        this.documnetList = [];
        this.isloading = true;
        this._service
            .getDetailsByentityKey(this.Id)
            .pipe(
                finalize(() => { this.isloading = false; })
            )
            .subscribe((result) => {
                debugger;
                this.documnetList = result;
                this.doccount = this.documnetList.length;
                this.isloading = false;
                this.ref.detectChanges();
            });
    }

    getFullname(data:EntityDetailsDto) {
        if (data.first_name && data.last_name)
            return data.first_name + ' ' + data.last_name
        else if (data.name)
            return data.name
        else
            return data.first_name + ' ' + data.last_name;
    }

}
