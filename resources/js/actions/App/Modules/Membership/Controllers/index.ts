import MembershipController from './MembershipController'
import MembershipRenewalController from './MembershipRenewalController'
import MembershipFreezeController from './MembershipFreezeController'
import MembershipResumeController from './MembershipResumeController'
import MembershipSuspensionController from './MembershipSuspensionController'
import MembershipCancellationController from './MembershipCancellationController'
import MembershipReactivationController from './MembershipReactivationController'
import RenewalDashboardController from './RenewalDashboardController'
import MembershipExpiringController from './MembershipExpiringController'
import MembershipExpiredController from './MembershipExpiredController'
import MembershipGraceController from './MembershipGraceController'
import MembershipReminderController from './MembershipReminderController'
const Controllers = {
    MembershipController: Object.assign(MembershipController, MembershipController),
MembershipRenewalController: Object.assign(MembershipRenewalController, MembershipRenewalController),
MembershipFreezeController: Object.assign(MembershipFreezeController, MembershipFreezeController),
MembershipResumeController: Object.assign(MembershipResumeController, MembershipResumeController),
MembershipSuspensionController: Object.assign(MembershipSuspensionController, MembershipSuspensionController),
MembershipCancellationController: Object.assign(MembershipCancellationController, MembershipCancellationController),
MembershipReactivationController: Object.assign(MembershipReactivationController, MembershipReactivationController),
RenewalDashboardController: Object.assign(RenewalDashboardController, RenewalDashboardController),
MembershipExpiringController: Object.assign(MembershipExpiringController, MembershipExpiringController),
MembershipExpiredController: Object.assign(MembershipExpiredController, MembershipExpiredController),
MembershipGraceController: Object.assign(MembershipGraceController, MembershipGraceController),
MembershipReminderController: Object.assign(MembershipReminderController, MembershipReminderController),
}

export default Controllers