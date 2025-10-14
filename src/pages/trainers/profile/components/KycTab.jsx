import React from 'react';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';

// Helper component for displaying a piece of info
const InfoItem = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
        <div className="text-foreground font-medium">{value || 'N/A'}</div>
    </div>
);

// Helper for KYC status badge
const KycStatusBadge = ({ status }) => {
    const getConfig = (s) => {
        switch (s?.toLowerCase()) {
            case 'complete':
                return { className: 'bg-green-100 text-green-800 border-green-200', icon: 'CheckCircle' };
            case 'pending':
                return { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: 'Clock' };
            case 'failed':
            case 'rejected':
                return { className: 'bg-red-100 text-red-800 border-red-200', icon: 'XCircle' };
            default:
                return { className: 'bg-gray-100 text-gray-800 border-gray-200', icon: 'HelpCircle' };
        }
    };
    const config = getConfig(status);
    return (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', config.className)}>
            <Icon name={config.icon} size={12} className="mr-1.5" />
            {status || 'Unknown'}
        </span>
    );
};

const KycTab = ({ trainer }) => {
    return (
        <div className="space-y-8">
            {/* --- Identification & Address --- */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Identification & Address</h3>
                    <KycStatusBadge status={trainer?.kyc_status} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoItem label="ID Type" value={trainer?.id_type} />
                    <InfoItem label="ID Number" value={trainer?.id_number} />
                    <InfoItem label="Address Line" value={trainer?.address_line} />
                    <InfoItem label="City" value={trainer?.city} />
                    <InfoItem label="Postal Code" value={trainer?.postal_code} />
                </div>
            </div>

            {/* --- Bank Account Details --- */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Bank Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoItem label="Bank Account Name" value={trainer?.bank_account_name} />
                    <InfoItem label="Account Number" value={trainer?.account_number} />
                    <InfoItem label="IBAN" value={trainer?.iban} />
                    <InfoItem label="SWIFT Code" value={trainer?.swift} />
                </div>
            </div>
        </div>
    );
};

export default KycTab;