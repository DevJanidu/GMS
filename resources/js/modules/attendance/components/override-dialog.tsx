import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function OverrideDialog({
    open,
    reasonCode,
    onClose,
    onConfirm,
}: {
    open: boolean;
    reasonCode: string | null;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}) {
    const [reason, setReason] = useState('');

    return (
        <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manager override</DialogTitle>
                    <DialogDescription>
                        Override {reasonCode?.replaceAll('_', ' ')} only when
                        policy permits. This action is permanently recorded.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="override-reason">Reason</Label>
                    <Textarea
                        id="override-reason"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        maxLength={500}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        disabled={reason.trim().length < 3}
                        onClick={() => onConfirm(reason.trim())}
                    >
                        Apply audited override
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
