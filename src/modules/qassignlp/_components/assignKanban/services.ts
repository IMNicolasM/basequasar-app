import baseService from 'src/modules/qcrud/_services/baseService'

const assingRoute = 'apiRoutes.qassignlp.assignments'
export default {
  getAssignments(refresh = false, params = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestParams = {refresh, params}
      //Request
      baseService.index(assingRoute, requestParams).then(response => {
        resolve(response)
      }).catch(error => reject(error))
    })
  }
}
