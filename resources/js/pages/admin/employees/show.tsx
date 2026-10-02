import { Head, Link } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import admin from '@/routes/admin';
import type { EmployeeProfile } from '@/types';

export default function EmployeeShow({
    employee,
}: {
    employee: EmployeeProfile;
}) {
    return (
        <>
            <Head title={employee.candidate.full_name} />
            <div className="space-y-6 p-4 sm:p-6">
                <AdminPageHeader
                    title={employee.candidate.full_name}
                    description={
                        employee.employee_number ?? 'No employee number yet'
                    }
                    action={<StatusBadge status={employee.status} />}
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Employment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <dl className="grid gap-3 text-sm sm:grid-cols-2">
                                <div>
                                    <dt className="text-muted-foreground">
                                        Specialty
                                    </dt>
                                    <dd className="font-medium text-foreground">
                                        {employee.specialty ?? '—'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Pay Rate
                                    </dt>
                                    <dd className="font-medium text-foreground">
                                        {employee.pay_rate
                                            ? `$${employee.pay_rate}/hr`
                                            : '—'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Hire Date
                                    </dt>
                                    <dd className="font-medium text-foreground">
                                        {new Date(
                                            employee.hire_date,
                                        ).toLocaleDateString()}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Source Application
                                    </dt>
                                    <dd className="font-medium text-foreground">
                                        {employee.application ? (
                                            <Link
                                                href={admin.candidates.show(
                                                    employee.candidate.id,
                                                )}
                                                className="text-primary hover:underline"
                                            >
                                                {employee.application
                                                    .job_listing?.title ??
                                                    'General Application'}
                                            </Link>
                                        ) : (
                                            '—'
                                        )}
                                    </dd>
                                </div>
                            </dl>

                            {employee.status === 'terminated' && (
                                <>
                                    <Separator />
                                    <div className="text-sm">
                                        <p className="text-muted-foreground">
                                            Terminated{' '}
                                            {employee.terminated_at &&
                                                new Date(
                                                    employee.terminated_at,
                                                ).toLocaleDateString()}
                                        </p>
                                        {employee.termination_reason && (
                                            <p className="mt-1 text-muted-foreground">
                                                {employee.termination_reason}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="text-foreground">
                                {employee.candidate.email}
                            </p>
                            <p className="text-muted-foreground">
                                {employee.candidate.phone ?? 'No phone on file'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Credentials & Compliance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {employee.candidate.credentials.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No credentials on file.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {employee.candidate.credentials.map(
                                    (credential) => {
                                        const isExpiringSoon =
                                            credential.expiry_date &&
                                            new Date(
                                                credential.expiry_date,
                                            ).getTime() -
                                                Date.now() <
                                                90 * 24 * 60 * 60 * 1000;

                                        return (
                                            <div
                                                key={credential.id}
                                                className="rounded-md border border-border p-2 text-sm"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            {
                                                                credential.credential_name
                                                            }
                                                        </p>
                                                        {credential.expiry_date && (
                                                            <p
                                                                className={
                                                                    isExpiringSoon
                                                                        ? 'text-xs font-medium text-amber-600'
                                                                        : 'text-xs text-muted-foreground'
                                                                }
                                                            >
                                                                Expires{' '}
                                                                {new Date(
                                                                    credential.expiry_date,
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <StatusBadge
                                                        status={
                                                            credential.verification_status
                                                        }
                                                    />
                                                </div>

                                                {credential.expiry_notifications
                                                    .length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1.5 border-t border-border pt-2">
                                                        {credential.expiry_notifications.map(
                                                            (notification) => (
                                                                <StatusBadge
                                                                    key={
                                                                        notification.id
                                                                    }
                                                                    status={
                                                                        notification.stage
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Shift Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {employee.shift_assignments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No shift assignments yet.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {employee.shift_assignments.map(
                                    (assignment) => (
                                        <Link
                                            key={assignment.id}
                                            href={admin.shifts.show(
                                                assignment.shift.id,
                                            )}
                                            className="flex items-center justify-between rounded-md border border-border p-2 text-sm hover:bg-muted/50"
                                        >
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {
                                                        assignment.shift
                                                            .facility.name
                                                    }
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        assignment.shift
                                                            .shift_date,
                                                    ).toLocaleDateString()}{' '}
                                                    ·{' '}
                                                    {
                                                        assignment.shift
                                                            .start_time
                                                    }{' '}
                                                    –{' '}
                                                    {assignment.shift.end_time}
                                                </p>
                                            </div>
                                            <StatusBadge
                                                status={assignment.status}
                                            />
                                        </Link>
                                    ),
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EmployeeShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Employees', href: admin.employees.index() },
    ],
};
