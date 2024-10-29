const moduleName = 'ilead';
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
  rank: `${urlBase}/ranks`,
  config: `${urlBase}/config-leads`,
  calc: `${urlBase}/leads/calc`,
  slots: `${urlBase}/leads/slots`,
  disposition: `${urlBase}/dispositions`,
  sources: `${urlBase}/sources`,
  progress: `${urlBase}/leads/anr-progress`,
}
