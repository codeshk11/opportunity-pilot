import { queryOptions } from '@tanstack/react-query'

import { getProfile } from '../api'
import { PROFILE_QUERY_KEY } from '../constants'

// The signed-in student's profile. Route loaders await it, so the query
// function does not read the abort signal.
export const profileQueryOptions = queryOptions({
  queryKey: [PROFILE_QUERY_KEY.profile],
  queryFn: () => getProfile(),
})
