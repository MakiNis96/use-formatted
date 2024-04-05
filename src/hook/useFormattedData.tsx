import { useCallback, useEffect, useState } from "react";

type FilterFunction = (item: any) => boolean
type SortFunction = (item1: any, item2: any) => number

interface Actions {
  search: (value: string) => Actions,
  filter: (filterFunction: FilterFunction) => Actions
  sortBy: (param: string | SortFunction) => Actions
}

interface FormattedDataReturn extends Actions {
  formatted: any[],
}

export default function useFormattedData(data: any[]): FormattedDataReturn {

  const [formattedData, setFormattedData] = useState<any[]>(data)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filterFunction, setFilterFunction] = useState<FilterFunction>()
  const [sortByParam, setSortByParam] = useState<string | SortFunction>()

  useEffect(() => {
    let filteredData = data

    if (searchQuery) {
      filteredData = filteredData.filter(item => 
        Object.values(item).some((value: any) => typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (filterFunction) {
      filteredData = filteredData.filter(filterFunction)
    }

    if (sortByParam) {
      if (typeof sortByParam === 'string') {
        filteredData.sort((a, b) => a[sortByParam] > b[sortByParam] ? 1 : -1)
      } else {
        filteredData.sort(sortByParam)
      }
    }

    setFormattedData([...filteredData])
  }, [searchQuery, filterFunction, sortByParam, data])
  
  const search = useCallback((query: string): Actions => {
    setSearchQuery(query)
    return actions
  }, [formattedData])

  const filter = useCallback((filterFunction: FilterFunction): Actions => {
    setFilterFunction(() => filterFunction)
    return actions
  }, [formattedData])

  const sortBy = useCallback((param: string | SortFunction): Actions => {
    if (typeof param === 'string') {
      setSortByParam(param)
    } else {
      setSortByParam(() => param)
    }
    return actions
  }, [formattedData])

  const actions = {
    search,
    filter,
    sortBy
  }

  return {
    formatted: formattedData,
    ...actions
  };
}
