import Settings from './Settings'
import MemberController from './MemberController'
import MemberStatusController from './MemberStatusController'
import MemberDocumentController from './MemberDocumentController'
import PlanController from './PlanController'
import PlanStatusController from './PlanStatusController'
import PlanCloneController from './PlanCloneController'
const Controllers = {
    Settings: Object.assign(Settings, Settings),
MemberController: Object.assign(MemberController, MemberController),
MemberStatusController: Object.assign(MemberStatusController, MemberStatusController),
MemberDocumentController: Object.assign(MemberDocumentController, MemberDocumentController),
PlanController: Object.assign(PlanController, PlanController),
PlanStatusController: Object.assign(PlanStatusController, PlanStatusController),
PlanCloneController: Object.assign(PlanCloneController, PlanCloneController),
}

export default Controllers