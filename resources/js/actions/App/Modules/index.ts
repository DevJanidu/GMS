import AccessControl from './AccessControl'
import Branch from './Branch'
import Gym from './Gym'
import Staff from './Staff'
import Membership from './Membership'
const Modules = {
    AccessControl: Object.assign(AccessControl, AccessControl),
Branch: Object.assign(Branch, Branch),
Gym: Object.assign(Gym, Gym),
Staff: Object.assign(Staff, Staff),
Membership: Object.assign(Membership, Membership),
}

export default Modules