import permissions from './permissions'
import roles from './roles'
import branches from './branches'
import gym from './gym'
import staff from './staff'
const api = {
    permissions: Object.assign(permissions, permissions),
roles: Object.assign(roles, roles),
branches: Object.assign(branches, branches),
gym: Object.assign(gym, gym),
staff: Object.assign(staff, staff),
}

export default api