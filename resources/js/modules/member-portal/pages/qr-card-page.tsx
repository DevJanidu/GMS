import { Head } from '@inertiajs/react';
import { IdCard } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { memberPortalApi } from '../api/member-portal';
import { PortalPageHeader } from '../components/portal-page-header';
import { PortalState } from '../components/portal-state';
import { useMemberPortalResource } from '../hooks/use-member-portal-resource';

export default function MemberPortalQrCardPage() {
    const resource = useMemberPortalResource(memberPortalApi.qrCard);

    return (
        <>
            <Head title="QR membership card" />
            <PortalPageHeader
                title="QR membership card"
                description="Present this secure card to staff when checking in."
            />
            <PortalState {...resource}>
                {(card) =>
                    card.status === 'ready' &&
                    card.qr_image_data_url?.startsWith('data:image/') ? (
                        <Card className="mx-auto w-full max-w-md overflow-hidden">
                            <CardHeader className="bg-portal-accent text-portal-accent-foreground">
                                <CardTitle>Gym membership</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
                                <img
                                    src={card.qr_image_data_url}
                                    alt="Secure membership QR code"
                                    className="aspect-square w-full max-w-64 rounded-xl border bg-white p-3"
                                />
                                <p className="text-sm text-muted-foreground">
                                    {card.message}
                                </p>
                                {card.expires_at && (
                                    <p className="text-xs text-muted-foreground">
                                        Valid until {card.expires_at}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <EmptyState
                            icon={IdCard}
                            title="QR card unavailable"
                            description={card.message}
                        />
                    )
                }
            </PortalState>
        </>
    );
}
