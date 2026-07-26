import { Head } from '@inertiajs/react';
import jsQR from 'jsqr';
import {
    Camera,
    CameraOff,
    CheckCircle2,
    Keyboard,
    XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ApiRequestError } from '@/lib/api/client';
import { attendanceApi } from '../api/attendance';
import { OverrideDialog } from '../components/override-dialog';
import type { AttendanceReason, AttendanceResult } from '../types';

type CameraState =
    'idle' | 'requesting' | 'scanning' | 'denied' | 'unsupported';
type BarcodeDetectorLike = {
    detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]>;
};
type BarcodeDetectorConstructor = new (options: {
    formats: string[];
}) => BarcodeDetectorLike;

/**
 * The native BarcodeDetector (Shape Detection API) only exists in
 * Chromium browsers — Safari and Firefox never shipped it. jsQR (pure JS,
 * decodes from canvas pixel data) is the fallback so scanning still works
 * on an iPad/iPhone front desk, just a little slower per frame.
 */
function detectViaJsQr(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
): { rawValue: string }[] {
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context || video.videoWidth === 0) {
        return [];
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(frame.data, frame.width, frame.height);

    return code ? [{ rawValue: code.data }] : [];
}

export default function ScannerPage({ branchId }: { branchId: number | null }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const frameRef = useRef<number | null>(null);
    const detectorRef = useRef<BarcodeDetectorLike | null>(null);
    const detectingRef = useRef(false);
    const [cameraState, setCameraState] = useState<CameraState>('idle');
    const [manualToken, setManualToken] = useState('');
    const [lastToken, setLastToken] = useState('');
    const [result, setResult] = useState<AttendanceResult | null>(null);
    const [reason, setReason] = useState<AttendanceReason | null>(null);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [overrideOpen, setOverrideOpen] = useState(false);

    const stopCamera = useCallback(() => {
        if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
        }

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setCameraState((state) => (state === 'scanning' ? 'idle' : state));
    }, []);

    const submitToken = useCallback(
        async (token: string, overrideReason?: string) => {
            if (!token || submitting) {
                return;
            }

            stopCamera();
            setSubmitting(true);
            setResult(null);
            setReason(null);
            setMessage('');
            setLastToken(token);

            try {
                const response = await attendanceApi.scan(
                    {
                        qr_token: token,
                        request_id: crypto.randomUUID(),
                        source: 'phone_camera',
                        device_id: getDeviceId(),
                        action: 'auto',
                        override: Boolean(overrideReason),
                        override_reason: overrideReason,
                    },
                    branchId,
                );
                setResult(response.data);
                setMessage(
                    response.data.result === 'checked_out'
                        ? 'Member checked out.'
                        : 'Member checked in.',
                );
            } catch (error) {
                if (error instanceof ApiRequestError) {
                    const code = error.errors?.reason_code?.[0] as
                        AttendanceReason | undefined;
                    setReason(code ?? 'invalid_qr');
                    setMessage(error.message);
                } else {
                    setReason('invalid_qr');
                    setMessage('The scan could not be processed.');
                }
            } finally {
                setSubmitting(false);
            }
        },
        [branchId, stopCamera, submitting],
    );

    const scanFrame = useCallback(
        async function scanCurrentFrame() {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!video || !canvas || cameraState !== 'scanning') {
                return;
            }

            if (!detectingRef.current && video.readyState >= 2) {
                detectingRef.current = true;

                try {
                    const codes = detectorRef.current
                        ? await detectorRef.current.detect(video)
                        : detectViaJsQr(video, canvas);

                    if (codes[0]?.rawValue) {
                        await submitToken(codes[0].rawValue);

                        return;
                    }
                } catch {
                    // A frame can fail while the camera warms up; keep scanning.
                } finally {
                    detectingRef.current = false;
                }
            }

            frameRef.current = requestAnimationFrame(() => {
                void scanCurrentFrame();
            });
        },
        [cameraState, submitToken],
    );

    // Cleanup here only cancels the pending scan frame — it must NOT stop
    // the media stream. This effect re-runs on every cameraState change
    // (idle -> requesting -> scanning), and if its cleanup stopped the
    // stream too, the stream startCamera just opened would be killed the
    // instant cameraState flipped to 'scanning', immediately bouncing the
    // UI back to "Camera is stopped."
    useEffect(() => {
        if (cameraState === 'scanning') {
            frameRef.current = requestAnimationFrame(scanFrame);
        }

        return () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, [cameraState, scanFrame]);

    // Only stop the actual camera hardware when the page itself unmounts.
    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        };
    }, []);

    async function startCamera() {
        if (!navigator.mediaDevices?.getUserMedia) {
            setCameraState('unsupported');

            return;
        }

        // Prefer the native BarcodeDetector (Chrome/Edge) when present; it's
        // faster and runs off-thread. Safari/Firefox fall through to jsQR,
        // decoded from a canvas each frame in scanCurrentFrame.
        const Detector = (
            window as typeof window & {
                BarcodeDetector?: BarcodeDetectorConstructor;
            }
        ).BarcodeDetector;

        setResult(null);
        setReason(null);
        setCameraState('requesting');

        try {
            detectorRef.current = Detector
                ? new Detector({ formats: ['qr_code'] })
                : null;
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' } },
                audio: false,
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setCameraState('scanning');
        } catch {
            setCameraState('denied');
        }
    }

    return (
        <>
            <Head title="QR attendance scanner" />
            <main className="mx-auto grid w-full max-w-6xl gap-6 p-4 sm:p-6 lg:grid-cols-[2fr_1fr]">
                <section className="space-y-4">
                    <header>
                        <h1 className="text-2xl font-semibold">QR scanner</h1>
                        <p className="text-sm text-muted-foreground">
                            Use this phone’s rear camera to securely check
                            members in.
                        </p>
                    </header>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black">
                        <video
                            ref={videoRef}
                            className="size-full object-cover"
                            muted
                            playsInline
                            aria-label="QR scanner camera"
                        />
                        <canvas ref={canvasRef} className="hidden" aria-hidden />
                        {cameraState !== 'scanning' && (
                            <div className="absolute inset-0 grid place-items-center text-center text-white">
                                <div className="space-y-3">
                                    {cameraState === 'unsupported' ? (
                                        <CameraOff className="mx-auto size-10" />
                                    ) : (
                                        <Camera className="mx-auto size-10" />
                                    )}
                                    <p>
                                        {cameraState === 'requesting'
                                            ? 'Requesting camera permission…'
                                            : cameraState === 'denied'
                                              ? 'Camera permission was denied.'
                                              : cameraState === 'unsupported'
                                                ? 'QR camera scanning is not supported by this browser.'
                                                : 'Camera is stopped.'}
                                    </p>
                                    <Button
                                        onClick={startCamera}
                                        disabled={cameraState === 'requesting'}
                                    >
                                        {cameraState === 'denied'
                                            ? 'Try camera again'
                                            : 'Start camera'}
                                    </Button>
                                </div>
                            </div>
                        )}
                        {cameraState === 'scanning' && (
                            <div className="pointer-events-none absolute inset-[12%] rounded-2xl border-2 border-white/80" />
                        )}
                    </div>
                    {result && (
                        <Alert className="border-emerald-500 bg-emerald-50 text-emerald-950">
                            <CheckCircle2 />
                            <AlertTitle>{message}</AlertTitle>
                            <AlertDescription>
                                {result.member.display_name} ·{' '}
                                {result.member.member_number}
                                {result.override_applied &&
                                    ' · Manager override recorded'}
                            </AlertDescription>
                        </Alert>
                    )}
                    {reason && (
                        <Alert variant="destructive">
                            <XCircle />
                            <AlertTitle>{message}</AlertTitle>
                            <AlertDescription>
                                Reason: {reason.replaceAll('_', ' ')}
                                {isOverridable(reason) && (
                                    <Button
                                        className="mt-3"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setOverrideOpen(true)}
                                    >
                                        Manager override
                                    </Button>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}
                </section>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Keyboard className="size-4" />
                            Camera fallback
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Paste a QR value when camera decoding is
                            unavailable.
                        </p>
                        <Input
                            aria-label="QR token"
                            value={manualToken}
                            onChange={(event) =>
                                setManualToken(event.target.value)
                            }
                            placeholder="Paste secure QR value"
                        />
                        <Button
                            className="w-full"
                            disabled={!manualToken.trim() || submitting}
                            onClick={() => submitToken(manualToken.trim())}
                        >
                            Process QR
                        </Button>
                    </CardContent>
                </Card>
            </main>
            <OverrideDialog
                open={overrideOpen}
                reasonCode={reason}
                onClose={() => setOverrideOpen(false)}
                onConfirm={(overrideReason) => {
                    setOverrideOpen(false);
                    void submitToken(lastToken, overrideReason);
                }}
            />
        </>
    );
}

function getDeviceId(): string {
    const key = 'gms-attendance-device';
    const current = localStorage.getItem(key);

    if (current) {
        return current;
    }

    const created = crypto.randomUUID();
    localStorage.setItem(key, created);

    return created;
}

function isOverridable(reason: AttendanceReason): boolean {
    return [
        'membership_expired',
        'membership_frozen',
        'membership_suspended',
        'branch_not_allowed',
        'plan_access_denied',
        'visit_limit_reached',
    ].includes(reason);
}
