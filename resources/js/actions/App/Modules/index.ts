import AccessControl from './AccessControl'
import Attendance from './Attendance'
import Audit from './Audit'
import Billing from './Billing'
import Branch from './Branch'
import Dashboard from './Dashboard'
import Gym from './Gym'
import MemberPortal from './MemberPortal'
import Notification from './Notification'
import Report from './Report'
import Staff from './Staff'
import Membership from './Membership'
const Modules = {
    AccessControl: Object.assign(AccessControl, AccessControl),
Attendance: Object.assign(Attendance, Attendance),
Audit: Object.assign(Audit, Audit),
Billing: Object.assign(Billing, Billing),
Branch: Object.assign(Branch, Branch),
Dashboard: Object.assign(Dashboard, Dashboard),
Gym: Object.assign(Gym, Gym),
MemberPortal: Object.assign(MemberPortal, MemberPortal),
Notification: Object.assign(Notification, Notification),
Report: Object.assign(Report, Report),
Staff: Object.assign(Staff, Staff),
Membership: Object.assign(Membership, Membership),
}

export default Modules