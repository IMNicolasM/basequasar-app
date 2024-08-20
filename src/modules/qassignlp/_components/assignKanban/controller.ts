import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance} from "vue";
import service from './services'
import store from './store'
import _ from "lodash";

export default function controller(props: any, emit: any) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    loading: false
    // Key: Default Value
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
  }

  // Methods
  const methods = {
    async getData(refresh = false, filter = {}, pagination: any = false) {
      let propParams = this.$clone(this.params);
      this.loading = true;

    },
    async getData({ pagination, filter }, refresh = false) {
      let propParams = this.$clone(this.params);
      this.loading = true;

      //Reset selected Rows
      this.selectedRows = [];
      this.selectedRowsAll = false;

      //Params to request
      let params = {
        refresh: refresh,
        params: propParams.read.requestParams || {}
      };
      //add params
      if (!params.params.filter) params.params.filter = {};
      params.params.filter = { ...params.params.filter, ...this.table.filter, ...filter };
      this.removeEmptyFilters(params.params.filter);
      params.params.page = pagination.page;
      params.params.take = this.readShowAs !== 'drag' ? pagination.rowsPerPage : 9999;
      //Set order by
      if (!params.params.filter || !params.params.filter.order) {
        let sortBy = pagination.sortBy || 'id';

        // checks if sortBy is in read.requestParams.notToSnakeCase
        if (!params.params?.notToSnakeCase?.includes(sortBy)) {
          sortBy = this.$helper.convertStringToSnakeCase(sortBy);
        }

        params.params.filter.order = {
          field: sortBy,
          way: (pagination.descending != undefined) ? (pagination.descending ? 'desc' : 'asc') : 'desc'
        };
      }

      //Merge with params from prop
      if (propParams.read.params && Object.keys(propParams.read.params).length) {
        Object.keys(propParams.read.params).forEach(key => {
          params.params[key] = Object.assign({}, params.params[key], propParams.read.params[key]);
        });
      }

      //Request
      const response = await this.requestDataTable(propParams.apiRoute, params, pagination);
      this.expiresIn = response?.expiresIn;
      let dataTable = response?.data;
      //If is field change format
      if (this.params.field) {
        dataTable = (response?.data[0] && response?.data[0]?.value) ? response?.data[0]?.value : [];
        this.dataField = response?.data[0];
      }

      //Set data to table
      this.table.data = this.$clone(dataTable);
      const folderList = foldersStore().transformDataToDragableForderList(dataTable);
      this.folderList = _.orderBy(folderList, 'position', 'asc');
      this.table.pagination.page = this.$clone(response?.meta.page.currentPage);
      this.table.pagination.rowsNumber = this.$clone(response?.meta.page.total);
      this.table.pagination.rowsPerPage = this.$clone(pagination.rowsPerPage);
      this.table.pagination.sortBy = this.$clone(pagination.sortBy);
      this.table.pagination.descending = this.$clone(pagination.descending);

      //Sync master filter
      const filterValues = this.getDynamicFilterValues;
      if (filterValues['search']) {
        this.table.filter.search = filterValues['search'];
      }

      //Dispatch event hook
      this.$hook.dispatchEvent('wasListed', { entityName: this.params.entityName });
      //Sync data to drag view
      this.dataTableDraggable = this.getDataTableDraggable;
      //Close loading
      this.loading = false;
    },
  }

  // Mounted
  onMounted(() => {
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods, store}
}
