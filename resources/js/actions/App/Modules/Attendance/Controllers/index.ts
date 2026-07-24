import AttendanceScanController from './AttendanceScanController'
import ManualAttendanceController from './ManualAttendanceController'
import AttendanceMemberSearchController from './AttendanceMemberSearchController'
import LiveAttendanceController from './LiveAttendanceController'
import AttendanceRecordController from './AttendanceRecordController'
import AttendanceCorrectionController from './AttendanceCorrectionController'
import AttendanceReversalController from './AttendanceReversalController'
import AttendanceSettingsController from './AttendanceSettingsController'
import QrCredentialController from './QrCredentialController'
const Controllers = {
    AttendanceScanController: Object.assign(AttendanceScanController, AttendanceScanController),
ManualAttendanceController: Object.assign(ManualAttendanceController, ManualAttendanceController),
AttendanceMemberSearchController: Object.assign(AttendanceMemberSearchController, AttendanceMemberSearchController),
LiveAttendanceController: Object.assign(LiveAttendanceController, LiveAttendanceController),
AttendanceRecordController: Object.assign(AttendanceRecordController, AttendanceRecordController),
AttendanceCorrectionController: Object.assign(AttendanceCorrectionController, AttendanceCorrectionController),
AttendanceReversalController: Object.assign(AttendanceReversalController, AttendanceReversalController),
AttendanceSettingsController: Object.assign(AttendanceSettingsController, AttendanceSettingsController),
QrCredentialController: Object.assign(QrCredentialController, QrCredentialController),
}

export default Controllers