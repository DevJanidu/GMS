import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PlanStatusController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Http/Controllers/PlanStatusController.php:14
 * @route '/plans/{plan}/status'
 */
export const update = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/plans/{plan}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PlanStatusController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Http/Controllers/PlanStatusController.php:14
 * @route '/plans/{plan}/status'
 */
update.url = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        plan: typeof args.plan === 'object'
                ? args.plan.id
                : args.plan,
                }

    return update.definition.url
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanStatusController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Http/Controllers/PlanStatusController.php:14
 * @route '/plans/{plan}/status'
 */
update.patch = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PlanStatusController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Http/Controllers/PlanStatusController.php:14
 * @route '/plans/{plan}/status'
 */
    const updateForm = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PlanStatusController::update
 * @see F:/2026/projects/gym-management-system/GMSv1/app/Http/Controllers/PlanStatusController.php:14
 * @route '/plans/{plan}/status'
 */
        updateForm.patch = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const PlanStatusController = { update }

export default PlanStatusController