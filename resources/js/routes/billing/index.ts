import invoices from './invoices'
import payments from './payments'
import receipts from './receipts'
import outstanding from './outstanding'
import collections from './collections'
const billing = {
    invoices: Object.assign(invoices, invoices),
payments: Object.assign(payments, payments),
receipts: Object.assign(receipts, receipts),
outstanding: Object.assign(outstanding, outstanding),
collections: Object.assign(collections, collections),
}

export default billing