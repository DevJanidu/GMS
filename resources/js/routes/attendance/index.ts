import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import records from './records'
import corrections from './corrections'
/**
 * @see app/Modules/Attendance/web.php:11
 * @route '/attendance/scanner'
 */
export const scanner = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scanner.url(options),
    method: 'get',
})

scanner.definition = {
    methods: ["get","head"],
    url: '/attendance/scanner',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Attendance/web.php:11
 * @route '/attendance/scanner'
 */
scanner.url = (options?: RouteQueryOptions) => {
    return scanner.definition.url + queryParams(options)
}

/**
 * @see app/Modules/Attendance/web.php:11
 * @route '/attendance/scanner'
 */
scanner.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scanner.url(options),
    method: 'get',
})
/**
 * @see app/Modules/Attendance/web.php:11
 * @route '/attendance/scanner'
 */
scanner.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scanner.url(options),
    method: 'head',
})

    /**
 * @see app/Modules/Attendance/web.php:11
 * @route '/attendance/scanner'
 */
    const scannerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: scanner.url(options),
        method: 'get',
    })

            /**
 * @see app/Modules/Attendance/web.php:11
 * @route '/attendance/scanner'
 */
        scannerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scanner.url(options),
            method: 'get',
        })
            /**
 * @see app/Modules/Attendance/web.php:11
 * @route '/attendance/scanner'
 */
        scannerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scanner.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    scanner.form = scannerForm
/**
 * @see app/Modules/Attendance/web.php:15
 * @route '/attendance/manual'
 */
export const manual = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manual.url(options),
    method: 'get',
})

manual.definition = {
    methods: ["get","head"],
    url: '/attendance/manual',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Attendance/web.php:15
 * @route '/attendance/manual'
 */
manual.url = (options?: RouteQueryOptions) => {
    return manual.definition.url + queryParams(options)
}

/**
 * @see app/Modules/Attendance/web.php:15
 * @route '/attendance/manual'
 */
manual.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manual.url(options),
    method: 'get',
})
/**
 * @see app/Modules/Attendance/web.php:15
 * @route '/attendance/manual'
 */
manual.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manual.url(options),
    method: 'head',
})

    /**
 * @see app/Modules/Attendance/web.php:15
 * @route '/attendance/manual'
 */
    const manualForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: manual.url(options),
        method: 'get',
    })

            /**
 * @see app/Modules/Attendance/web.php:15
 * @route '/attendance/manual'
 */
        manualForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manual.url(options),
            method: 'get',
        })
            /**
 * @see app/Modules/Attendance/web.php:15
 * @route '/attendance/manual'
 */
        manualForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: manual.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    manual.form = manualForm
/**
 * @see app/Modules/Attendance/web.php:16
 * @route '/attendance/live'
 */
export const live = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: live.url(options),
    method: 'get',
})

live.definition = {
    methods: ["get","head"],
    url: '/attendance/live',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Attendance/web.php:16
 * @route '/attendance/live'
 */
live.url = (options?: RouteQueryOptions) => {
    return live.definition.url + queryParams(options)
}

/**
 * @see app/Modules/Attendance/web.php:16
 * @route '/attendance/live'
 */
live.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: live.url(options),
    method: 'get',
})
/**
 * @see app/Modules/Attendance/web.php:16
 * @route '/attendance/live'
 */
live.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: live.url(options),
    method: 'head',
})

    /**
 * @see app/Modules/Attendance/web.php:16
 * @route '/attendance/live'
 */
    const liveForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: live.url(options),
        method: 'get',
    })

            /**
 * @see app/Modules/Attendance/web.php:16
 * @route '/attendance/live'
 */
        liveForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: live.url(options),
            method: 'get',
        })
            /**
 * @see app/Modules/Attendance/web.php:16
 * @route '/attendance/live'
 */
        liveForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: live.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    live.form = liveForm
/**
 * @see app/Modules/Attendance/web.php:17
 * @route '/attendance/history'
 */
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/attendance/history',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Attendance/web.php:17
 * @route '/attendance/history'
 */
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
 * @see app/Modules/Attendance/web.php:17
 * @route '/attendance/history'
 */
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})
/**
 * @see app/Modules/Attendance/web.php:17
 * @route '/attendance/history'
 */
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

    /**
 * @see app/Modules/Attendance/web.php:17
 * @route '/attendance/history'
 */
    const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: history.url(options),
        method: 'get',
    })

            /**
 * @see app/Modules/Attendance/web.php:17
 * @route '/attendance/history'
 */
        historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url(options),
            method: 'get',
        })
            /**
 * @see app/Modules/Attendance/web.php:17
 * @route '/attendance/history'
 */
        historyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    history.form = historyForm
/**
 * @see app/Modules/Attendance/web.php:26
 * @route '/attendance/settings'
 */
export const settings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})

settings.definition = {
    methods: ["get","head"],
    url: '/attendance/settings',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see app/Modules/Attendance/web.php:26
 * @route '/attendance/settings'
 */
settings.url = (options?: RouteQueryOptions) => {
    return settings.definition.url + queryParams(options)
}

/**
 * @see app/Modules/Attendance/web.php:26
 * @route '/attendance/settings'
 */
settings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})
/**
 * @see app/Modules/Attendance/web.php:26
 * @route '/attendance/settings'
 */
settings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: settings.url(options),
    method: 'head',
})

    /**
 * @see app/Modules/Attendance/web.php:26
 * @route '/attendance/settings'
 */
    const settingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: settings.url(options),
        method: 'get',
    })

            /**
 * @see app/Modules/Attendance/web.php:26
 * @route '/attendance/settings'
 */
        settingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: settings.url(options),
            method: 'get',
        })
            /**
 * @see app/Modules/Attendance/web.php:26
 * @route '/attendance/settings'
 */
        settingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: settings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    settings.form = settingsForm
const attendance = {
    scanner: Object.assign(scanner, scanner),
manual: Object.assign(manual, manual),
live: Object.assign(live, live),
history: Object.assign(history, history),
records: Object.assign(records, records),
corrections: Object.assign(corrections, corrections),
settings: Object.assign(settings, settings),
}

export default attendance