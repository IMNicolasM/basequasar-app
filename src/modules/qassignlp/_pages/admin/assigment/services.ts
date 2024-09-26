import baseService from 'src/modules/qcrud/_services/baseService'

export default {
  getData(apiRoute = '', refresh = false, params = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestParams = {refresh, params}
      //Request
      baseService.index(apiRoute, requestParams).then(response => {
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  calculateAndUpdate(body = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      //Request
      baseService.post('apiRoutes.qassignlp.calc', body).then(response => {
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  recalculateLeads(body = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      //Request
      baseService.post('apiRoutes.qassignlp.progress', body).then(response => {
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  bulkCalculateDist(body = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      //Request
      // @ts-ignore
      baseService.post(`${config('apiRoutes.qassignlp.calc')}/bulk`, body).then(response => {
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  updateLead(id, body) {
    return new Promise((resolve, reject) => {
      baseService.update('apiRoutes.qassignlp.assignments', id, body).then(response => {
        resolve(response)
      }).catch(error => reject(error))
    })
  },
  leadBulkCreateOrUpdate(leads: any[] = []) {
    return new Promise((resolve, reject) => {
      //Request
      // @ts-ignore
      baseService.post(`${config('apiRoutes.qassignlp.assignments')}/bulk/update`, {attributes: leads}).then(response => {
        resolve(true);
      }).catch(error => reject(error));
    });
  }
}
