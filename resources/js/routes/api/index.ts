import permissions from './permissions'
import roles from './roles'
import attendance from './attendance'
import auditLogs from './audit-logs'
import billing from './billing'
import branches from './branches'
import dashboard from './dashboard'
import gym from './gym'
import memberPortal from './member-portal'
import notificationTemplates from './notification-templates'
import notificationRules from './notification-rules'
import notificationDeliveries from './notification-deliveries'
import announcements from './announcements'
import notifications from './notifications'
import notificationPreferences from './notification-preferences'
import reports from './reports'
import reportExports from './report-exports'
import staff from './staff'
const api = {
    permissions: Object.assign(permissions, permissions),
roles: Object.assign(roles, roles),
attendance: Object.assign(attendance, attendance),
auditLogs: Object.assign(auditLogs, auditLogs),
billing: Object.assign(billing, billing),
branches: Object.assign(branches, branches),
dashboard: Object.assign(dashboard, dashboard),
gym: Object.assign(gym, gym),
memberPortal: Object.assign(memberPortal, memberPortal),
notificationTemplates: Object.assign(notificationTemplates, notificationTemplates),
notificationRules: Object.assign(notificationRules, notificationRules),
notificationDeliveries: Object.assign(notificationDeliveries, notificationDeliveries),
announcements: Object.assign(announcements, announcements),
notifications: Object.assign(notifications, notifications),
notificationPreferences: Object.assign(notificationPreferences, notificationPreferences),
reports: Object.assign(reports, reports),
reportExports: Object.assign(reportExports, reportExports),
staff: Object.assign(staff, staff),
}

export default api