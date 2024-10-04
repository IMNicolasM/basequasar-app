import baseService from 'src/modules/qcrud/_services/baseService'

export default {
  getData(refresh = false, params = {}, apiRoute: string, id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if(!apiRoute.trim()) {
        reject(new Error("Not found apiRoute"));
      }
      const requestParams = {refresh, params}
      //Request
      baseService.index(apiRoute, requestParams).then(response => {
        resolve({ response, id })
      }).catch(error => reject(error))
    })
  }
}
