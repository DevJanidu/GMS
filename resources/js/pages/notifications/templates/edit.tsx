import TemplateFormPage from '@/modules/notifications/pages/templates/template-form-page';

export default function EditTemplate({ templateId }: { templateId: number }) {
    return <TemplateFormPage templateId={templateId} />;
}
