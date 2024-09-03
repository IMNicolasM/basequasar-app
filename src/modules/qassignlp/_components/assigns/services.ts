import baseService from 'src/modules/qcrud/_services/baseService'

export default {
  calculateAndUpdate(body = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      //Request
      baseService.post('apiRoutes.qassignlp.calc', body).then(response => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }
}
