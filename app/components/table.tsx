
"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IoIosArrowDown } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdCopyAll, MdDelete } from "react-icons/md";

import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    MdOutlineKeyboardArrowDown,
    MdKeyboardDoubleArrowRight,
    MdKeyboardDoubleArrowLeft,
} from "react-icons/md";

// Helper function to extract text from ReactNode
const getNodeText = (node: ReactNode): string => {
    if (["string", "number"].includes(typeof node)) return String(node);
    if (node instanceof Array) return node.map(getNodeText).join("");
    if (typeof node === "object" && node) {
        // @ts-expect-error - accessing props is safe here
        return getNodeText(node.props?.children);
    }
    return "";
};

//Types
type TableProps<TRow extends Record<string, ReactNode>> = {
    sortOrder?: "asc" | "desc";
    setSortOrder?: Dispatch<SetStateAction<"asc" | "desc">>;
    sort?: {
        defaultProperty: keyof TRow;
    };
    showSortingButtons?: boolean;
    notFoundText?: string;
    description?: string;
    emptyDataText?: string;
    headers: Record<string, ReactNode>;
    search?: {
        placeholder?: string;
        searchValue: string;
        setSearchValue: (value: string) => void;
        keyToSearchBy: keyof TRow;
        hideSearchInput?: boolean;
    };
    callToAction?: ReactNode;
    showCheckboxes?: {
        enable: boolean;
        onDeleteButtonClicked?: (selectedRows: TRow[]) => void;
    };
    rows?: TRow[];
    title?: string;
    isLoading?: boolean;
    skeletonRowCount?: number;
    filterBy?: Array<keyof TRow>;
    showActionsColumn?: boolean;
    dropDownItems?: DropdownMenu<TRow>;
    columnsToHide?: Array<keyof TRow>;
    onRowClick?: (row: TRow) => void;
    clickableColumns?: Array<keyof TRow>;
    pagination?: { rowsPerPage: number; paginationRowsArray?: Array<number> };
    className?: string;
    showBorderLine?: boolean;
    enableStripedRows?: boolean;
    rowHeight?: number;
};

export type DropdownMenu<TRow extends Record<string, ReactNode>> = {
    trigger?: React.ReactNode;

    items: {
        className?: string;
        icon?: React.ReactNode;
        label: string;
        onClick: (row: TRow) => void;
        separator?: boolean;
    }[];
};

export type Pagination = {
    currentPage: number;
    rowsPerPage: number;
};

// filter content functional component
const FilterContent = <TRow extends Record<string, ReactNode>>({
    rows,
    filterKey,
    filters,
    onFilterChange,
}: {
    rows: TRow[];
    filterKey: keyof TRow;
    filters: string[];
    onFilterChange: (values: string[]) => void;
}) => {
    const uniqueValuesWithCounts = useMemo(() => {
        const valueCounts: Record<string, number> = {};

        rows.forEach((row) => {
            const value = getNodeText(row[filterKey]);
            if (value) {
                valueCounts[value] = (valueCounts[value] || 0) + 1;
            }
        });

        return Object.entries(valueCounts)
            .map(([value, count]) => ({ value, count }))
            .sort((a, b) => a.value.localeCompare(b.value));
    }, [rows, filterKey]);

    const handleCheckboxChange = (value: string, isChecked: boolean) => {
        const newFilters = [...filters];
        if (isChecked) {
            newFilters.push(value);
        } else {
            const index = newFilters.indexOf(value);
            if (index > -1) {
                newFilters.splice(index, 1);
            }
        }
        onFilterChange(newFilters);
    };

    return (
        <div className="space-y-2">
            <>
                {uniqueValuesWithCounts.map(({ value, count }) => (
                    <div
                        key={value}
                        className="flex items-center justify-between h-9 cursor-pointer p-2"
                    >
                        <div className="flex items-center space-x-2 ">
                            <Checkbox
                                id={`filter-${filterKey as string}-${value}`}
                                checked={filters.includes(value)}
                                onCheckedChange={(checked) =>
                                    handleCheckboxChange(value, checked === true)
                                }
                                className="w-5 h-5 rounded-[4px]"
                            />
                            <Label htmlFor={`filter-${filterKey as string}-${value}`}>
                                {value}
                            </Label>
                        </div>
                        <Badge variant={"secondary"} className="text-xs  ">
                            {count}
                        </Badge>
                    </div>
                ))}
            </>
            <div>
                <Separator className="w-full h-[1px]" />
                <Button
                    onClick={() => onFilterChange([])}
                    variant={"ghost"}
                    className="w-full mt-3 h-10"
                >
                    Clear Filter
                </Button>
            </div>
        </div>
    );
};

//Main functional component
export function DataTable<TRow extends Record<string, ReactNode>>({
    className = "",
    headers,
    columnsToHide,
    clickableColumns,
    search,
    sort,
    showSortingButtons = false,
    rows = [],
    title,
    notFoundText = "No results found",
    emptyDataText = "No data available",
    isLoading = false,
    skeletonRowCount = 5,
    callToAction,
    filterBy,
    showActionsColumn = false,
    description,
    onRowClick,
    pagination,
    showBorderLine = false,
    showCheckboxes = { enable: false, onDeleteButtonClicked: () => { } },
    enableStripedRows = false,
    rowHeight = 60,
    dropDownItems = {
        trigger: (
            <Button variant={"ghost"} className="text-lg">
                ...
            </Button>
        ),
        items: [
            {
                label: "Copy",
                icon: <MdCopyAll />,
                onClick: () => {
                    console.log("you clicked on copy!");
                },
            },
            {
                label: "Delete",
                className: "text-red-600",
                icon: <MdDelete />,
                separator: true,
                onClick: () => {
                    console.log("you clicked on delete");
                },
            },
        ],
    },
}: TableProps<TRow>) {
    // states
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [internalSortOrder, setInternalSortOrder] = useState<"asc" | "desc">(
        "desc"
    );
    const [internalPagination, setInternalPagination] = useState<Pagination>({
        currentPage: 1,
        rowsPerPage: pagination?.rowsPerPage || 10,
    });

    // Add this state near your other state declarations
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    const [selectedCount, setSelectedCount] = useState(0);

    // Use props if provided, otherwise use internal state
    const currentSortOrder = sortOrder ?? internalSortOrder;
    const setCurrentSortOrder = setSortOrder ?? setInternalSortOrder;

    //add the action  column to header if showactioncolumn is set to true
    const enhancedHeaders = useMemo(() => {
        let newHeaders = headers;
        if (showActionsColumn) {
            newHeaders = { ...newHeaders, actions: "Actions" };
        }
        if (showCheckboxes.enable) {
            newHeaders = { checkbox: "", ...newHeaders };
        }
        return newHeaders;
    }, [showActionsColumn, showCheckboxes, headers]);

    //add the actions proprety to each row
    const enhancedRows = useMemo(() => {
        if (!showActionsColumn || rows.length === 0) return rows;
        return rows.map((row) => ({
            ...row,
            actions: (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {dropDownItems.trigger}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {dropDownItems.items.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.separator && <DropdownMenuSeparator />}
                                <DropdownMenuItem
                                    className={`h-10 ${item.className}`}
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        //Check if the id key is in the row object

                                        item.onClick(row);
                                    }}
                                >
                                    {item.icon && <span className="mr-2">{item.icon}</span>}
                                    {item.label}
                                </DropdownMenuItem>
                            </React.Fragment>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        }));
    }, [showActionsColumn, dropDownItems, rows]);
    //show or hide the columns
    const columnKeys = useMemo(() => {
        const allColumns = Object.keys(enhancedHeaders);
        // Remove checkbox from columnsToHide consideration since it's handled separately
        const filteredColumnsToHide =
            columnsToHide?.filter((col) => col !== "checkbox") || [];

        const visibleColumns = filteredColumnsToHide.length
            ? allColumns.filter(
                (column) => !filteredColumnsToHide.includes(column as keyof TRow)
            )
            : allColumns;

        return visibleColumns;
    }, [columnsToHide, enhancedHeaders]);

    //Length of each column
    const columnsLength = columnKeys.length;

    const [selectedColumn, setSelectedColumn] = useState<string | null>(() => {
        // If sort prop is provided with a property, use that
        if (sort?.defaultProperty) return sort.defaultProperty as string;

        // Otherwise find the first non-actions column key
        const availableColumns = columnKeys.filter((key) => key !== "actions");
        return availableColumns.length > 0 ? availableColumns[0] : null;
    });

    const handleFilterChange = (key: keyof TRow, values: string[]) => {
        setFilters((prev) => ({
            ...prev,
            [key as string]: values,
        }));
    };

    //   filter rows
    const filteredRows = useMemo(() => {
        let result = enhancedRows;

        if (search) {
            result = result.filter((row) => {
                const searchValue = search.searchValue.toLowerCase();
                const rowValue = row[search.keyToSearchBy];
                const textContent = getNodeText(rowValue).toLowerCase();
                return textContent.includes(searchValue);
            });
        }

        if (filterBy) {
            result = result.filter((row) => {
                return filterBy.every((key) => {
                    if (!filters[key as string]?.length) return true;
                    const rowValue = getNodeText(row[key]);
                    return filters[key as string].includes(rowValue);
                });
            });
        }

        return result;
    }, [enhancedRows, search, filterBy, filters]);

    // Always derive the active sort property from selectedColumn so user interactions control sorting
    const internalSort = useMemo(() => {
        return { defaultProperty: selectedColumn as keyof TRow };
    }, [selectedColumn]);

    //   sort rows
    const sortedRows = useMemo(() => {
        if (!internalSort?.defaultProperty) return filteredRows;

        return [...filteredRows].sort((a, b) => {
            const aValue = getNodeText(a[internalSort.defaultProperty]);
            const bValue = getNodeText(b[internalSort.defaultProperty]);

            if (aValue === bValue) return 0;
            const comparison = aValue.localeCompare(bValue);
            return currentSortOrder === "asc" ? comparison : -comparison;
        });
    }, [filteredRows, selectedColumn, currentSortOrder, internalSort]);

    //   calculate the paginated rows
    const paginatedRows = useMemo(() => {
        if (!pagination) return sortedRows;

        const startIndex =
            (internalPagination.currentPage - 1) * internalPagination.rowsPerPage;
        const endIndex = startIndex + internalPagination.rowsPerPage;
        return sortedRows.slice(startIndex, endIndex);
    }, [sortedRows, internalPagination, pagination]);

    //calculate the total pages
    const totalPages = useMemo(() => {
        if (!pagination) return 1;
        return Math.ceil(sortedRows.length / internalPagination.rowsPerPage);
    }, [sortedRows, internalPagination.rowsPerPage, pagination]);

    //handler to go to the next page
    const goToNextPage = () => {
        if (internalPagination.currentPage < totalPages) {
            setInternalPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
            }));
        }
    };

    //handler to go to the prev page
    const goToPrevPage = () => {
        if (internalPagination.currentPage > 1) {
            setInternalPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage - 1,
            }));
        }
    };

    function goToTheFirstPage() {
        setInternalPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));
    }

    function goToTheLastPage() {
        setInternalPagination((prev) => ({
            ...prev,
            currentPage: totalPages,
        }));
    }

    //Update the internal pagination state when searching, or filtering, or update the rows array
    useEffect(() => {
        setInternalPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));
    }, [filters, search?.searchValue, rows]);

    const initialFilters = useRef(filters);

    //Reset the filters only when the filteredRows is empty
    useEffect(() => {
        // Only reset if we're not already at initial state and we have filters
        if (
            filteredRows.length === 0 &&
            Object.keys(filters).length > 0 &&
            JSON.stringify(filters) !== JSON.stringify(initialFilters.current)
        ) {
            setFilters(initialFilters.current);
        }
    }, [filteredRows.length, filters]);

    //   getSortIcon function
    const getSortIcon = (key: string) => {
        if (!internalSort || internalSort.defaultProperty !== key)
            return <ArrowUpDown className="ml-2 h-3 w-3" />;
        return currentSortOrder === "asc" ? (
            <ArrowUp className="ml-2 h-3 w-3" />
        ) : (
            <ArrowDown className="ml-2 h-3 w-3" />
        );
    };

    const skeletonRows = Array.from({ length: skeletonRowCount }).map(
        (_, index) => (
            <TableRow key={`skeleton-${index}`} className="border-none rounded-sm">
                {showCheckboxes.enable && (
                    <TableCell className="h-12 border-none rounded-sm">
                        <Skeleton className="h-5 w-5 rounded" />
                    </TableCell>
                )}
                {columnKeys.map((key) => (
                    <TableCell
                        key={`skeleton-${index}-${key}`}
                        className="h-12 border-none rounded-sm"
                    >
                        <Skeleton className="h-5 w-full rounded" />
                    </TableCell>
                ))}
            </TableRow>
        )
    );

    const renderEmptyState = (message: string) => (
        <TableRow>
            <TableCell
                colSpan={columnsLength}
                className="h-24 text-center border-none"
            >
                {message}
            </TableCell>
        </TableRow>
    );

    const renderTableContent = () => {
        if (isLoading) return skeletonRows;
        if (enhancedRows.length === 0) return renderEmptyState(emptyDataText);
        if (sortedRows.length === 0) return renderEmptyState(notFoundText);

        const rowsToRender = pagination ? paginatedRows : sortedRows;

        return rowsToRender.map((row, rowIndex) => {
            const rowId = row.id?.toString() || rowIndex.toString(); // Use row.id if available, otherwise fall back to index

            const isRowSelected = !!selectedRows[rowId];

            const stripedRows =
                rowIndex % 2 === 0
                    ? "bg-white dark:bg-neutral-900"
                    : "bg-neutral-50 dark:bg-neutral-800";

            return (
                <TableRow
                    key={rowIndex}
                    style={{ height: `${rowHeight}px` }}
                    className={`${showBorderLine === false && "border-none"} ${enableStripedRows && stripedRows
                        }   `}
                >
                    {showCheckboxes.enable && (
                        <TableCell
                            style={{ height: "34px" }}
                            className="whitespace-nowrap h-11 border-none"
                        >
                            <Checkbox
                                checked={selectedRows[rowId] || false}
                                className="h-4 w-4 rounded-[3px]"
                                onCheckedChange={(checked) => {
                                    setSelectedRows((prev) => {
                                        const newSelected = {
                                            ...prev,
                                            [rowId]: checked as boolean,
                                        };
                                        setSelectedCount(
                                            Object.keys(newSelected).filter((k) => newSelected[k])
                                                .length
                                        );
                                        return newSelected;
                                    });
                                }}
                            />
                        </TableCell>
                    )}
                    {columnKeys.map((key) => {
                        const isColumnClickable = clickableColumns
                            ? clickableColumns.includes(key as keyof TRow)
                            : false;

                        return (
                            <TableCell
                                onClick={() => {
                                    if (isColumnClickable && onRowClick) {
                                        onRowClick(row);
                                    }
                                }}
                                key={`${rowIndex}-${key}`}
                                className={`whitespace-nowrap h-11 border-none ${isColumnClickable
                                    ? "cursor-pointer hover:underline hover:text-primary"
                                    : ""
                                    } ${isRowSelected && "bg-primary/5"}`}
                            >
                                {row[key]}
                            </TableCell>
                        );
                    })}
                </TableRow>
            );
        });
    };

    const allFilterItems = Object.values(filters).flat();

    function SortByMenu() {
        const handleSortChange = (column: string) => {
            // If user clicks the already-selected column, toggle order
            if (selectedColumn === column) {
                setCurrentSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            } else {
                // Switch to new column and reset sort order to desc by default
                setSelectedColumn(column);
                setCurrentSortOrder("desc");
            }
        };

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="link"
                        className="flex items-center gap-2 text-neutral-700"
                    >
                        {/* <Rows3Icon className="h-4 w-4" /> */}
                        {selectedColumn &&
                            selectedColumn?.charAt(0).toUpperCase() +
                            selectedColumn?.slice(1)}
                        <IoIosArrowDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="">
                    {columnKeys
                        .filter(
                            (singleColumnKey) =>
                                singleColumnKey !== "actions" && singleColumnKey !== "checkbox"
                        )
                        .map((singleColumnKey) => (
                            <DropdownMenuCheckboxItem
                                className="h-10 px-7"
                                key={singleColumnKey}
                                checked={selectedColumn === singleColumnKey}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        handleSortChange(singleColumnKey);
                                    }
                                }}
                            >
                                {singleColumnKey.charAt(0).toUpperCase() +
                                    singleColumnKey.slice(1)}
                            </DropdownMenuCheckboxItem>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    function SortOrderToggle() {
        return (
            <ToggleGroup
                value={currentSortOrder}
                type="single"
                className="ml-2 border rounded-md p-0.5 h-9 bg-background"
                onValueChange={(value) => {
                    if (value) setCurrentSortOrder(value as "asc" | "desc");
                }}
            >
                <ToggleGroupItem
                    value="asc"
                    aria-label="Sort ascending"
                    className="px-3 py-1 text-xs h-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted"
                >
                    <ArrowUp className="h-3 w-3 mr-1.5" />
                    Asc
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="desc"
                    aria-label="Sort descending"
                    className="px-3 py-1 text-xs h-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted"
                >
                    <ArrowDown className="h-3 w-3 mr-1.5" />
                    Desc
                </ToggleGroupItem>
            </ToggleGroup>
        );
    }

    // Clear or reconcile selections when data changes
    useEffect(() => {
        const currentRowIds = sortedRows.map(
            (row, index) => row.id?.toString() || index.toString()
        );

        // Filter out selections that no longer exist in current data
        const newSelected = Object.keys(selectedRows)
            .filter((id) => currentRowIds.includes(id))
            .reduce(
                (acc, id) => {
                    acc[id] = selectedRows[id];
                    return acc;
                },
                {} as Record<string, boolean>
            );

        if (Object.keys(newSelected).length !== Object.keys(selectedRows).length) {
            setSelectedRows(newSelected);
            setSelectedCount(Object.values(newSelected).filter(Boolean).length);
        }
    }, [sortedRows, selectedRows]);

    return (
        <Card
            className={`border rounded-xl h-full flex flex-col   p-3 ${className}`}
        >
            <div
                className="flex justify-between items-center px-3 mb-3 max-sm:flex-col 
      max-sm:items-start  "
            >
                <div className="py-3 mb-3 w-1/2">
                    <h2 className="font-semibold text-2xl text-gray-800 dark:text-white">
                        {title}
                    </h2>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        {description && description}
                    </span>
                </div>

                {/* SEARCH INPUT */}
                <div className="flex items-start gap-3 w-1/2     justify-end max-sm:justify-start max-sm:w-full">
                    {search && (
                        <div
                            className={`w-[75%] ${search.hideSearchInput && "invisible"
                                } flex gap-3 justify-end max-sm:justify-start relative`}
                        >
                            <Input
                                placeholder={search.placeholder}
                                className="h-10 "
                                value={search.searchValue}
                                onChange={(e) => search.setSearchValue(e.target.value)}
                            />
                            {search.searchValue.trim().length > 0 && (
                                <IoCloseSharp
                                    onClick={() => search.setSearchValue("")}
                                    className="absolute right-3 top-3 opacity-65 cursor-pointer"
                                />
                            )}
                        </div>
                    )}
                    {callToAction && callToAction}
                </div>
            </div>

            <div className="h-full ">
                <div className="flex gap-3 items-center mb-3 flex-wrap">
                    <div className="flex items-center gap-2  ">
                        {/* FILTER BUTTONS SECTIONS */}
                        {filterBy && (
                            <div className="w-full flex justify-between px-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-md w-25 text-gray-600 dark:text-gray-400">
                                        Filter By
                                    </span>
                                    {/* hide the filter buttons based on if it is found in the columnsToHide array */}
                                    {filterBy
                                        .filter((key) => !columnsToHide?.includes(key))
                                        //   render the rest
                                        .map((option) => {
                                            // number of active filters
                                            const activeFilters =
                                                filters[option as string]?.length || 0;

                                            return (
                                                <Popover key={option as string}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            disabled={rows.length === 0}
                                                            variant="outline"
                                                            className="flex items-center gap-1"
                                                        >
                                                            {(option as string).charAt(0).toUpperCase() +
                                                                (option as string).slice(1)}
                                                            {activeFilters > 0 && (
                                                                <span className="text-xs bg-primary mr-2 text-primary-foreground rounded-full px-2 py-0.5">
                                                                    {activeFilters}
                                                                </span>
                                                            )}
                                                            <IoIosArrowDown />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-48 p-2 max-h-60 overflow-y-auto">
                                                        <FilterContent
                                                            rows={enhancedRows}
                                                            filterKey={option}
                                                            filters={filters[option as string] || []}
                                                            onFilterChange={(values) =>
                                                                handleFilterChange(option, values)
                                                            }
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            );
                                        })}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* SORTING BUTTONS */}
                    {showSortingButtons && (
                        <div className="flex items-center justify-between   max-w-fit">
                            {sort && (
                                <div className="flex justify-between items-center  pr-3">
                                    <div className="flex items-center gap-2">
                                        {/* <Separator className="h-9 w-[2px]" /> */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Sort By
                                            </span>
                                            <SortByMenu />
                                            <SortOrderToggle />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {allFilterItems.length > 0 && (
                                <Button
                                    onClick={() => {
                                        setFilters({});
                                    }}
                                    className=""
                                    variant={"link"}
                                >
                                    Reset All
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* RENDER THE TABLE */}
                <div className="overflow-x-auto px-3">
                    {/* Row selection UI container */}
                    {selectedCount > 0 && (
                        <div className="h-10 w-full bg-primary/5 mb-3 flex items-center justify-between px-4 text-sm">
                            <div>
                                {selectedCount} row(s) selected
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="ml-auto"
                                    onClick={() => {
                                        setSelectedRows({});
                                        setSelectedCount(0);
                                    }}
                                >
                                    Clear selection
                                </Button>
                            </div>
                            <Button
                                variant={"ghost"}
                                onClick={() => {
                                    if (showCheckboxes.onDeleteButtonClicked) {
                                        // Get the actual selected row data
                                        const selectedRowData = sortedRows.filter((row, index) => {
                                            const rowId = row.id?.toString() || index.toString();
                                            return selectedRows[rowId];
                                        });
                                        showCheckboxes.onDeleteButtonClicked(selectedRowData);
                                        setSelectedRows({});
                                        setSelectedCount(0);
                                    }
                                }}
                                className="hover:bg-inherit hover:text-primary text-primary"
                            >
                                <RiDeleteBin6Line />
                            </Button>
                        </div>
                    )}

                    {/*  */}
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow className="bg-primary/5 text-primary dark:bg-primary/20 border-none">
                                {showCheckboxes.enable && (
                                    <TableHead className="whitespace-nowrap  text-[12px] rounded-l-md text-gray-500 dark:text-white uppercase tracking-wider">
                                        <Checkbox
                                            className="h-4 w-4 rounded-[3px]"
                                            checked={
                                                Object.keys(selectedRows).length > 0 &&
                                                Object.keys(selectedRows).length === sortedRows.length
                                            }
                                            onCheckedChange={(checked) => {
                                                const newSelected: Record<string, boolean> = {};
                                                if (checked) {
                                                    sortedRows.forEach((row, index) => {
                                                        const rowId =
                                                            row.id?.toString() || index.toString();
                                                        newSelected[rowId] = true;
                                                    });
                                                }
                                                setSelectedRows(newSelected);
                                                setSelectedCount(checked ? sortedRows.length : 0);
                                            }}
                                        />
                                    </TableHead>
                                )}
                                {columnKeys.map((key, index) => (
                                    <TableHead
                                        key={key}
                                        className={`whitespace-nowrap text-[12px]  
                    ${index === 0 && key !== "checkbox"
                                                ? "rounded-l-sm"
                                                : index === columnsLength - 1
                                                    ? "rounded-r-sm"
                                                    : ""
                                            } text-gray-500 dark:text-white uppercase tracking-wider`}
                                    >
                                        <div className="flex items-center cursor-pointer">
                                            {enhancedHeaders[key]}
                                            {/* if the sort object is not undefined, then call the getSortIcon function to render the icons */}
                                            {/* and don't show the icon if the key is "actions" */}
                                            {sort && (
                                                <>
                                                    {key !== "actions" &&
                                                        key !== "checkbox" &&
                                                        getSortIcon(key)}
                                                </>
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>{renderTableContent()}</TableBody>
                    </Table>
                </div>
            </div>

            {/* pagination section */}
            {pagination && (
                <PaginationSection
                    totalPages={totalPages}
                    internalPagination={internalPagination}
                    setInternalPagination={setInternalPagination}
                    goToTheFirstPage={goToTheFirstPage}
                    goToNextPage={goToNextPage}
                    goToPrevPage={goToPrevPage}
                    goToTheLastPage={goToTheLastPage}
                    paginationArray={pagination.paginationRowsArray}
                />
            )}
        </Card>
    );
}

//Pagination functional component
function PaginationSection({
    internalPagination,
    setInternalPagination,
    totalPages,
    goToTheFirstPage,
    goToPrevPage,
    goToNextPage,
    goToTheLastPage,
    paginationArray,
}: {
    internalPagination: Pagination;
    setInternalPagination: Dispatch<SetStateAction<Pagination>>;
    totalPages: number;
    goToTheFirstPage: () => void;
    goToPrevPage: () => void;
    goToNextPage: () => void;
    goToTheLastPage: () => void;
    paginationArray?: Array<number>;
}) {
    const paginationRowsArray = paginationArray
        ? paginationArray
        : [2, 4, 6, 8, 10];

    return (
        <div className=" px-3 flex justify-between items-center  my-6">
            <div className="flex items-center gap-2 ">
                <span className="text-sm pr-1 text-neutral-60 dark:text-neutral-50">
                    Rows Per Page
                </span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-9 flex items-center pr-4">
                            <span>{internalPagination.rowsPerPage}</span>
                            <MdOutlineKeyboardArrowDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {paginationRowsArray.map((size) => (
                            <DropdownMenuItem
                                key={size}
                                onClick={() => {
                                    setInternalPagination({
                                        rowsPerPage: size,
                                        currentPage: 1, // Reset to first page when changing rows per page
                                    });
                                }}
                            >
                                {size}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {/*  */}
            </div>

            <div className="flex gap-2 items-center">
                {totalPages >= 1 && (
                    <div className="text-sm text-neutral-60 dark:text-neutral-50  ">
                        Page {internalPagination.currentPage} of {totalPages}
                    </div>
                )}

                <div className="ml-6 flex items-center gap-3">
                    {/* the first page */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={internalPagination.currentPage === 1}
                        onClick={goToTheFirstPage}
                        className="h-10"
                    >
                        <MdKeyboardDoubleArrowLeft />
                    </Button>
                    {/* previous page */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={internalPagination.currentPage === 1}
                        onClick={goToPrevPage}
                        className="h-10"
                    >
                        <IoIosArrowBack />
                    </Button>
                    {/* next page */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={internalPagination.currentPage >= totalPages}
                        onClick={goToNextPage}
                        className="h-10"
                    >
                        <IoIosArrowForward />
                    </Button>
                    {/* the last page */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={internalPagination.currentPage >= totalPages}
                        onClick={goToTheLastPage}
                        className="h-10"
                    >
                        <MdKeyboardDoubleArrowRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}

