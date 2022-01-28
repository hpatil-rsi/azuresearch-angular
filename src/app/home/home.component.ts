import { Component, Injector, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AzureSearchPhoneticServiceProxy } from '../../shared/service-proxies/service-proxies';

@Component({
  templateUrl: './home.component.html',
    animations: [appModuleAnimation()],
    styleUrls: ['./hotels.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends AppComponentBase {

    searchfield;

    constructor(injector: Injector,
        private _service: AzureSearchPhoneticServiceProxy,
        private ref: ChangeDetectorRef    ) {
    super(injector);
    }



    onclick() {        
        this._service
            .searchPhrase(this.searchfield, true)
            .subscribe((result) => {
                debugger;
                let dataa = result;
                this.ref.detectChanges();
              
            });
    }
}
