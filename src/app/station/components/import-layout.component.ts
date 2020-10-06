import { ComponentBase } from '../../shared/components/component-base';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../shared/components/confirm.component';
import { StationModule } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';

const MACRO_MODULE_MAPPING = {
	prod_gen_energycells_macro: 'module_gen_prod_energycells_01',
};

interface LayoutModule {
	count: number;
	module: StationModule;
}

export enum ImportLayoutType {
	load,
	add,
}

export interface ImportLayoutResult {
	layoutName: string;
	type: ImportLayoutType;
}

@Component({
	templateUrl: './import-layout.component.html',
})
export class ImportLayoutComponent extends ComponentBase implements OnInit {
	constructor(public activeModal: NgbActiveModal, private modal: NgbModal, private moduleService: ModuleService) {
		super();
	}

	ngOnInit(): void {}

	importLayout(importXML: any) {
		console.log({ importXML });
		const data = importXML.value;
		console.log({ data });

		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(data, 'text/xml');

		const plans = xmlDoc.getElementsByTagName('plan');
		const plan = plans[0];

		const stationModules = Array.from(plan.getElementsByTagName('entry')).map((entry: any) => ({
			count: 1,
			moduleId: MACRO_MODULE_MAPPING[entry.getAttribute('macro')],
		}));

    console.log({ stationModules });

		// this.activeModal.close(data);
	}
}
