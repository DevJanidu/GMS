import permissions from './permissions'
import roles from './roles'
import billing from './billing'
import branches from './branches'
import dashboard from './dashboard'
import gym from './gym'
import staff from './staff'
const api = {
    permissions: Object.assign(permissions, permissions),
roles: Object.assign(roles, roles),
billing: Object.assign(billing, billing),
branches: Object.assign(branches, branches),
dashboard: Object.assign(dashboard, dashboard),
gym: Object.assign(gym, gym),
staff: Object.assign(staff, staff),
}

export default api