import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const InvoicesTab = ({ invoices }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCoursesModal, setShowCoursesModal] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Failed':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredInvoices = invoices?.filter(invoice =>
        !searchTerm ||
        invoice?.invoiceNo?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        invoice?.status?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    const handleInvoiceClick = (invoiceId) => {
        // Navigate to invoice details
        console.log('Navigate to invoice:', invoiceId);
    };

    const handleDownloadInvoice = (e, invoiceId) => {
        e?.stopPropagation();
        // Download invoice
        console.log('Download invoice:', invoiceId);
    };

    const handleViewCourses = (e, invoice) => {
        e?.stopPropagation();
        setShowCoursesModal(invoice);
    };

    return (
        <div className="space-y-6">
            {/* Header and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-foreground">Invoice History</h3>

                <div className="w-full sm:w-64">
                    <Input
                        type="text"
                        placeholder="Search invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e?.target?.value)}
                        icon="Search"
                    />
                </div>
            </div>
            {/* Invoices List */}
            {filteredInvoices?.length === 0 ? (
                <div className="text-center py-8">
                    <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        {searchTerm ? 'No invoices found matching your search' : 'No invoices available'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredInvoices?.map(invoice => (
                        <div
                            key={invoice?.id}
                            className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => handleInvoiceClick(invoice?.id)}
                        >
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Icon name="FileText" size={20} className="text-blue-600" />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-medium text-foreground">{invoice?.invoiceNo}</h4>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice?.status)}`}>
                        {invoice?.status}
                      </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        Issue Date: {new Date(invoice?.issueDate)?.toLocaleDateString()}
                      </span>

                                            {invoice?.paidDate && (
                                                <span className="flex items-center gap-1">
                          <Icon name="CheckCircle" size={14} />
                          Paid: {new Date(invoice?.paidDate)?.toLocaleDateString()}
                        </span>
                                            )}

                                            <span className="flex items-center gap-1">
                        <Icon name="BookOpen" size={14} />
                                                {invoice?.numberOfCourses} Course{invoice?.numberOfCourses > 1 ? 's' : ''}
                      </span>

                                            {invoice?.vat > 0 && (
                                                <span className="flex items-center gap-1">
                          <Icon name="Calculator" size={14} />
                          VAT: ${invoice?.vat?.toFixed(2)}
                        </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                    <div className="text-right">
                                        <div className="font-semibold text-lg text-foreground">
                                            ${invoice?.totalAmount?.toFixed(2)}
                                        </div>
                                        {invoice?.discount > 0 && (
                                            <div className="text-sm text-green-600">
                                                Discount: -${invoice?.discount?.toFixed(2)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => handleViewCourses(e, invoice)}
                                            className="flex items-center gap-2"
                                        >
                                            <Icon name="List" size={14} />
                                            Courses
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => handleDownloadInvoice(e, invoice?.id)}
                                            className="flex items-center gap-2"
                                        >
                                            <Icon name="Download" size={14} />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Courses Modal */}
            {showCoursesModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-card rounded-lg border border-border max-w-md w-full max-h-[80vh] overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-border">
                            <h3 className="text-lg font-semibold text-foreground">
                                Invoice Courses
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowCoursesModal(null)}
                                className="h-8 w-8 p-0"
                            >
                                <Icon name="X" size={16} />
                            </Button>
                        </div>

                        <div className="p-4">
                            <div className="mb-4">
                                <div className="text-sm text-muted-foreground mb-1">Invoice Number</div>
                                <div className="font-medium text-foreground">{showCoursesModal?.invoiceNo}</div>
                            </div>

                            <div className="space-y-3">
                                <div className="text-sm font-medium text-foreground">Courses Included:</div>
                                {showCoursesModal?.courses?.map((course, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded">
                                        <div className="font-medium text-foreground">{course?.title}</div>
                                        <div className="text-muted-foreground">${course?.price?.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-border">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-foreground">Total Amount:</span>
                                    <span className="font-semibold text-lg text-foreground">
                    ${showCoursesModal?.totalAmount?.toFixed(2)}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoicesTab;