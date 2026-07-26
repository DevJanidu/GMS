import MemberPortalController from './MemberPortalController'
import MemberPortalInviteController from './MemberPortalInviteController'
import MemberPortalInvitationController from './MemberPortalInvitationController'
const Controllers = {
    MemberPortalController: Object.assign(MemberPortalController, MemberPortalController),
MemberPortalInviteController: Object.assign(MemberPortalInviteController, MemberPortalInviteController),
MemberPortalInvitationController: Object.assign(MemberPortalInvitationController, MemberPortalInvitationController),
}

export default Controllers