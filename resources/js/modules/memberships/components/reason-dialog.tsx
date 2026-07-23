import { useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function ReasonDialog({
    trigger,
    title,
    description,
    confirmLabel = 'Confirm',
    destructive = false,
    reasonRequired = true,
    action,
    extraField,
}: {
    trigger: ReactNode;
    title: string;
    description: string;
    confirmLabel?: string;
    destructive?: boolean;
    reasonRequired?: boolean;
    action: string;
    extraField?: ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const { data, setData, patch, processing, errors, reset } = useForm({
        reason: '',
    });

    function submit() {
        patch(action, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <Label htmlFor="reason">
                        Reason{!reasonRequired && ' (optional)'}
                    </Label>
                    <Textarea
                        id="reason"
                        value={data.reason}
                        onChange={(e) => setData('reason', e.target.value)}
                        placeholder="Explain why this action is being taken"
                    />
                    {errors.reason && (
                        <p className="text-sm text-destructive">
                            {errors.reason}
                        </p>
                    )}
                </div>

                {extraField}

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant={destructive ? 'destructive' : 'default'}
                        onClick={submit}
                        disabled={processing}
                    >
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
