const moduleName = 'ileads';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  version: moduleVersion,
  assignments: `${urlBase}/assignments`,
  employees: `${urlBase}/employees`
}
