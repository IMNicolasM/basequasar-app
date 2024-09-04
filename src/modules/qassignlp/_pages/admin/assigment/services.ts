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
  }
}
