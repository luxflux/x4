import { ComponentBase } from '../../shared/components/component-base';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../shared/components/confirm.component';
import { StationModule } from '../../shared/services/model/model';
import { ModuleService } from '../../shared/services/module.service';
import { Layout, ModuleConfig } from '../../shared/services/module-config';
import { AllModules } from '../../shared/services/data/modules-data';
import { ModuleTypes } from '../../shared/services/data/module-types-data';

@Component({
	templateUrl: './import-layout.component.html',
})
export class ImportLayoutComponent extends ComponentBase implements OnInit {
  plans = [];

	constructor(public activeModal: NgbActiveModal, private modal: NgbModal, private moduleService: ModuleService) {
		super();
	}

  analyzeXML(xmlTextarea: any) {
    const xmlDoc = this.parseXML(xmlTextarea);

		const plans = xmlDoc.getElementsByTagName('plan');

    this.plans = Array.from(plans).map((plan: any) => ({
      id: plan.getAttribute('id'),
      name: plan.getAttribute('name'),
    }));
  }

  private parseXML(htmlEntity: any) {
		const data = htmlEntity.value;

		const parser = new DOMParser();
		return parser.parseFromString(data, 'text/xml');
  }

	importLayout(xmlTextarea: any, planIdSelector: any) {
    const xmlDoc = this.parseXML(xmlTextarea);
    const planId = planIdSelector.value;

		const plans = xmlDoc.getElementsByTagName('plan');
		const plan = xmlDoc.getElementById(planId);
    const stationName = plan.getAttribute('name');

    const stationModules = {};

		Array.from(plan.getElementsByTagName('entry')).map((entry: any) => {
      const macro = entry.getAttribute('macro');
      const stationModule = AllModules.find(module => module.macroName == macro);
      const stationModuleId = stationModule.id;
      if (stationModule.type === ModuleTypes.connectionmodule) return;
      if (!stationModules[stationModuleId]) stationModules[stationModuleId] = 0;

      stationModules[stationModuleId] += 1;
    });

    const moduleConfig = Object.keys(stationModules).map<ModuleConfig>(moduleId => {
      const count = stationModules[moduleId];
      return ({ moduleId, count });
    })

		this.activeModal.close({
      name: stationName,
      config: moduleConfig,
    });
	}
}
