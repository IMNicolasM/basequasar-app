const moduleName = 'ileads';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  version: moduleVersion,
  assignments: `${urlBase}/assignments`,
  leads: `${urlBase}/leads`,
  employees: `${urlBase}/employees`,
  branches: `${urlBase}/branches`,
  followups: `${urlBase}/followups`,
  rank: `${urlBase}/rank`,
  config: `${urlBase}/config`,
  calc: `${urlBase}/calc`,
  disposition: `${urlBase}/disposition`,
  progress: `${urlBase}/progress`,
}
