import InvoiceController from './InvoiceController'
import VoidInvoiceController from './VoidInvoiceController'
import PaymentController from './PaymentController'
import RefundController from './RefundController'
import ReceiptController from './ReceiptController'
import OutstandingBalanceController from './OutstandingBalanceController'
import CollectionSummaryController from './CollectionSummaryController'
const Controllers = {
    InvoiceController: Object.assign(InvoiceController, InvoiceController),
VoidInvoiceController: Object.assign(VoidInvoiceController, VoidInvoiceController),
PaymentController: Object.assign(PaymentController, PaymentController),
RefundController: Object.assign(RefundController, RefundController),
ReceiptController: Object.assign(ReceiptController, ReceiptController),
OutstandingBalanceController: Object.assign(OutstandingBalanceController, OutstandingBalanceController),
CollectionSummaryController: Object.assign(CollectionSummaryController, CollectionSummaryController),
}

export default Controllers