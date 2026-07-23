import AccessControl from './AccessControl'
import Branch from './Branch'
import Gym from './Gym'
import Staff from './Staff'
const Modules = {
    AccessControl: Object.assign(AccessControl, AccessControl),
Branch: Object.assign(Branch, Branch),
Gym: Object.assign(Gym, Gym),
Staff: Object.assign(Staff, Staff),
}

export default Modules