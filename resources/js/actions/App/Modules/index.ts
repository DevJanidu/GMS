import AccessControl from './AccessControl'
import Billing from './Billing'
import Branch from './Branch'
import Dashboard from './Dashboard'
import Gym from './Gym'
import MemberPortal from './MemberPortal'
import Staff from './Staff'
import Membership from './Membership'
const Modules = {
    AccessControl: Object.assign(AccessControl, AccessControl),
Billing: Object.assign(Billing, Billing),
Branch: Object.assign(Branch, Branch),
Dashboard: Object.assign(Dashboard, Dashboard),
Gym: Object.assign(Gym, Gym),
MemberPortal: Object.assign(MemberPortal, MemberPortal),
Staff: Object.assign(Staff, Staff),
Membership: Object.assign(Membership, Membership),
}

export default Modules