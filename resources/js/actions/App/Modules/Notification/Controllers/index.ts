import NotificationTemplateController from './NotificationTemplateController'
import NotificationRuleController from './NotificationRuleController'
import NotificationDeliveryController from './NotificationDeliveryController'
import AnnouncementController from './AnnouncementController'
import NotificationCenterController from './NotificationCenterController'
import NotificationPreferenceController from './NotificationPreferenceController'
const Controllers = {
    NotificationTemplateController: Object.assign(NotificationTemplateController, NotificationTemplateController),
NotificationRuleController: Object.assign(NotificationRuleController, NotificationRuleController),
NotificationDeliveryController: Object.assign(NotificationDeliveryController, NotificationDeliveryController),
AnnouncementController: Object.assign(AnnouncementController, AnnouncementController),
NotificationCenterController: Object.assign(NotificationCenterController, NotificationCenterController),
NotificationPreferenceController: Object.assign(NotificationPreferenceController, NotificationPreferenceController),
}

export default Controllers