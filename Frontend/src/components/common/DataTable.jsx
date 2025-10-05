import { useState, useMemo } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { ChevronUp, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
    return (
        <input
            value={globalFilter || ''}
            onChange={e => setGlobalFilter(e.target.value || undefined)}
            placeholder={`Search records...`}
            className="input input-bordered w-full max-w-xs mb-4"
        />
    );
};
const DataTable = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
    } = useTable(
        { columns, data, initialState: { pageIndex: 0, pageSize: 5 } },
        useGlobalFilter,
        useSortBy,
        usePagination
    );
    return (
        <div className="card bg-base-100 shadow-xl p-4">
            <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            <div className="overflow-x-auto">
                <table {...getTableProps()} className="table table-zebra w-full">
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? <ChevronDown className="inline w-4 h-4 ml-1" /> : <ChevronUp className="inline w-4 h-4 ml-1" />) : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <button className="btn btn-sm" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        <ChevronsLeft />
                    </button>
                    <button className="btn btn-sm" onClick={() => previousPage()} disabled={!canPreviousPage}>
                       <ChevronLeft />
                    </button>
                    <button className="btn btn-sm" onClick={() => nextPage()} disabled={!canNextPage}>
                        <ChevronRight />
                    </button>
                    <button className="btn btn-sm" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                       <ChevronsRight />
                    </button>
                </div>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <select
                    className="select select-bordered select-sm"
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                >
                    {[5, 10, 20].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
export default DataTable;
