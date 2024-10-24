import { computed, reactive, nextTick, onMounted, toRefs, watch } from 'vue';
import services from './services'
import moduleStore from '../../store'
import { clone, i18n } from 'src/plugins/utils';

export default function controller(props: any, emit: any) {
  // States
  const state = reactive({
    cardsData: [],
    loading: false,
    principalRoute: 'apiRoutes.qassignlp.leads',
    defaultFormatCard: {
      icon: {
        props: {
          size: '16px'
        }
      }
    },
    comapnyId: moduleStore.companySelected
    // Key: Default Value
  });

  // Computed
  const computeds = {
    data: computed(() => {
      return [
        {
          id: 1,
          route: state.principalRoute,
          params: {
            filter: {
              onlyCount: true,
              slr_id: { operator: ">", value: "0" },
              apptdate: methods.getUTCDate(),
              order: {
                field: 'slr_id',
                way: 'desc',
              }
            }, take: 1
          },
          format: (item: any) => methods.formatData(item, { icon: 'fa-solid fa-check', desc: 'Leads Assigned Today'})
        },
        {
          id: 2,
          route: state.principalRoute,
          params: {
            filter: {
              onlyCount: true,
              slr_id: { operator: ">", value: "0" },
              apptdate: { from: methods.getUTCDate(7), to: methods.getUTCDate(), operator: 'between' },
              order: {
                field: 'slr_id',
                way: 'desc',
              }
            }, take: 1
          },
          format: (item: any) => methods.formatData(item, { icon: 'fa-solid fa-check', desc: 'Leads Assigned This Week' })
        }
      ];
    })
    // key: computed(() => {})
  };

  // Methods
  const methods = {
    async init() {
      await methods.getData();
    },
    async getData() {
      const company_id = state.comapnyId
      if(!company_id) return

      const requests = [];
      const results = [];
      const firstResults = []
      const routes = computeds.data.value;

      for (const route of routes) {
        requests.push(
          services.getData(true, {...(route.params || {}), filter: {...route.params?.filter || {}, company_id: company_id}}, route.route || '', route.id)
        )
        firstResults.push({})
      }

      state.loading = true
      state.cardsData = firstResults

      // @ts-ignore
      await Promise.allSettled(requests).then(result => {
        result.forEach(res => {
          const { value } = res;
          const route = routes.find(r => r.id == value?.id);
          if(route) {
            results.push({
              ...(route.format ? route.format(value) || {} : {})
            })
          }
        })
      });

      state.cardsData = results;
      state.loading = false
    },
    formatData(item: any, props: any = {}, isDefaultColor = true) {
      let response: any = clone(state.defaultFormatCard);
      response.title = {
        label: i18n.trn(item.response?.meta?.page?.total || 0, null)
      };

      response.icon.name = props.icon || '';

      if (props.desc) {
        response.description = {
          label: `Total number of <br/> <b class=\'tw-text-base tw-leading-5\'>${props.desc}</b>`
        };
      }


      if (!isDefaultColor) {
        response = {
          ...response,
          color: 'tw-text-[#881915]',
          icon: {
            ...response.icon,
            bgStyle: 'background-color: #FCE0DF'
          }
        };
      }
      return response;
    },
    getUTCDate(minusDays = 0) {
      const currentDate = new Date();

      // Subtract the specified number of days
      currentDate.setDate(currentDate.getDate() - minusDays);

      return currentDate.toISOString().replace('T', ' ');
    }
  };

  // Mounted
  onMounted(() => {
    nextTick(async () => {
      await methods.init()
    })
  });

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return { ...(toRefs(state)), ...computeds, ...methods };
}
