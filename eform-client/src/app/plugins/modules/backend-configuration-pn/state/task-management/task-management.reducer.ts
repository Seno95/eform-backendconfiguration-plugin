import {CommonPaginationState} from 'src/app/common/models';
import {Action, createReducer, on} from '@ngrx/store';
import {
  taskManagementUpdateFilters,
  taskManagementUpdatePagination
} from './task-management.actions';

export interface TaskManagementFiltrationModel {
  propertyId: number;
  areaName?: string;
  createdBy?: string;
  lastAssignedTo?: number;
  statuses: number[];
  dateFrom?: Date | string;
  dateTo?: Date | string;
  priority?: number;
  delayed: boolean;
}

export interface TaskManagementState {
  pagination: CommonPaginationState;
  filters: TaskManagementFiltrationModel;
  // total: number;
}

export const taskManagementInitialState: TaskManagementState = {
  pagination: {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    offset: 0,
    pageIndex: 0,
    total: 0,
  },
  filters: {
    propertyId: null,
    areaName: null,
    createdBy: null,
    dateFrom: null,
    dateTo: null,
    delayed: null,
    lastAssignedTo: null,
    priority: null,
    statuses: [],
  },
};

export const _taskManagementReducer = createReducer(
  taskManagementInitialState,
  on(taskManagementUpdateFilters, (state, {payload}) => ({
      ...state,
      filters: {...state.filters, ...payload},
    }
  )),
  on(taskManagementUpdatePagination, (state, {payload}) => ({
      ...state,
      pagination: {...state.pagination, ...payload},
    }
  )),
);

export function taskManagementReducer(state: TaskManagementState | undefined, action: Action) {
  return _taskManagementReducer(state, action);
}
