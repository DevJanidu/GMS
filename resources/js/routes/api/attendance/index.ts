import scans from './scans'
import manual from './manual'
import members from './members'
import live from './live'
import records from './records'
import corrections from './corrections'
import reversals from './reversals'
import settings from './settings'
import qr from './qr'
const attendance = {
    scans: Object.assign(scans, scans),
manual: Object.assign(manual, manual),
members: Object.assign(members, members),
live: Object.assign(live, live),
records: Object.assign(records, records),
corrections: Object.assign(corrections, corrections),
reversals: Object.assign(reversals, reversals),
settings: Object.assign(settings, settings),
qr: Object.assign(qr, qr),
}

export default attendance