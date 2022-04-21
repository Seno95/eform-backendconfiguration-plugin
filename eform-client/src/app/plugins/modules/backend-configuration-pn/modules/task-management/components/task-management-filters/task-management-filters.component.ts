import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TaskManagementStateService } from '../store';
import { FormControl, FormGroup } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import {
  BackendConfigurationPnPropertiesService,
  BackendConfigurationPnTaskManagementService,
} from '../../../../services';
import { CommonDictionaryModel } from 'src/app/common/models';
import { SitesService } from 'src/app/common/services';
import { format, set } from 'date-fns';

@AutoUnsubscribe()
@Component({
  selector: 'app-task-management-filters',
  templateUrl: './task-management-filters.component.html',
  styleUrls: ['./task-management-filters.component.scss'],
})
export class TaskManagementFiltersComponent implements OnInit, OnDestroy {
  @Output() updateTable: EventEmitter<void> = new EventEmitter<void>();
  private standartDateTimeFormat = `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`;
  filtersForm: FormGroup;
  propertyAreas: string[] = [];
  properties: CommonDictionaryModel[] = [];
  assignedSitesToProperty: CommonDictionaryModel[] = [];

  selectFiltersSub$: Subscription;
  propertyIdValueChangesSub$: Subscription;
  areaNameValueChangesSub$: Subscription;

  constructor(
    public taskManagementStateService: TaskManagementStateService,
    private propertyService: BackendConfigurationPnPropertiesService,
    private sitesService: SitesService,
    private taskManagementService: BackendConfigurationPnTaskManagementService
  ) {}

  ngOnInit(): void {
    this.getProperties();
    this.selectFiltersSub$ = this.taskManagementStateService
      .getFiltersAsync()
      .subscribe((filters) => {
        if (!this.filtersForm) {
          this.filtersForm = new FormGroup({
            propertyId: new FormControl(filters.propertyId),
            areaName: new FormControl({
              value: filters.areaName,
              disabled: !filters.propertyId,
            }),
            createdBy: new FormControl({
              value: filters.createdBy,
              disabled: !filters.propertyId && !filters.areaName,
            }),
            lastAssignedTo: new FormControl({
              value: filters.lastAssignedTo,
              disabled: !filters.propertyId && !filters.areaName,
            }),
            status: new FormControl({
              value: filters.status,
              disabled: !filters.propertyId && !filters.areaName,
            }),
            date: new FormControl({
              value: [filters.dateFrom, filters.dateTo],
              disabled: !filters.propertyId && !filters.areaName,
            }),
          });
          if (filters.propertyId) {
            this.getPropertyAreas(filters.propertyId);
            this.getSites(filters.propertyId);
          }
        }
      });
    this.propertyIdValueChangesSub$ = this.filtersForm
      .get('propertyId')
      .valueChanges.subscribe((value: number) => {
        if (
          this.taskManagementStateService.store.getValue().filters
            .propertyId !== value
        ) {
          this.getPropertyAreas(value);
          this.getSites(value);
          this.taskManagementStateService.store.update((state) => ({
            filters: {
              ...state.filters,
              propertyId: value,
              areaName: null,
              dateFrom: null,
              dateTo: null,
              status: null,
              createdBy: null,
              lastAssignedTo: null,
            },
          }));
          this.filtersForm.get('areaName').enable({ emitEvent: false });
          this.filtersForm
            .get('areaName')
            .setValue(undefined, { emitEvent: false });
          this.filtersForm
            .get('createdBy')
            .setValue(undefined, { emitEvent: false });
          this.filtersForm
            .get('lastAssignedTo')
            .setValue(undefined, { emitEvent: false });
          this.filtersForm
            .get('status')
            .setValue(undefined, { emitEvent: false });
          this.filtersForm.get('date').setValue([], { emitEvent: false });
          this.filtersForm.get('createdBy').disable({ emitEvent: false });
          this.filtersForm.get('lastAssignedTo').disable({ emitEvent: false });
          this.filtersForm.get('status').disable({ emitEvent: false });
          this.filtersForm.get('date').disable({ emitEvent: false });
        }
      });
    this.areaNameValueChangesSub$ = this.filtersForm
      .get('areaName')
      .valueChanges.subscribe((value: string) => {
        if (
          this.taskManagementStateService.store.getValue().filters.areaName !==
          value
        ) {
          this.taskManagementStateService.store.update((state) => ({
            filters: {
              ...state.filters,
              areaName: value,
            },
          }));
        }
        if (value) {
          this.filtersForm.get('createdBy').enable({ emitEvent: false });
          this.filtersForm.get('lastAssignedTo').enable({ emitEvent: false });
          this.filtersForm.get('status').enable({ emitEvent: false });
          this.filtersForm.get('date').enable({ emitEvent: false });
        } else {
          this.filtersForm.get('createdBy').disable({ emitEvent: false });
          this.filtersForm.get('lastAssignedTo').disable({ emitEvent: false });
          this.filtersForm.get('status').disable({ emitEvent: false });
          this.filtersForm.get('date').disable({ emitEvent: false });
        }
      });

    this.filtersForm
      .get('createdBy')
      .valueChanges.subscribe((value: string) => {
        this.taskManagementStateService.store.update((state) => ({
          filters: {
            ...state.filters,
            createdBy: value,
          },
        }));
      });
    this.filtersForm
      .get('lastAssignedTo')
      .valueChanges.subscribe((value: string) => {
        this.taskManagementStateService.store.update((state) => ({
          filters: {
            ...state.filters,
            lastAssignedTo: value,
          },
        }));
      });
    this.filtersForm.get('status').valueChanges.subscribe((value: number) => {
      this.taskManagementStateService.store.update((state) => ({
        filters: {
          ...state.filters,
          status: value,
        },
      }));
    });
    this.filtersForm.get('date').valueChanges.subscribe((value: any[]) => {
      let dateFrom = new Date(value[0]._d);
      let dateTo = new Date(value[1]._d);
      dateFrom = set(dateFrom, {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
      dateTo = set(dateTo, {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
      this.taskManagementStateService.store.update((state) => ({
        filters: {
          ...state.filters,
          dateFrom: format(dateFrom, this.standartDateTimeFormat),
          dateTo: format(dateTo, this.standartDateTimeFormat),
        },
      }));
    });
  }

  getPropertyAreas(propertyId: number) {
    // get entity items
    this.taskManagementService
      .getEntityItemsListByPropertyId(propertyId)
      .subscribe((data) => {
        if (data && data.success && data.model) {
          this.propertyAreas = data.model;
        }
      });
  }

  getProperties() {
    this.propertyService.getAllProperties({
      nameFilter: '',
      sort: 'Id',
      isSortDsc: false,
      pageSize: 100000,
      offset: 0,
      pageIndex: 0
    }).subscribe((data) => {
      if (data && data.success && data.model) {
        this.properties = data.model.entities.filter(x => x.workorderEnable).map(x => {
          return { name: x.name, description: '', id: x.id };
        });
      }
    });
  }

  getSites(propertyId: number) {
    this.sitesService.getAllSitesDictionary().subscribe((result) => {
      if (result && result.success && result.success) {
        const sites = result.model;
        this.propertyService.getPropertiesAssignments().subscribe((data) => {
          if (data && data.success && data.model) {
            data.model.forEach(
              (x) =>
                (x.assignments = x.assignments.filter(
                  (x) => x.isChecked && x.propertyId === propertyId
                ))
            );
            data.model = data.model.filter((x) => x.assignments.length > 0);
            this.assignedSitesToProperty = data.model.map((x) => {
              const site = sites.find((y) => y.id === x.siteId);
              return {
                id: x.siteId,
                name: site ? site.name : '',
                description: '',
              };
            });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {}
}